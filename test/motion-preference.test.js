const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const scriptSource = readFileSync('script.js', 'utf8');
const styleSource = readFileSync('style.css', 'utf8');

function createElement() {
  const classes = new Set();
  const listeners = new Map();

  return {
    classList: {
      add(value) { classes.add(value); },
      contains(value) { return classes.has(value); },
      toggle(value, force) {
        if (force) classes.add(value);
        else classes.delete(value);
      },
    },
    addEventListener(type, listener) { listeners.set(type, listener); },
    dispatch(type, event = {}) { return listeners.get(type)?.(event); },
    reportValidity() {},
    setAttribute() {},
    setCustomValidity() {},
    value: '',
  };
}

function loadSite({ reduceMotion }) {
  const elements = {
    header: createElement(),
    loader: createElement(),
    location: createElement(),
    meal: createElement(),
    name: createElement(),
    nav: createElement(),
    navToggle: createElement(),
    orderForm: createElement(),
  };
  const revealItems = [createElement(), createElement()];
  const observed = [];
  const scheduled = [];
  const windowListeners = new Map();

  const context = {
    document: {
      getElementById(id) { return elements[id]; },
      querySelectorAll(selector) {
        return selector === '.reveal' ? revealItems : [];
      },
    },
    IntersectionObserver: class {
      observe(element) { observed.push(element); }
    },
    setTimeout(callback, delay) { scheduled.push({ callback, delay }); },
    window: {
      addEventListener(type, listener) { windowListeners.set(type, listener); },
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: reduceMotion };
      },
      open() {},
      scrollY: 0,
    },
  };

  vm.runInNewContext(scriptSource, context);

  return { elements, observed, revealItems, scheduled, windowListeners };
}

test('reduced motion skips delayed loading and reveals content immediately', () => {
  const { elements, observed, revealItems, scheduled, windowListeners } =
    loadSite({ reduceMotion: true });

  assert.equal(observed.length, 0);
  assert.equal(scheduled.length, 0);
  assert.ok(revealItems.every(element => element.classList.contains('show')));

  windowListeners.get('load')();
  assert.equal(elements.loader.classList.contains('hide'), true);
  assert.equal(scheduled.length, 0);
});

test('default motion keeps the existing delayed loader and reveal observer', () => {
  const { elements, observed, revealItems, scheduled, windowListeners } =
    loadSite({ reduceMotion: false });

  assert.deepEqual(observed, revealItems);
  assert.ok(revealItems.every(element => !element.classList.contains('show')));

  windowListeners.get('load')();
  assert.equal(scheduled.length, 1);
  assert.equal(scheduled[0].delay, 650);
  assert.equal(elements.loader.classList.contains('hide'), false);

  scheduled[0].callback();
  assert.equal(elements.loader.classList.contains('hide'), true);
});

test('the stylesheet removes animation, transitions, and smooth scrolling', () => {
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styleSource, /animation-duration:\s*0\.01ms !important/);
  assert.match(styleSource, /transition-duration:\s*0\.01ms !important/);
  assert.match(styleSource, /scroll-behavior:\s*auto !important/);
  assert.match(styleSource, /\.reveal\s*{[\s\S]*?opacity:\s*1;[\s\S]*?transform:\s*none;/);
});
