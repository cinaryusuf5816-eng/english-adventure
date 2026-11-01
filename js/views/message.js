import { h, link } from '../ui.js';
import { screen } from './common.js';

/** Friendly error / not-found screen with a way back. */
export function renderMessage({ title, text, detail, noHome = false }) {
  return screen('Message',
    h('section', { class: 'panel message', role: 'alert' },
      h('h1', {}, title),
      h('p', { class: 'lead' }, text),
      detail ? h('details', { class: 'muted small' }, h('summary', {}, 'Details for the teacher'), h('code', {}, detail)) : null,
      noHome ? null : h('div', { class: 'actions' }, link('Home', '#/', { kind: 'primary', icon: 'home' }), link('Weeks', '#/weeks', { icon: 'book' }))));
}
