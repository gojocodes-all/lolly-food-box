const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('hide'), 650));

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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.getElementById('orderForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const meal = document.getElementById('meal').value;
  const location = document.getElementById('location').value.trim();
  const msg = `Hello Lolly Food Box, my name is ${name}. I want to order: ${meal}. Location: ${location}.`;
  window.open(`https://wa.me/2349033713869?text=${encodeURIComponent(msg)}`, '_blank');
});
