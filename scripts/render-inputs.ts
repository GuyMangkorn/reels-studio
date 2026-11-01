// Internal helper for segments.mjs. One JSON request on stdin: {root, id, props}; one digest on stdout.
// Follow actual local imports, selecting only the painted inventories used by the effective project timeline.
// Any uncertainty throws; the caller must bypass cache reuse, never fall back to a possibly stale key.
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, realpathSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

type Request = {root: string; id: string; props: Record<string, unknown>};
const media = /\.(?:mp4|mov|webm|png|jpe?g|webp|gif|svg|ttf|otf|woff2?)(?:[?#].*)?$/i;
function fail(message: string): never {throw new Error(message);}
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';

async function digest({root: requestedRoot, id, props}: Request) {
  const root = realpathSync(requestedRoot);
  const files = new Set<string>();
  const add = (file: string) => {
    if (!existsSync(file)) fail(`Missing render input: ${path.relative(root, file)}`);
    files.add(realpathSync(file));
  };
  const configFile = ts.findConfigFile(root, ts.sys.fileExists);
  let options: ts.CompilerOptions = {moduleResolution: ts.ModuleResolutionKind.Bundler, resolveJsonModule: true, allowJs: true};
  if (configFile) {
    add(configFile);
    const config = ts.readConfigFile(configFile, ts.sys.readFile);
    if (config.error || config.config.extends) fail('Unsupported or invalid TypeScript configuration');
    const converted = ts.convertCompilerOptionsFromJson(config.config.compilerOptions ?? {}, root);
    if (converted.errors.length) fail('Invalid TypeScript compiler options');
    options = {...options, ...converted.options};
  }
  const resolve = (specifier: string, owner: string) => {
    const resolved = ts.resolveModuleName(specifier, owner, options, ts.sys).resolvedModule;
    if (resolved && !resolved.isExternalLibraryImport && !resolved.resolvedFileName.includes('/node_modules/')) return realpathSync(resolved.resolvedFileName);
    if (specifier.startsWith('.') || specifier.startsWith('/') || !resolved) fail(`Unresolved import in ${path.relative(root, owner)}: ${specifier}`);
    return undefined; // Installed packages are covered by package-lock.json.
  };
  const parse = (file: string) => ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const imports = (file: string) => parse(file).statements.flatMap<{file: string; statement: ts.Statement}>(statement => {
    if (ts.isImportEqualsDeclaration(statement) && ts.isExternalModuleReference(statement.moduleReference)) {
      const expression = statement.moduleReference.expression;
      if (!expression || !ts.isStringLiteral(expression)) fail('Unsupported import-equals dependency');
      const dependency = resolve(expression.text, file);
      return dependency ? [{file: dependency, statement}] : [];
    }
    if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      const dependency = resolve(statement.moduleSpecifier.text, file);
      return dependency ? [{file: dependency, statement}] : [];
    }
    return [];
  });

  // Load project declarations in a fresh process: no stale module cache between renders or worktrees.
  const owners: string[] = [];
  for (const entry of readdirSync(path.join(root, 'src/videos'), {withFileTypes: true})) {
    const file = path.join(root, 'src/videos', entry.name, 'index.ts');
    if (!entry.isDirectory() || !existsSync(file)) continue;
    const module = await import(pathToFileURL(file).href);
    if (module.default?.videos?.some((video: {id: string}) => video.id === id)) owners.push(file);
  }
  if (owners.length !== 1) fail(`Cannot determine unique project for composition ${id}`);
  const project = owners[0];
  const registry = path.join(root, 'src/painted/registry.ts');
  const inventories = new Set<string>();
  const wanted = new Set<string>();
  const timeline = props.timeline;
  if (!Array.isArray(timeline)) fail('Missing effective timeline');
  for (const scene of timeline) {
    for (const cue of scene.painted?.shots ?? []) wanted.add(cue.shot);
  }
  const registryImports = existsSync(registry) ? imports(registry) : [];
  const selected = new Set<string>();
  if (wanted.size) {
    const catalogue = (await import(pathToFileURL(registry).href)).paintedShots;
    for (const shot of wanted) if (!catalogue?.[shot]) fail(`Unknown painted shot: ${shot}`);
    for (const {file, statement} of registryImports) {
      if (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly) continue;
      const module = await import(pathToFileURL(file).href);
      const shots = Object.values(module).flatMap(value => Array.isArray(value) ? value : []);
      // Identity checks make this work for generated IDs and aliases, without guessing from ID prefixes.
      if (shots.some(shot => record(shot) && catalogue[shot.id as string] === shot)) {
        inventories.add(file);
        for (const shot of wanted) if (shots.includes(catalogue[shot])) selected.add(file);
      }
    }
    for (const shot of wanted) {
      let found = false;
      for (const file of selected) {
        const module = await import(pathToFileURL(file).href);
        if (Object.values(module).some(value => Array.isArray(value) && value.includes(catalogue[shot]))) found = true;
      }
      if (!found) fail(`Cannot determine painted inventory for ${shot}`);
    }
  } else {
    // The registry is a dispatch table, not a dependency on every project's art.
    for (const {file, statement} of registryImports) {
      if (ts.isImportDeclaration(statement) && !statement.importClause?.isTypeOnly) inventories.add(file);
    }
  }

  const pictureMedia = new Set<string>();
  const addMedia = (value: string, required: boolean) => {
    if (!required && !media.test(value)) return;
    if (/^(?:https?:|data:|blob:)/i.test(value)) fail('Remote media cannot be content-verified');
    const file = path.resolve(root, 'public', value.replace(/^\/?(?:public\/)?/, '').split(/[?#]/)[0]);
    if (required || existsSync(file)) {
      add(file);
      pictureMedia.add(realpathSync(file));
    }
  };
  const visitProps = (value: unknown, key = ''): void => {
    if (key === 'audio' || key === 'sfx') return; // Sound is rendered afresh, independently of picture segments.
    if (key === 'narration' && record(value)) {
      for (const [name, field] of Object.entries(value)) if (name !== 'src') visitProps(field, name);
    } else if (typeof value === 'string') addMedia(value, key === 'src');
    else if (record(value)) for (const [name, field] of Object.entries(value)) visitProps(field, name);
  };
  visitProps(props);

  const visited = new Set<string>();
  const walk = (file: string): void => {
    if (visited.has(file)) return;
    visited.add(file);
    add(file);
    if (file.endsWith('.json')) return;
    const source = parse(file);
    let checker: ts.TypeChecker | undefined;
    const staticMediaPath = (expression: ts.Expression | undefined): string | undefined => {
      if (!expression) return undefined;
      if (ts.isStringLiteralLike(expression)) return expression.text;
      if (!ts.isPropertyAccessExpression(expression) || !ts.isIdentifier(expression.expression)) return undefined;
      // Resolve the actual lexical binding, not a name-only lookup: an inner parameter may shadow a constant.
      if (!checker) {
        const settings = {noResolve: true, noLib: true};
        const host = ts.createCompilerHost(settings);
        host.getSourceFile = name => name === file ? source : undefined;
        checker = ts.createProgram([file], settings, host).getTypeChecker();
      }
      const declaration = checker.getSymbolAtLocation(expression.expression)?.valueDeclaration;
      if (!declaration || !ts.isVariableDeclaration(declaration) || !(declaration.parent.flags & ts.NodeFlags.Const)) return undefined;
      const value = declaration.initializer;
      if (!value || !ts.isAsExpression(value) || value.type.getText(source) !== 'const' || !ts.isObjectLiteralExpression(value.expression)) return undefined;
      if (value.expression.properties.some(p => !ts.isPropertyAssignment(p) || ts.isComputedPropertyName(p.name))) return undefined;
      const properties = value.expression.properties.filter(p => ts.isPropertyAssignment(p) && p.name.getText(source) === expression.name.text);
      if (properties.length !== 1) return undefined;
      const property = properties[0];
      return property && ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer) ? property.initializer.text : undefined;
    };
    const staticFileNames = new Set(['staticFile']);
    for (const statement of source.statements) {
      if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) {
        for (const name of statement.importClause.namedBindings.elements) {
          if ((name.propertyName ?? name.name).text === 'staticFile') staticFileNames.add(name.name.text);
        }
      }
    }
    for (const dependency of imports(file)) {
      if (file === registry && inventories.has(dependency.file) && !selected.has(dependency.file)) continue;
      walk(dependency.file);
    }
    const visit = (node: ts.Node): void => {
      if (ts.isStringLiteralLike(node)) addMedia(node.text, false);
      if (ts.isJsxAttribute(node) && ['src', 'href'].includes(node.name.getText(source))) {
        const tag = node.parent.parent.tagName.getText(source);
        if (['Img', 'img', 'Video', 'OffthreadVideo', 'image'].includes(tag)) {
          const value = node.initializer && ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer;
          if (value && ts.isStringLiteralLike(value)) addMedia(value.text, true);
          else if (file !== path.join(root, 'src/scenes/MediaLayers.tsx') &&
            !(value && ts.isCallExpression(value) && (staticFileNames.has(value.expression.getText(source)) || value.expression.getText(source).endsWith('.staticFile')))) {
            fail(`Computed picture source in ${path.relative(root, file)}`);
          }
        }
      }
      if (ts.isCallExpression(node)) {
        const call = node.expression.getText(source);
        if (staticFileNames.has(call) || call.endsWith('.staticFile')) {
          const argument = node.arguments[0];
          const literal = staticMediaPath(argument);
          if (literal !== undefined) addMedia(literal, true);
          else if (!((file === path.join(root, 'src/scenes/SceneRenderer.tsx') && argument?.getText(source) === 'narration.src') ||
            (file === path.join(root, 'src/scenes/media.ts') && argument?.getText(source) === 'src'))) {
            fail(`Computed staticFile path in ${path.relative(root, file)}`);
          }
        }
        if (call === 'fetch' || call === 'loadImage' || call.endsWith('.loadImage')) fail('Runtime asset loading cannot be content-verified');
        if (node.expression.kind === ts.SyntaxKind.ImportKeyword || call === 'require') {
          const specifier = node.arguments[0];
          if (!specifier || !ts.isStringLiteralLike(specifier)) fail(`Dynamic dependency in ${path.relative(root, file)}`);
          const dependency = resolve(specifier.text, file);
          if (dependency) walk(dependency);
        }
        if (call === 'require.context' && !(file === path.join(root, 'src/Root.tsx') && node.getText(source) === "require.context('./videos', true, /^\\.\\/[^/]+\\/index\\.ts$/)")) fail('Unsupported module discovery');
      }
      if (ts.isNewExpression(node) && node.expression.getText(source) === 'URL') fail('URL asset discovery is unsupported');
      ts.forEachChild(node, visit);
    };
    visit(source);
  };
  walk(path.join(root, 'src/index.ts'));
  // Project declarations produce serialized props. Hashing their source would invalidate every scene
  // for a one-caption edit. Runtime art is reached through the selected inventories instead.
  selected.forEach(walk);
  add(path.join(root, 'package-lock.json'));
  for (const file of ['remotion.config.ts', 'webpack.config.js']) {
    if (existsSync(path.join(root, file))) walk(path.join(root, file));
  }
  // Render tooling (scripts/render.mjs, segments.mjs, this helper) is left out: its pixel settings are in the segment
  // keys already, and hashing it would ask about every pin after a CLI edit. Bump the version when the key logic changes.
  const hash = createHash('sha256').update('project-render-inputs-v1');
  const lock = path.join(path.dirname(project), 'assets.lock.json');
  if (existsSync(lock)) {
    const entries = Object.entries(JSON.parse(readFileSync(lock, 'utf8'))).filter(([file]) => {
      const local = path.resolve(root, file);
      return existsSync(local) && pictureMedia.has(realpathSync(local));
    }).sort(([a], [b]) => a.localeCompare(b));
    // A sound-only lock edit must not discard picture segments.
    hash.update(JSON.stringify(entries));
  }
  for (const file of [...files].sort()) hash.update(path.relative(root, file)).update('\0').update(readFileSync(file)).update('\0');
  return hash.digest('hex');
}

async function main() {
  const request: Request = JSON.parse(readFileSync(0, 'utf8'));
  console.log(JSON.stringify({hash: await digest(request)}));
}
main().catch(error => {
  console.log(JSON.stringify({error: error instanceof Error ? error.message : 'Render input discovery failed'}));
  process.exitCode = 1;
});
