"""Serve a built storyboard review page and save the user's verdicts to reviews.json (.agents/skills/review-page/SKILL.md).

Usage: python3 -I scripts/storyboard-page/serve.py storyboards/<episode>/<variant>/review-rows.json [--out DIR] [--port N] [--lan]
Serves DIR (default out/review-pages/<deliverable>/, the same folder build.py writes) at http://127.0.0.1:<port>/.
Verdicts go to reviews.json beside review-rows.json, one entry per key "<shot>@<board|draft|final>" or "<Qid>",
re-read and re-written on every save, so an agent may edit the file while the server runs.
  GET  /api/reviews        -> {"reviews": {...}, "page": "<index.html stamp>"}; ETag, 304 when unchanged
  POST /api/reviews/<key>  -> body is the verdict object; replaces that entry
--lan binds 0.0.0.0 so a phone on the same Wi-Fi can open the page. Video files support Range requests (seeking).
"""
import email.utils, hashlib, json, os, re, sys, threading, urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = re.compile(r'^[A-Za-z0-9][A-Za-z0-9_.-]*(@(board|draft|final))?$')
FIELDS = ('shot', 'stage', 'status', 'note', 'rev', 'hash', 'clip', 'updatedAt', 'prev')
LOCK = threading.Lock()


def read_reviews(path):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def write_reviews(path, reviews):
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write('\n')
    os.replace(tmp, path)


def make_handler(page_dir, reviews_path):
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=page_dir, **kw)

        def log_message(self, *a):
            pass

        def send_json(self, code, body, etag=None):
            data = json.dumps(body, ensure_ascii=False).encode()
            self.send_response(code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            if etag:
                self.send_header('ETag', etag)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def end_headers(self):
            if not self.path.startswith('/api/'):
                self.send_header('Cache-Control', 'no-cache')
            super().end_headers()

        def do_GET(self):
            if self.path.split('?')[0] == '/api/reviews':
                with LOCK:
                    reviews = read_reviews(reviews_path)
                try:
                    page = str(os.stat(os.path.join(page_dir, 'index.html')).st_mtime_ns)
                except FileNotFoundError:
                    page = ''
                body = {'reviews': reviews, 'page': page}
                etag = '"' + hashlib.sha1(json.dumps(body, sort_keys=True).encode()).hexdigest()[:16] + '"'
                if self.headers.get('If-None-Match') == etag:
                    self.send_response(304)
                    self.send_header('ETag', etag)
                    self.end_headers()
                    return
                return self.send_json(200, body, etag)
            if self.headers.get('Range') and self.send_range():
                return
            super().do_GET()

        def do_POST(self):
            m = re.fullmatch(r'/api/reviews/([^/?]+)', self.path)
            key = m and urllib.parse.unquote(m.group(1))
            if not key or not KEY.match(key):
                return self.send_json(400, {'error': 'bad key'})
            try:
                v = json.loads(self.rfile.read(int(self.headers.get('Content-Length') or 0)))
                assert isinstance(v, dict)
            except Exception:
                return self.send_json(400, {'error': 'body must be a JSON object'})
            v = {k: v[k] for k in FIELDS if k in v}
            with LOCK:
                reviews = read_reviews(reviews_path)
                reviews[key] = v
                write_reviews(reviews_path, reviews)
            self.send_json(200, {'ok': True})

        def send_range(self):
            """Serve one byte range of a static file (Safari needs it for video; seeking needs it everywhere)."""
            path = self.translate_path(self.path)
            m = re.fullmatch(r'bytes=(\d*)-(\d*)', self.headers['Range'].strip())
            if not m or not os.path.isfile(path):
                return False
            size = os.path.getsize(path)
            if m.group(1):
                start, end = int(m.group(1)), int(m.group(2) or size - 1)
            else:
                start, end = max(0, size - int(m.group(2) or 0)), size - 1
            end = min(end, size - 1)
            if start > end:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.end_headers()
                return True
            self.send_response(206)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.send_header('Content-Length', str(end - start + 1))
            self.send_header('Last-Modified', email.utils.formatdate(os.path.getmtime(path), usegmt=True))
            self.end_headers()
            with open(path, 'rb') as f:
                f.seek(start)
                left = end - start + 1
                while left > 0:
                    chunk = f.read(min(left, 1 << 16))
                    if not chunk:
                        break
                    try:
                        self.wfile.write(chunk)
                    except (BrokenPipeError, ConnectionResetError):
                        break
                    left -= len(chunk)
            return True

    return Handler


def lan_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        return s.getsockname()[0]
    except OSError:
        return '127.0.0.1'
    finally:
        s.close()


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith('-'):
        sys.exit(__doc__)
    rows_path = os.path.abspath(args[0])
    with open(rows_path, encoding='utf-8') as f:
        deliverable = json.load(f)['deliverable']
    page_dir = os.path.abspath(args[args.index('--out') + 1]) if '--out' in args else os.path.join(ROOT, 'out', 'review-pages', deliverable)
    if not os.path.isfile(os.path.join(page_dir, 'index.html')):
        sys.exit(f'no index.html in {page_dir}: run build.py first')
    port = int(args[args.index('--port') + 1]) if '--port' in args else 8765
    host = '0.0.0.0' if '--lan' in args else '127.0.0.1'
    reviews_path = os.path.join(os.path.dirname(rows_path), 'reviews.json')
    server = ThreadingHTTPServer((host, port), make_handler(page_dir, reviews_path))
    print(f'review page: http://127.0.0.1:{port}/' + (f'  (phone: http://{lan_ip()}:{port}/)' if host == '0.0.0.0' else ''))
    print(f'verdicts:    {os.path.relpath(reviews_path, ROOT)}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
