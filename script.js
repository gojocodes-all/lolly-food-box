const loader = document.getElementById('loader');
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

window.addEventListener('load', () => {
  const hideLoader = () => loader.classList.add('hide');
  if (prefersReducedMotion) hideLoader();
  else setTimeout(hideLoader, 650);
});

const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

const setNavOpen = (isOpen) => {
  nav.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
};

navToggle.setAttribute('aria-controls', 'nav');
setNavOpen(false);
navToggle.addEventListener('click', () => setNavOpen(!nav.classList.contains('active')));
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => setNavOpen(false)));

const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealItems.forEach(element => element.classList.add('show'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.15 });
  revealItems.forEach(element => observer.observe(element));
}

const form = document.getElementById('orderForm');
const nameInput = document.getElementById('name');
const mealInput = document.getElementById('meal');
const locationInput = document.getElementById('location');

const readRequiredText = (input, message) => {
  const value = input.value.trim();
  input.setCustomValidity(value ? '' : message);
  if (!value) input.reportValidity();
  return value;
};

[nameInput, locationInput].forEach(input => {
  input.addEventListener('input', () => input.setCustomValidity(''));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = readRequiredText(nameInput, 'Please enter your name.');
  if (!name) return;

  const location = readRequiredText(locationInput, 'Please enter a pickup or delivery location.');
  if (!location) return;

  const meal = mealInput.value;
  const msg = `Hello Lolly Food Box, my name is ${name}. I want to order: ${meal}. Location: ${location}.`;
  window.open(`https://wa.me/2349033713869?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});
