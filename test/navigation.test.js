const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = readFileSync('script.js', 'utf8');

function createElement() {
  const attributes = new Map();
  const classes = new Set();
  const listeners = new Map();

  return {
    attributes,
    classList: {
      add(value) { classes.add(value); },
      contains(value) { return classes.has(value); },
      toggle(value, force) {
        if (force) classes.add(value);
        else classes.delete(value);
      },
    },
    focusCount: 0,
    value: '',
    addEventListener(type, listener) { listeners.set(type, listener); },
    dispatch(type, event = {}) { return listeners.get(type)?.(event); },
    focus() { this.focusCount += 1; },
    reportValidity() {},
    setAttribute(name, value) { attributes.set(name, value); },
    setCustomValidity() {},
  };
}

function loadNavigation() {
  const elements = {
    header: createElement(),
    loader: createElement(),
    location: createElement(),
    meal: createElement(),
    name: createElement(),
    nav: createElement(),
    navToggle: createElement(),
    orderForm: createElement(),
    whatsappLink: {
      ...createElement(),
      href: 'https://wa.me/2349033713869',
    },
  };
  const navLink = createElement();
  const documentListeners = new Map();

  const context = {
    document: {
      addEventListener(type, listener) { documentListeners.set(type, listener); },
      getElementById(id) { return elements[id]; },
      querySelectorAll(selector) { return selector === '.nav a' ? [navLink] : []; },
    },
    IntersectionObserver: class {
      observe() {}
    },
    setTimeout,
    URL,
    window: {
      addEventListener() {},
      open() {},
      scrollY: 0,
    },
  };

  vm.runInNewContext(source, context);
  return { documentListeners, elements, navLink };
}

test('mobile navigation exposes its state and closes with Escape', () => {
  const { documentListeners, elements } = loadNavigation();

  assert.equal(elements.navToggle.attributes.get('aria-controls'), 'nav');
  assert.equal(elements.navToggle.attributes.get('aria-expanded'), 'false');

  elements.navToggle.dispatch('click');
  assert.equal(elements.nav.classList.contains('active'), true);
  assert.equal(elements.navToggle.attributes.get('aria-expanded'), 'true');
  assert.equal(elements.navToggle.attributes.get('aria-label'), 'Close navigation');

  documentListeners.get('keydown')({ key: 'Escape' });
  assert.equal(elements.nav.classList.contains('active'), false);
  assert.equal(elements.navToggle.attributes.get('aria-expanded'), 'false');
  assert.equal(elements.navToggle.attributes.get('aria-label'), 'Open navigation');
  assert.equal(elements.navToggle.focusCount, 1);
});

test('other keys do not close the mobile navigation', () => {
  const { documentListeners, elements } = loadNavigation();

  elements.navToggle.dispatch('click');
  documentListeners.get('keydown')({ key: 'Enter' });

  assert.equal(elements.nav.classList.contains('active'), true);
  assert.equal(elements.navToggle.focusCount, 0);
});

test('choosing a navigation link still closes the menu', () => {
  const { elements, navLink } = loadNavigation();

  elements.navToggle.dispatch('click');
  navLink.dispatch('click');

  assert.equal(elements.nav.classList.contains('active'), false);
  assert.equal(elements.navToggle.attributes.get('aria-expanded'), 'false');
});
