// Home page app logic
import { watchProperties } from './properties.js';
import { navbarScroll, revealOnScroll, animateCounters, fmtPrice, escapeHtml } from './ui.js';
import { isFav, toggleFav } from './favorites.js';
import { renderPropertiesMap } from './map.js';

navbarScroll();
revealOnScroll();
animateCounters();

const grid = document.getElementById('featured-grid');
const FALLBACK = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';

function cardHtml(p) {
  const img = (p.images && p.images[0]) || FALLBACK;
  const fav = isFav(p.id) ? 'active' : '';
  return `
    <article class="card reveal" data-id="${p.id}">
      <div class="card-img">
        <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy">
        <span class="card-badge">${escapeHtml(p.type || 'Featured')}</span>
        <button class="card-fav ${fav}" data-fav="${p.id}" aria-label="Save"><i class="fa-solid fa-heart"></i></button>
      </div>
      <div class="card-body">
        <div class="card-price">${fmtPrice(p.price)} <small>/ month</small></div>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.address || '')}, ${escapeHtml(p.city || '')}</p>
        <div class="rating">★★★★★ <span style="color:var(--muted);margin-left:4px">(${(Math.random()*30+10|0)})</span></div>
        <div class="card-meta">
          <span><i class="fa-solid fa-bed"></i> ${p.bedrooms||0} Beds</span>
          <span><i class="fa-solid fa-bath"></i> ${p.bathrooms||0} Baths</span>
          <span><i class="fa-solid fa-ruler-combined"></i> ${p.area||0} m²</span>
        </div>
      </div>
    </article>`;
}

function bindCards(properties) {
  document.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('[data-fav]')) return;
      window.location.href = `property-details.html?id=${el.dataset.id}`;
    });
  });
  document.querySelectorAll('[data-fav]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const on = toggleFav(b.dataset.fav);
      b.classList.toggle('active', on);
    });
  });
}

watchProperties(properties => {
  if (!grid) return;
  if (!properties.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><i class="fa-solid fa-house"></i><p>No properties yet. Check back soon.</p></div>`;
    return;
  }
  grid.innerHTML = properties.slice(0, 6).map(cardHtml).join('');
  bindCards(properties);
  revealOnScroll();
  renderPropertiesMap('map', properties);
});
