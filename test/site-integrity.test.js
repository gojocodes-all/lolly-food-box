const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');

const root = resolve(__dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const script = readFileSync(resolve(root, 'script.js'), 'utf8');
const style = readFileSync(resolve(root, 'style.css'), 'utf8');

test('every local page resource exists', () => {
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(([, reference]) => reference)
    .filter(reference => !/^(?:https?:|mailto:|tel:|data:|#)/.test(reference))
    .map(reference => reference.split(/[?#]/, 1)[0]);

  const missing = references.filter(reference => !existsSync(resolve(root, reference)));
  assert.deepEqual(missing, []);
});

test('every fragment link targets an element on the page', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id));
  const fragments = [...html.matchAll(/href="#([^"]+)"/g)].map(([, fragment]) => fragment);
  const missing = fragments.filter(fragment => !ids.has(fragment));

  assert.deepEqual(missing, []);
});

test('the single WhatsApp endpoint matches the published contact number', () => {
  const endpointNumbers = [
    ...[...html.matchAll(/https:\/\/wa\.me\/(\d+)/g)].map(([, number]) => number),
  ];
  const contact = html.match(/WhatsApp:\s*\+?([\d\s]+)/);
  assert.ok(contact, 'Expected a visible WhatsApp contact number');

  const contactNumber = contact[1].replace(/\s/g, '');
  assert.equal(endpointNumbers.length, 1);
  assert.deepEqual([...new Set(endpointNumbers)], [contactNumber]);
  assert.match(html, /id="whatsappLink"[^>]+href="https:\/\/wa\.me\/\d+/);
  assert.match(html, /id="whatsappLink"[^>]+target="_blank"[^>]+rel="noopener"/);
  assert.doesNotMatch(script, /https:\/\/wa\.me\/\d+/);
});

test('order fields have persistent labels and useful autocomplete hints', () => {
  const form = html.match(/<form\s+id="orderForm">([\s\S]*?)<\/form>/)?.[1];
  assert.ok(form, 'Expected the WhatsApp order form');

  for (const id of ['name', 'meal', 'location']) {
    assert.match(form, new RegExp(`<label\\s+for="${id}"[^>]*>[^<]+<\\/label>`));
    assert.match(form, new RegExp(`<(?:input|select)[^>]+id="${id}"`));
  }

  assert.match(form, /<input[^>]+id="name"[^>]+autocomplete="name"/);
  assert.match(
    form,
    /<input[^>]+id="location"[^>]+autocomplete="street-address"/,
  );
});

test('fixed header leaves fragment destinations visible', () => {
  assert.match(
    style,
    /html\s*\{[^}]*scroll-padding-top:\s*100px/,
    'Expected the document scroll offset to clear the fixed header',
  );
});
