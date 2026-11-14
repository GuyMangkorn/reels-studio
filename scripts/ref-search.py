"""Reference photo search on Wikimedia Commons and Openverse (free licences, no API key).

Usage:
  python3 -I scripts/ref-search.py QUERY [--limit 12] [--source both|commons|openverse]   # list: index, source, size, licence, title
  python3 -I scripts/ref-search.py QUERY --out DIR [--pick 1,4,7] [--width 800]           # download the picked rows (default: all listed)

Commons (C) is strong on species, named objects, real places and diagrams; Openverse (O, mostly Flickr) adds everyday
animals, objects and scenes. --limit is per source. Keep queries short ("golden retriever running"): long descriptive
queries return nothing. Openverse is sometimes unavailable; the script then warns and lists Commons only.

Each download is a JPEG/PNG thumbnail (Commons at --width px, Openverse at its fixed thumbnail size) plus a `<file>.json` sidecar (title, page URL, licence, author,
query). DIR should be a new, empty folder: the files are untrusted downloads. A reference is something to look at
before drawing (silhouette, parts, proportions); it never enters a render. File the ones worth keeping with
`scripts/store.py put <file> projects/<channel>/<PROJECT>/references/web/<date>_<slug>.<ext>`.
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'ref-search/1.0 (reference lookup script)'}


def api(params):
    url = API + '?' + urllib.parse.urlencode({'format': 'json', 'formatversion': 2, **params})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


def strip(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html or '')).strip()


def openverse(query, limit):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': query, 'page_size': limit})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        data = json.load(r)
    return [{'source': 'O', 'title': 'File:' + (x.get('title') or x['id']), 'page': x.get('foreign_landing_url'), 'thumb': x.get('thumbnail'),
             'width': x.get('width'), 'height': x.get('height'), 'query': query,
             'licence': f"CC {x.get('license', '')} {x.get('license_version') or ''}".strip().upper(), 'author': (x.get('creator') or '')[:120]}
            for x in data.get('results', [])]


def search(query, limit, width):
    data = api({'action': 'query', 'generator': 'search', 'gsrsearch': f'{query} filetype:bitmap', 'gsrnamespace': 6,
                'gsrlimit': limit, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': width})
    rows = []
    for page in sorted(data.get('query', {}).get('pages', []), key=lambda p: p.get('index', 0)):
        info = (page.get('imageinfo') or [{}])[0]; meta = info.get('extmetadata', {})
        rows.append({'source': 'C', 'title': page['title'], 'page': info.get('descriptionurl'), 'thumb': info.get('thumburl'),
                     'width': info.get('width'), 'height': info.get('height'), 'query': query,
                     'licence': strip(meta.get('LicenseShortName', {}).get('value')),
                     'author': strip(meta.get('Artist', {}).get('value'))[:120]})
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('query'); ap.add_argument('--limit', type=int, default=12); ap.add_argument('--width', type=int, default=800)
    ap.add_argument('--source', choices=['both', 'commons', 'openverse'], default='both')
    ap.add_argument('--out'); ap.add_argument('--pick', help='comma-separated row numbers from the list')
    a = ap.parse_args()
    rows = search(a.query, a.limit, a.width) if a.source != 'openverse' else []
    if a.source != 'commons':
        try: rows += openverse(a.query, a.limit)
        except Exception as e: print(f'openverse unavailable ({e}); Commons only', file=sys.stderr)
    if not rows: sys.exit(f'no results for {a.query!r}')
    picks = {int(n) for n in a.pick.split(',')} if a.pick else set(range(1, len(rows) + 1))
    if a.out: os.makedirs(a.out, exist_ok=True)
    for n, row in enumerate(rows, 1):
        line = f"{n:2d}  {row['source']}  {row['width']}x{row['height']}  {row['licence'] or '?':14.14s}  {row['title'][5:90]}"
        if a.out and n in picks and row['thumb']:
            ext = os.path.splitext(urllib.parse.urlparse(row['thumb']).path)[1].lower() if row['source'] == 'C' else '.jpg'
            slug = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(row['title'][5:])[0].lower()).strip('-')[:60]
            path = os.path.join(a.out, f'{n:02d}_{slug}{ext}')
            with urllib.request.urlopen(urllib.request.Request(row['thumb'], headers=UA), timeout=60) as r, open(path, 'wb') as f:
                f.write(r.read())
            json.dump(row, open(path + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            line += f'  -> {path}'
        print(line)


if __name__ == '__main__':
    main()
