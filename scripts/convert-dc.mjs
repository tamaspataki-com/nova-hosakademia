// One-off converter: design/NOVA.dc.html (Claude Design .dc format) -> React source in src/.
// Kept so a newer design export can be re-converted and diffed. Run: node scripts/convert-dc.mjs
// It overwrites src/App.jsx, src/AppView.jsx, src/screens/*, src/content.js, src/model.js,
// src/narrator.js and src/styles/interactions.css.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2] || join(ROOT, 'design/NOVA.dc.html');
const html = readFileSync(SRC, 'utf8');
const out = (p, s) => {
  mkdirSync(dirname(join(ROOT, p)), { recursive: true });
  writeFileSync(join(ROOT, p), s);
};

// ---------- template -> tree ----------
let tpl = html.slice(html.indexOf('<x-dc>') + 6, html.lastIndexOf('</x-dc>'));
tpl = tpl.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link']);
function parse(src) {
  const root = { tag: '#root', attrs: [], children: [] };
  const stack = [root];
  let i = 0;
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      i = src.indexOf('-->', i) + 3;
      continue;
    }
    if (src[i] === '<' && src[i + 1] === '/') {
      const end = src.indexOf('>', i);
      const name = src.slice(i + 2, end).trim();
      const top = stack.pop();
      if (top.tag !== name) throw new Error(`Mismatched </${name}> (open: ${top.tag}) at ${i}`);
      i = end + 1;
      continue;
    }
    if (src[i] === '<' && /[a-zA-Z]/.test(src[i + 1])) {
      let j = i + 1;
      while (/[a-zA-Z0-9-]/.test(src[j])) j++;
      const node = { tag: src.slice(i + 1, j), attrs: [], children: [] };
      // attributes
      for (;;) {
        while (/\s/.test(src[j])) j++;
        if (src[j] === '>' || (src[j] === '/' && src[j + 1] === '>')) break;
        let k = j;
        while (!/[\s=>]/.test(src[k])) k++;
        const name = src.slice(j, k);
        j = k;
        let value = '';
        if (src[j] === '=') {
          const q = src[j + 1];
          if (q !== '"' && q !== "'") throw new Error(`Unquoted attribute ${name}`);
          const e = src.indexOf(q, j + 2);
          value = src.slice(j + 2, e);
          j = e + 1;
        }
        node.attrs.push([name, value]);
      }
      const selfClose = src[j] === '/';
      j += selfClose ? 2 : 1;
      stack[stack.length - 1].children.push(node);
      if (!selfClose && !VOID.has(node.tag)) stack.push(node);
      i = j;
      continue;
    }
    let j = src.indexOf('<', i);
    if (j === -1) j = src.length;
    stack[stack.length - 1].children.push({ text: src.slice(i, j) });
    i = j;
  }
  if (stack.length !== 1) throw new Error('Unclosed ' + stack.at(-1).tag);
  return root;
}

// ---------- expressions ----------
function expr(e, scope) {
  e = e.trim();
  if (e[0] === '!') return `!${expr(e.slice(1), scope)}`;
  if (/^(true|false|null|undefined)$/.test(e) || /^-?\d+(\.\d+)?$/.test(e)) return e;
  if (/^(['"]).*\1$/.test(e)) return JSON.stringify(e.slice(1, -1));
  const m = e.match(/^([A-Za-z_$][\w$]*)((?:\.[\w$]+)*)$/);
  if (!m) throw new Error('Unsupported expression: ' + e);
  const [, head, rest] = m;
  const segs = rest ? rest.slice(1).split('.') : [];
  // The runtime resolves paths null-safely, so every step after the first is optional.
  // Loop items are never null, so their first property access stays plain.
  const isLoopVar = scope.includes(head);
  const base = isLoopVar ? head : `v.${head}`;
  return base + segs.map((s, i) => (/^\d+$/.test(s) ? `?.[${s}]` : (isLoopVar && i === 0 ? '.' : '?.') + s)).join('');
}
const WHOLE = /^\s*\{\{([\s\S]+?)\}\}\s*$/;
function interp(raw, scope) {
  // -> JS expression producing the string, runtime-equivalent (missing values -> '').
  const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
  return '`' + parts.map((p, i) => (i & 1 ? '${' + expr(p, scope) + " ?? ''}" : p.replace(/[`\\$]/g, '\\$&'))).join('') + '`';
}

// ---------- styles ----------
const camel = (p) => (p.startsWith('--') ? p : p.replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
function styleObj(raw, scope) {
  const props = [];
  for (const decl of raw.split(';')) {
    const c = decl.indexOf(':');
    if (c < 0) continue;
    const prop = decl.slice(0, c).trim();
    const val = decl.slice(c + 1).trim();
    if (prop.includes('{{')) throw new Error('Interpolated style property: ' + raw);
    const key = /^[A-Za-z_$][\w$]*$/.test(camel(prop)) ? camel(prop) : JSON.stringify(camel(prop));
    let js;
    if (!val.includes('{{')) js = JSON.stringify(val);
    else if (WHOLE.test(val)) js = expr(val.match(WHOLE)[1], scope);
    else js = interp(val, scope);
    props.push(`${key}: ${js}`);
  }
  return `{{ ${props.join(', ')} }}`;
}
const pseudo = new Map();
function pseudoClass(kind, css) {
  const k = kind + '|' + css;
  if (!pseudo.has(k)) pseudo.set(k, { cls: `nv-${kind}-${pseudo.size}`, kind, css });
  return pseudo.get(k).cls;
}
const importantify = (css) =>
  css
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (d.includes('!important') ? d : d + ' !important'))
    .join(';');

// ---------- JSX emit ----------
const ATTR = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', autofocus: 'autoFocus', autocomplete: 'autoComplete', maxlength: 'maxLength', inputmode: 'inputMode' };
const INLINE = new Set(['span', 'a', 'b', 'strong', 'em', 'i', 'mark', 'img', 'small', 'code', 'label']);
const isInline = (n) => {
  if (!n || !n.tag) return false;
  if (n.tag === 'sc-if' || n.tag === 'sc-for') return isInline(n.children.find((c) => c.tag));
  return INLINE.has(n.tag);
};

function attrJsx(name, value, scope) {
  const key = ATTR[name] || name;
  if (WHOLE.test(value)) {
    let js = expr(value.match(WHOLE)[1], scope);
    if (key === 'value') js += " ?? ''";
    if (key === 'checked') js += ' ?? false';
    return `${key}={${js}}`;
  }
  if (value.includes('{{')) return `${key}={${interp(value, scope)}}`;
  if (value.includes('"')) return `${key}={${JSON.stringify(value)}}`;
  return `${key}="${value}"`;
}

function textJsx(raw) {
  // JSX text cannot hold { } < >; use a string literal then.
  return /[{}<>]/.test(raw) ? `{${JSON.stringify(raw)}}` : raw;
}

function emitText(node, prev, next, scope, inInline) {
  const raw = node.text;
  if (!raw.trim()) {
    // Runtime drops newline-only runs; keep a single space only where it can be visible.
    if (!raw.includes(' ')) return '';
    if (!raw.includes('\n') && prev && next) return '{" "}';
    return isInline(prev) && isInline(next) ? '{" "}' : '';
  }
  // Edge spaces matter next to siblings, and anywhere inside inline elements.
  const lead = /^\s/.test(raw) && (prev || inInline) ? '{" "}' : '';
  const trail = /\s$/.test(raw) && (next || inInline) ? '{" "}' : '';
  const body = raw.trim().replace(/\s+/g, ' ');
  const parts = body.split(/\{\{([\s\S]+?)\}\}/g);
  const inner = parts.map((p, i) => (i & 1 ? `{${expr(p, scope)}}` : textJsx(p))).join('');
  // Keep spaces that touch an interpolation (JSX would trim them at line edges).
  return lead + inner.replace(/^ | $/g, '{" "}') + trail;
}

function emitChildren(children, scope, parent) {
  const inInline = !!parent && INLINE.has(parent.tag);
  return children
    .map((c, i) => (c.text != null ? emitText(c, children[i - 1], children[i + 1], scope, inInline) : emit(c, scope)))
    .filter(Boolean)
    .join('\n');
}
const elementKids = (n) => n.children.filter((c) => c.tag || (c.text && c.text.trim()));

function emitBlock(children, scope, key) {
  const kids = elementKids({ children });
  if (kids.length === 1 && kids[0].tag && !kids[0].tag.startsWith('sc-')) return emit(kids[0], scope, key);
  return `<Fragment${key ? ` key={${key}}` : ''}>\n${emitChildren(children, scope)}\n</Fragment>`;
}

function emit(n, scope, key) {
  if (n.tag === '#screen') return `{v.${n.cond} ? <${n.name} v={v} /> : null}`;
  const attrs = Object.fromEntries(n.attrs);
  if (n.tag === 'sc-if') {
    const cond = expr(attrs.value.match(WHOLE)[1], scope);
    return `{${cond} ? (\n${emitBlock(n.children, scope)}\n) : null}`;
  }
  if (n.tag === 'sc-for') {
    const as = attrs.as || 'item';
    const idx = `${as}Index`;
    const list = expr(attrs.list.match(WHOLE)[1], scope);
    return `{list(${list}).map((${as}, ${idx}) => (\n${emitBlock(n.children, [...scope, as], idx)}\n))}`;
  }
  const parts = [];
  if (key) parts.push(`key={${key}}`);
  const classes = [];
  for (const [name, value] of n.attrs) {
    if (name.startsWith('hint-')) continue;
    if (name === 'style') parts.push(`style=${styleObj(value, scope)}`);
    else if (name.startsWith('style-')) {
      if (value.includes('{{')) throw new Error('Interpolated pseudo style');
      classes.push(pseudoClass(name.slice(6), value));
    } else parts.push(attrJsx(name, value, scope));
  }
  if (classes.length) parts.push(`className="${classes.join(' ')}"`);
  const open = `<${n.tag}${parts.length ? ' ' + parts.join(' ') : ''}`;
  if (VOID.has(n.tag)) return open + ' />';
  const kids = emitChildren(n.children, scope, n);
  return kids ? `${open}>\n${kids}\n</${n.tag}>` : `${open}></${n.tag}>`;
}

// ---------- split into screens ----------
const tree = parse(tpl);
const rootDiv = tree.children.find((c) => c.tag === 'div');
const SCREEN_NAMES = {
  showRail: 'RailNav', sWelcome: 'Welcome', sHome: 'Home', sMap: 'MapScreen', sGear: 'Gear', sRest: 'Rest',
  sParent: 'Parent', sPractice: 'Practice', sMission: 'Mission', showBottomNav: 'BottomNav', sheetOpen: 'Sheet'
};
const screens = [];
function screenRef(ifNode) {
  const cond = ifNode.attrs.find(([k]) => k === 'value')[1].match(WHOLE)[1].trim();
  const name = SCREEN_NAMES[cond];
  if (!name) throw new Error('Unknown top-level section ' + cond);
  screens.push({ name, node: ifNode });
  return { tag: '#screen', name, cond };
}
// Replace top-level sc-if sections (also those inside <main>) with component references.
rootDiv.children = rootDiv.children.map((c) => (c.tag === 'sc-if' ? screenRef(c) : c));
const mainEl = rootDiv.children.find((c) => c.tag === 'main');
mainEl.children = mainEl.children.map((c) => (c.tag === 'sc-if' ? screenRef(c) : c));

const header = '// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.\n';
for (const s of screens) {
  const body = emitBlock(s.node.children, []);
  const usesFragment = body.includes('<Fragment');
  const usesList = body.includes('list(');
  const imports = [
    usesFragment ? "import { Fragment } from 'react';" : '',
    usesList ? "import { list } from '../dc.js';" : ''
  ].filter(Boolean).join('\n');
  out(`src/screens/${s.name}.jsx`, `${header}${imports}\n\nexport default function ${s.name}({ v }) {\n  return (\n${body}\n  );\n}\n`);
}
const viewBody = emit(rootDiv, []);
out(
  'src/AppView.jsx',
  `${header}${screens.map((s) => `import ${s.name} from './screens/${s.name}.jsx';`).join('\n')}\n\n` +
    `// Layout shell: picks the active screen and navigation from the flat view-model \`v\` (App.renderVals()).\n` +
    `export default function AppView({ v }) {\n  return (\n${viewBody}\n  );\n}\n`
);
out(
  'src/styles/interactions.css',
  `/* Hover/press states (style-hover / style-active in the design file). !important beats inline styles. */\n` +
    [...pseudo.values()].map((p) => `.${p.cls}:${p.kind} { ${importantify(p.css)} }`).join('\n') + '\n'
);

// ---------- logic ----------
const script = html.slice(html.indexOf('<script type="text/x-dc" data-dc-script>') + 41, html.lastIndexOf('</script>'));
const lines = script.split('\n');
const classStart = lines.findIndex((l) => l.startsWith('class Component extends DCLogic'));
const pre = lines.slice(0, classStart);
const cls = lines.slice(classStart);

// Top-level declarations before the class, grouped into modules.
const blocks = [];
for (const l of pre) {
  const m = l.match(/^(?:const|function|let)\s+([A-Za-z_$][\w$]*)/);
  if (m || l.startsWith('//') || !blocks.length) blocks.push({ name: m ? m[1] : null, lines: [l] });
  else blocks.at(-1).lines.push(l);
}
const MODULE_OF = (name) =>
  name === 'Narrator' ? 'narrator' :
  /^(STORE|freshMission|freshRun|defaultProg|blankHw|loadSaved|fmt|ICON_OK)$/.test(name) ? 'model' : 'content';
const mods = { content: [], model: [], narrator: [] };
let pendingComment = [];
for (const b of blocks) {
  if (!b.name) {
    pendingComment.push(...b.lines.filter((l) => l.trim()));
    continue;
  }
  const mod = MODULE_OF(b.name);
  mods[mod].push(...pendingComment, ...b.lines.map((l, i) => (i === 0 ? 'export ' + l : l)));
  pendingComment = [];
}
const exportsOf = (src) => [...src.join('\n').matchAll(/^export (?:const|function|let)\s+([^=({]+)/gm)]
  .flatMap((m) => m[1].split(',')).map((s) => s.trim().split(/\s/)[0]).filter(Boolean);
// ICON_OK line declares two names.
const extraNames = (src) => [...src.join('\n').matchAll(/^export const [^\n]*?,\s*([A-Za-z_$][\w$]*)\s*=/gm)].map((m) => m[1]);

const modelUses = (name) => new RegExp(`\\b${name}\\b`);
const contentNames = exportsOf(mods.content);
const modelImportsContent = contentNames.filter((n) => mods.model.some((l) => modelUses(n).test(l)));
out('src/content.js', `${header}// Authored learning content: mission, tools, map, practice passages, labels.\n\n${mods.content.join('\n')}\n`);
out(
  'src/model.js',
  `${header}// State factories, persistence and formatting helpers.\n` +
    (modelImportsContent.length ? `import { ${modelImportsContent.join(', ')} } from './content.js';\n` : '') +
    `\n${mods.model.join('\n')}\n`
);
out('src/narrator.js', `${header}\n${mods.narrator.join('\n')}\n`);

const body = cls.join('\n');
const used = (names) => names.filter((n) => new RegExp(`\\b${n}\\b`).test(body));
const modelNames = [...exportsOf(mods.model), ...extraNames(mods.model)];
const lastBrace = body.lastIndexOf('}');
const appSrc =
  header +
  `import React from 'react';\nimport AppView from './AppView.jsx';\n` +
  `import { ${used(contentNames).join(', ')} } from './content.js';\n` +
  `import { ${used(modelNames).join(', ')} } from './model.js';\n` +
  `import { Narrator } from './narrator.js';\n\n` +
  body.slice(0, lastBrace).replace('class Component extends DCLogic {', 'export default class App extends React.Component {') +
  `\n  render() {\n    return <AppView v={this.renderVals()} />;\n  }\n}\n`;
out('src/App.jsx', appSrc);
console.log(`screens: ${screens.map((s) => s.name).join(', ')}; pseudo classes: ${pseudo.size}`);
