// UI helpers shared across pages
export function toast(message, type = 'success') {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.className = `toast ${type}`;
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => el.classList.remove('show'), 3000);
}

export function navbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

export function revealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: .15 });
  els.forEach(el => io.observe(el));
}

export function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const animate = (el) => {
    const target = +el.dataset.counter;
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString();
    }, 25);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
}

export function fmtPrice(n) {
  return '$' + Number(n || 0).toLocaleString();
}

export function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
