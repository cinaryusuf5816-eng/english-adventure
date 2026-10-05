// English Adventure — app start: loads site data, draws the shell (sidebar + top bar)
// and shows the screen for the current hash.
import { loadSite, loadWeek, ContentError } from './content-loader.js';
import { parseHash, matchRoute, buildHash } from './router.js';
import { configureStorage, isAvailable, onStorageProblem, readJSON, writeJSON, storageKey } from './storage.js';
import { h, icon, toast, announce, openDialog, button, picture } from './ui.js';
import { initSpeech, stopSpeech } from './speech.js';
import { renderHome } from './views/home.js';
import { renderWeeks } from './views/weeks.js';
import { renderWords } from './views/words.js';
import { renderLearn } from './views/learn.js';
import { renderExamples } from './views/examples.js';
import { renderPractiseMenu, renderPractiseSetup, renderPractisePlay, renderChallenge } from './views/practise.js';
import { renderPlay } from './views/play.js';
import { renderSpeak } from './views/speak.js';
import { renderProgress } from './views/progress-view.js';
import { renderTeacher } from './views/teacher.js';
import { renderMessage } from './views/message.js';

const VIEWS = {
  home: renderHome,
  week: renderHome,
  weeks: renderWeeks,
  teacher: renderTeacher,
  words: renderWords,
  learn: renderLearn,
  examples: renderExamples,
  'practise-menu': renderPractiseMenu,
  'practise-setup': renderPractiseSetup,
  'practise-play': renderPractisePlay,
  challenge: renderChallenge,
  play: renderPlay,
  speak: renderSpeak,
  progress: renderProgress
};

// Sidebar items (week sections use the current week)
const NAV = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'words', label: 'Words', icon: 'words' },
  { id: 'learn', label: 'Learn', icon: 'learn' },
  { id: 'examples', label: 'Examples', icon: 'note' },
  { id: 'practise', label: 'Practice', icon: 'practise' },
  { id: 'play', label: 'Games', icon: 'play' },
  { id: 'challenge', label: 'Challenge', icon: 'star' },
  { id: 'speak', label: 'Speak', icon: 'speak' },
  { id: 'progress', label: 'My Progress', icon: 'grid' },
  { id: 'teacher', label: 'Teacher', icon: 'board' }
];
const ROUTE_SECTION = {
  home: 'home', week: 'home', words: 'words', learn: 'learn', examples: 'examples',
  'practise-menu': 'practise', 'practise-setup': 'practise', challenge: 'challenge',
  play: 'play', speak: 'speak', progress: 'progress', teacher: 'teacher', weeks: 'weeks'
};

const state = { site: null, curriculum: null, mode: 'practice', weekId: null, cleanups: [], renderToken: 0 };
const main = () => document.getElementById('main');
const prefsKey = () => storageKey('prefs');
const prefs = () => readJSON(prefsKey(), {}) || {};
const savePrefs = (patch) => writeJSON(prefsKey(), { ...prefs(), ...patch });

function setMode(mode, { save = true } = {}) {
  state.mode = mode === 'classroom' ? 'classroom' : 'practice';
  document.body.classList.toggle('classroom', state.mode === 'classroom');
  const btn = document.getElementById('mode-btn');
  if (btn) {
    btn.setAttribute('aria-pressed', String(state.mode === 'classroom'));
    btn.querySelector('.btn-label').textContent = state.mode === 'classroom' ? 'Classroom: on' : 'Classroom: off';
  }
  if (save) savePrefs({ mode: state.mode });
}

function runCleanups() {
  stopSpeech();
  for (const fn of state.cleanups.splice(0)) { try { fn(); } catch { /* ignore */ } }
}

function makeContext(route, week) {
  return {
    route, site: state.site, curriculum: state.curriculum, week, mode: state.mode,
    onCleanup(fn) { state.cleanups.push(fn); },
    listen(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      state.cleanups.push(() => target.removeEventListener(type, fn, opts));
    },
    rerender: () => render()
  };
}

function publishedWeeks() {
  return state.curriculum.weeks.filter((w) => w.published);
}
function defaultWeekId() {
  const saved = prefs().week;
  const pub = publishedWeeks();
  return pub.some((w) => w.id === saved) ? saved : (pub[pub.length - 1] || pub[0] || {}).id;
}

async function render() {
  const token = ++state.renderToken;
  runCleanups();
  closeMenu();
  const route = matchRoute(parseHash());
  if (route.name === 'home') route.weekId = defaultWeekId();
  const container = main();
  container.setAttribute('aria-busy', 'true');

  let view;
  try {
    let week = null;
    if (route.weekId) {
      week = await loadWeek(state.curriculum, route.weekId);
      if (token !== state.renderToken) return;
      if (week.entry.published && state.weekId !== week.entry.id) {
        state.weekId = week.entry.id;
        savePrefs({ week: state.weekId });
      }
    }
    const fn = VIEWS[route.name];
    view = fn
      ? await fn(makeContext(route, week))
      : renderMessage({ title: route.name === 'bad' ? 'This link is not right.' : 'Page not found.', text: 'Let us go back and find the right path.' });
  } catch (err) {
    if (token !== state.renderToken) return;
    const known = err instanceof ContentError;
    view = renderMessage({
      title: known ? err.message : 'Something went wrong.',
      text: 'Go back to the start page and try again.',
      detail: known ? err.detail : String((err && err.message) || err)
    });
    if (!known) console.error('[app]', err);
  }
  if (token !== state.renderToken) return;
  container.replaceChildren(view);
  container.removeAttribute('aria-busy');
  document.title = (view.dataset && view.dataset.title ? `${view.dataset.title} · ` : '') + state.site.title;
  const heading = container.querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
  drawSidebar(route);
}

// ---------- sidebar ----------
function navHref(id, weekId) {
  if (id === 'home') return weekId ? buildHash(['week', weekId]) : '#/';
  if (id === 'teacher') return '#/teacher';
  return buildHash(['week', weekId, id]);
}

function drawSidebar(route) {
  const side = document.getElementById('sidebar');
  const weekId = state.weekId || defaultWeekId();
  const current = route.name === 'home' ? 'home' : ROUTE_SECTION[route.name] || (route.name === 'practise-play' ? (route.bank === 'challenge' ? 'challenge' : 'practise') : '');
  const select = h('select', { id: 'week-select', class: 'week-select', 'aria-label': 'Choose a week' },
    state.curriculum.weeks.map((w) => h('option', { value: w.id, disabled: !w.published, selected: w.id === weekId }, `Week ${w.number}${w.published ? ` · ${w.title}` : ' · Coming soon'}`)));
  select.addEventListener('change', () => {
    savePrefs({ week: select.value });
    state.weekId = select.value;
    window.location.hash = buildHash(['week', select.value]);
  });
  side.replaceChildren(
    h('a', { class: 'logo', href: '#/', 'aria-label': `${state.site.title}. Home.` },
      h('span', { class: 'logo-mark', 'aria-hidden': 'true' }, compass()),
      h('span', { class: 'logo-text' }, ...state.site.title.split(' ').map((w) => h('span', {}, w)))),
    h('label', { class: 'week-pick' }, h('span', { class: 'sr-only' }, 'Week'), select),
    h('nav', { class: 'side-nav', 'aria-label': 'Main' },
      NAV.map((n) => h('a', {
        href: navHref(n.id, weekId),
        class: `side-link side-${n.id}`,
        'data-nav': n.id,
        'aria-current': current === n.id ? 'page' : undefined
      }, h('span', { class: 'side-icon', 'aria-hidden': 'true' }, icon(n.icon, { size: 22 })), h('span', {}, n.label))),
      h('a', { href: '#/weeks', class: 'side-link side-weeks', 'data-nav': 'weeks', 'aria-current': current === 'weeks' ? 'page' : undefined },
        h('span', { class: 'side-icon', 'aria-hidden': 'true' }, icon('book', { size: 22 })), h('span', {}, 'All weeks'))),
    h('div', { class: 'motto-sign', 'aria-hidden': 'true' }, ...state.site.motto.map((m) => h('span', {}, m))));
}

function compass() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('width', '46');
  svg.setAttribute('height', '46');
  svg.innerHTML = '<circle cx="24" cy="24" r="21" fill="#1d2a4f" stroke="#f2b64a" stroke-width="3"/><circle cx="24" cy="24" r="15" fill="none" stroke="#f2b64a" stroke-width="1.5" stroke-dasharray="2 3"/><path d="M24 7 29 24 24 41 19 24Z" fill="#f2b64a"/><path d="M24 7 29 24H19Z" fill="#e2603f"/><path d="M7 24 24 19 41 24 24 29Z" fill="#cfd8ee" opacity=".85"/><circle cx="24" cy="24" r="3" fill="#fff"/>';
  return svg;
}

// ---------- top bar ----------
function fullScreenSupported() {
  return !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
}
async function toggleFullScreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast('Full screen is not allowed here.');
  }
}
async function copyLink() {
  const url = window.location.href;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('no clipboard');
    await navigator.clipboard.writeText(url);
    toast('Link copied.');
    announce('Link copied.');
  } catch {
    const input = h('input', { type: 'text', value: url, readonly: true, class: 'copy-input', 'aria-label': 'Link to this page' });
    const p = openDialog({ title: 'Copy this link', body: [h('p', {}, 'Select the link and copy it.'), input], actions: [{ label: 'Close', value: true, kind: 'primary' }] });
    window.setTimeout(() => { input.focus(); input.select(); }, 50);
    await p;
  }
}

let menuBtn;
function openMenu() { document.body.classList.add('menu-open'); menuBtn?.setAttribute('aria-expanded', 'true'); }
function closeMenu() { document.body.classList.remove('menu-open'); menuBtn?.setAttribute('aria-expanded', 'false'); }

function buildTopBar() {
  const top = document.getElementById('top');
  menuBtn = button('Menu', { icon: 'grid', kind: 'ghost', attrs: { id: 'menu-btn', 'aria-controls': 'sidebar', 'aria-expanded': 'false' }, onClick: () => (document.body.classList.contains('menu-open') ? closeMenu() : openMenu()) });
  const fsBtn = button('Full screen', { icon: 'full', kind: 'ghost', onClick: toggleFullScreen, attrs: { id: 'fs-btn' } });
  if (!fullScreenSupported()) { fsBtn.disabled = true; fsBtn.title = 'Full screen is not supported in this browser.'; }
  const modeBtn = button('Classroom: off', { icon: 'board', kind: 'ghost', attrs: { id: 'mode-btn', 'aria-pressed': 'false', title: 'Bigger text and pictures for the board' },
    onClick: () => { setMode(state.mode === 'classroom' ? 'practice' : 'classroom'); render(); } });
  const w = () => state.weekId || defaultWeekId();
  const pills = h('nav', { class: 'top-pills', 'aria-label': 'Quick links' },
    h('a', { href: '#', 'data-pill': 'words' }, 'Discover'),
    h('a', { href: '#', 'data-pill': 'learn' }, 'Learn'),
    h('a', { href: '#', 'data-pill': 'practise' }, 'Practice'),
    h('a', { href: '#', 'data-pill': 'progress' }, 'Grow ', h('span', { class: 'pill-star', 'aria-hidden': 'true' }, '★')));
  pills.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-pill]');
    if (!a) return;
    e.preventDefault();
    window.location.hash = buildHash(['week', w(), a.dataset.pill]);
  });
  top.replaceChildren(
    menuBtn,
    pills,
    h('p', { class: 'cheer' }, state.site.cheer, h('span', { class: 'cheer-star', 'aria-hidden': 'true' }, ' ★')),
    h('div', { class: 'top-tools' }, modeBtn, fsBtn, button('Copy link', { icon: 'link', kind: 'ghost', onClick: copyLink })),
    h('div', { class: 'hello' },
      picture({ src: state.site.avatarImage, w: 600, h: 600, alt: '' }, { className: 'avatar', decorative: true, eager: true, sizes: '48px' }),
      h('p', {}, h('span', { class: 'small' }, 'Hello,'), h('strong', {}, 'Explorer!'))));
  document.addEventListener('fullscreenchange', () => {
    const label = document.querySelector('#fs-btn .btn-label');
    if (label) label.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu(); });
  document.getElementById('menu-scrim')?.addEventListener('click', closeMenu);
}

function drawFooter() {
  const f = document.getElementById('site-foot');
  f.replaceChildren(
    h('p', { class: 'foot-links' }, state.site.footerLinks.join('  •  '), ' ', h('span', { class: 'heart', 'aria-hidden': 'true' }, '♥')),
    h('p', { class: 'foot-note' }, 'Progress is saved only in this browser. · ', h('a', { href: '#/teacher' }, 'Teacher help')));
}

function showStorageBanner(problem) {
  const el = document.getElementById('storage-note');
  if (!el) return;
  const text = {
    unavailable: 'Saving is off on this device. You can still use every lesson.',
    full: 'This device is full. New progress is not saved, but the lesson works.',
    corrupt: 'Some saved progress was broken and was removed. The lesson works.'
  }[problem];
  if (!text) return;
  el.replaceChildren(icon('note'), h('span', {}, text));
  el.hidden = false;
}

async function start() {
  initSpeech();
  onStorageProblem(showStorageBanner);
  try {
    const { site, curriculum } = await loadSite();
    state.site = site;
    state.curriculum = curriculum;
    configureStorage({ appId: site.appId || 'eemc', version: site.storageVersion || 1 });
  } catch (err) {
    main().replaceChildren(renderMessage({ title: 'The site could not start.', text: 'Please check the internet and reload the page.', detail: err.detail || err.message, noHome: true }));
    return;
  }
  isAvailable();
  buildTopBar();
  drawFooter();
  setMode(prefs().mode || 'practice', { save: false });
  state.weekId = defaultWeekId();
  window.addEventListener('hashchange', render);
  render();
}

start();
