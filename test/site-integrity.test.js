const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');

const root = resolve(__dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const script = readFileSync(resolve(root, 'script.js'), 'utf8');

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

test('all WhatsApp order paths use the published contact number', () => {
  const endpointNumbers = [
    ...[...html.matchAll(/https:\/\/wa\.me\/(\d+)/g)].map(([, number]) => number),
    ...[...script.matchAll(/https:\/\/wa\.me\/(\d+)/g)].map(([, number]) => number),
  ];
  const contact = html.match(/WhatsApp:\s*\+?([\d\s]+)/);
  assert.ok(contact, 'Expected a visible WhatsApp contact number');

  const contactNumber = contact[1].replace(/\s/g, '');
  assert.equal(endpointNumbers.length, 2);
  assert.deepEqual([...new Set(endpointNumbers)], [contactNumber]);
});
