const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = readFileSync('script.js', 'utf8');

function createElement(value = '') {
  const listeners = new Map();
  return {
    value,
    validityMessage: '',
    reportCount: 0,
    classList: {
      add() {},
      contains() { return false; },
      toggle() {},
    },
    addEventListener(type, listener) { listeners.set(type, listener); },
    dispatch(type, event = {}) { return listeners.get(type)?.(event); },
    reportValidity() { this.reportCount += 1; },
    setAttribute() {},
    setCustomValidity(message) { this.validityMessage = message; },
  };
}

function loadOrderForm({ name = '', meal = 'Shawarma', location = '' } = {}) {
  const elements = {
    loader: createElement(),
    header: createElement(),
    navToggle: createElement(),
    nav: createElement(),
    orderForm: createElement(),
    name: createElement(name),
    meal: createElement(meal),
    location: createElement(location),
  };
  const opened = [];
  const context = {
    document: {
      getElementById(id) { return elements[id]; },
      querySelectorAll() { return []; },
    },
    IntersectionObserver: class {
      observe() {}
    },
    setTimeout,
    window: {
      addEventListener() {},
      open(...args) { opened.push(args); },
      scrollY: 0,
    },
  };

  vm.runInNewContext(source, context);
  const event = { preventDefault() {} };
  elements.orderForm.dispatch('submit', event);
  return { elements, opened };
}

test('rejects a whitespace-only customer name', () => {
  const { elements, opened } = loadOrderForm({ name: '   ', location: '   ' });

  assert.equal(elements.name.validityMessage, 'Please enter your name.');
  assert.equal(elements.name.reportCount, 1);
  assert.equal(elements.location.reportCount, 0);
  assert.equal(opened.length, 0);
});

test('rejects a whitespace-only pickup or delivery location', () => {
  const { elements, opened } = loadOrderForm({ name: 'Ada', location: '\t ' });

  assert.equal(elements.location.validityMessage, 'Please enter a pickup or delivery location.');
  assert.equal(elements.location.reportCount, 1);
  assert.equal(opened.length, 0);
});

test('opens a complete encoded order without opener access', () => {
  const { opened } = loadOrderForm({ name: ' Ada ', meal: 'Chicken & Fries', location: ' Oke-Aro ' });

  assert.equal(opened.length, 1);
  const [url, target, features] = opened[0];
  const parsed = new URL(url);
  assert.equal(parsed.pathname, '/2349033713869');
  assert.equal(
    parsed.searchParams.get('text'),
    'Hello Lolly Food Box, my name is Ada. I want to order: Chicken & Fries. Location: Oke-Aro.',
  );
  assert.equal(target, '_blank');
  assert.equal(features, 'noopener');
});
