// Small DOM helpers. All text goes in as text nodes (never innerHTML from data).
import { assetUrl } from './content-loader.js';

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k === 'style') el.setAttribute('style', v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/** Text with **highlight** and ~~removed~~ marks → safe fragment. */
export function rich(text) {
  const frag = document.createDocumentFragment();
  const re = /\*\*(.+?)\*\*|~~(.+?)~~/g;
  let last = 0;
  let m;
  const src = String(text ?? '');
  while ((m = re.exec(src))) {
    if (m.index > last) frag.append(src.slice(last, m.index));
    if (m[1] !== undefined) frag.append(h('strong', { class: 'hl' }, m[1]));
    else frag.append(h('s', { class: 'gone', 'aria-label': `removed: ${m[2]}` }, m[2]));
    last = re.lastIndex;
  }
  if (last < src.length) frag.append(src.slice(last));
  return frag;
}

export function plain(text) {
  return String(text ?? '').replace(/\*\*|~~/g, '');
}

// ---------- icons (small UI icons only) ----------
const ICONS = {
  home: 'M3 11 12 3l9 8v10h-6v-6H9v6H3z',
  back: 'M15 5 8 12l7 7',
  next: 'M9 5l7 7-7 7',
  prev: 'M15 5 8 12l7 7',
  check: 'M4 12l5 5L20 6',
  cross: 'M6 6l12 12M18 6 6 18',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.2 6.6C3.6 8.3 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1',
  undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  clear: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  restart: 'M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0 0 12.4 2M18.5 9A7 7 0 0 0 6.1 7',
  full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  sound: 'M4 10v4h4l5 4V6L8 10H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  board: 'M3 4h18v12H3zM8 20h8M12 16v4',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5',
  key: 'M14 10a4 4 0 1 0-3.5 4l1.5 1.5H14V17h1.5v1.5H17l1-1v-2.5L14 10z',
  words: 'M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z',
  learn: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  practise: 'M9 11l3 3 8-8M20 12v7H4V5h11',
  play: 'M7 4v16l13-8z',
  speak: 'M4 5h16v10H9l-5 4z',
  door: 'M6 21V4h12v17M3 21h18M14 13h.01',
  lock: 'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3',
  envelope: 'M3 6h18v12H3zM3 6l9 7 9-7',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2',
  shuffle: 'M4 7h3l10 10h3M4 17h3l3-3M14 10l3-3h3M18 4l3 3-3 3M18 14l3 3-3 3',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  single: 'M5 5h14v14H5z',
  note: 'M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h6'
};

export function icon(name, { size = 22, label } = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('class', 'icon');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  if (label) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label); }
  else svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', ICONS[name] || ICONS.star);
  svg.append(path);
  return svg;
}

export function button(label, { icon: iconName, kind = 'secondary', onClick, attrs = {}, iconOnly = false, title } = {}) {
  const b = h('button', { type: 'button', class: `btn btn-${kind}${iconOnly ? ' btn-icon' : ''}`, title: title || (iconOnly ? label : undefined), 'aria-label': iconOnly ? label : undefined, ...attrs });
  if (iconName) b.append(icon(iconName));
  if (!iconOnly) b.append(h('span', { class: 'btn-label' }, label));
  if (onClick) b.addEventListener('click', onClick);
  return b;
}

export function link(label, href, { kind = 'secondary', icon: iconName, attrs = {} } = {}) {
  const a = h('a', { href, class: `btn btn-${kind}`, ...attrs });
  if (iconName) a.append(icon(iconName));
  a.append(h('span', { class: 'btn-label' }, label));
  return a;
}

// ---------- pictures ----------
/**
 * Responsive picture with a clear message if the file cannot load.
 * img = {src (without -sm/-lg.webp), w, h, alt}
 */
export function picture(img, { className = '', eager = false, sizes = '(max-width: 760px) 92vw, 50vw', decorative = false } = {}) {
  const fig = h('figure', { class: `pic ${className}` });
  if (!img) {
    fig.append(missing('Picture not available'));
    return fig;
  }
  // Two ways to add a picture: {src} → src-sm.webp + src-lg.webp (made by npm run images),
  // or {file} → one ready file (jpg / png / webp), handy when adding a week without tools.
  const el = h('img', {
    src: assetUrl(img.file ? img.file : `${img.src}-sm.webp`),
    srcset: img.file ? undefined : `${assetUrl(`${img.src}-sm.webp`)} 720w, ${assetUrl(`${img.src}-lg.webp`)} 1400w`,
    sizes: img.file ? undefined : sizes,
    width: img.w || 1400,
    height: img.h || 1050,
    alt: decorative ? '' : img.alt || '',
    loading: eager ? 'eager' : 'lazy',
    decoding: 'async'
  });
  el.addEventListener('error', () => {
    el.replaceWith(missing(img.alt ? `Picture not available: ${img.alt}` : 'Picture not available'));
    fig.classList.add('pic-failed');
  }, { once: true });
  fig.append(el);
  return fig;
}

function missing(text) {
  return h('div', { class: 'pic-missing', role: 'img', 'aria-label': text }, icon('eyeOff', { size: 28 }), h('span', {}, 'Picture not available'));
}

export function preloadImage(img) {
  if (!img) return;
  const i = new Image();
  i.decoding = 'async';
  i.src = assetUrl(img.file ? img.file : `${img.src}-sm.webp`);
}

// ---------- little info widgets ----------
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function calendar(days) {
  return h('ul', { class: 'cal', 'aria-label': 'Week calendar' },
    DAYS.map((d, i) => h('li', { class: days[i] ? 'cal-yes' : 'cal-no', 'aria-label': `${DAY_NAMES[i]}: ${days[i] ? 'yes' : 'no'}` },
      h('span', { class: 'cal-day', 'aria-hidden': 'true' }, d),
      h('span', { class: 'cal-mark', 'aria-hidden': 'true' }, days[i] ? '✓' : '✗'))));
}

export function clock(time) {
  return h('span', { class: 'clock', 'aria-label': `Time: ${time}` }, icon('clock', { size: 20 }), h('span', { 'aria-hidden': 'true' }, time));
}

export function speakerTag(name) {
  return h('span', { class: 'speaker-tag' }, `${name} says:`);
}

// ---------- live region, toast, dialogs ----------
let liveEl;
export function announce(message) {
  liveEl = liveEl || document.getElementById('live');
  if (!liveEl) return;
  liveEl.textContent = '';
  window.setTimeout(() => { liveEl.textContent = message; }, 30);
}

let toastTimer;
export function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { el.hidden = true; }, 3200);
}

/** Accessible modal using <dialog>. Escape closes it; focus returns to the opener. */
export function openDialog({ title, body, actions = [], className = '' }) {
  const opener = document.activeElement;
  const dlg = h('dialog', { class: `dlg ${className}`, 'aria-labelledby': 'dlg-title' });
  const close = (value) => {
    dlg.close();
    dlg.remove();
    if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    resolveFn(value);
  };
  let resolveFn;
  const done = new Promise((r) => { resolveFn = r; });
  dlg.append(
    h('h2', { id: 'dlg-title', class: 'dlg-title' }, title),
    h('div', { class: 'dlg-body' }, body),
    h('div', { class: 'dlg-actions' }, actions.map((a) => button(a.label, { kind: a.kind || 'secondary', onClick: () => close(a.value) })))
  );
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(undefined); });
  document.body.append(dlg);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
  const first = dlg.querySelector('.dlg-actions .btn-primary') || dlg.querySelector('button');
  if (first) first.focus();
  return done;
}

export async function confirmAction({ title, text, ok = 'Yes', cancel = 'No' }) {
  const v = await openDialog({ title, body: h('p', {}, text), actions: [{ label: cancel, value: false }, { label: ok, value: true, kind: 'primary' }] });
  return v === true;
}
