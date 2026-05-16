// Property details page
import { getProperty, listProperties } from './properties.js';
import { navbarScroll, fmtPrice, escapeHtml, toast } from './ui.js';
import { isFav, toggleFav } from './favorites.js';
import { renderSingleMap } from './map.js';
import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

navbarScroll();

const params = new URLSearchParams(location.search);
const id = params.get('id');
const root = document.getElementById('detail-root');
const FALLBACK = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80';

if (!id) { root.innerHTML = '<p class="empty">No property selected.</p>'; }
else load();

async function load() {
  root.innerHTML = '<div class="spinner"></div>';
  const p = await getProperty(id);
  if (!p) { root.innerHTML = '<p class="empty">Property not found.</p>'; return; }
  document.title = `${p.title} • Maisonia`;
  const images = (p.images && p.images.length) ? p.images : [FALLBACK];
  const amenities = p.amenities || [];

  root.innerHTML = `
    <div class="gallery">
      <div class="swiper gallerySwiper">
        <div class="swiper-wrapper">
          ${images.map(u => `<div class="swiper-slide"><img src="${u}" alt=""></div>`).join('')}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-main">
        <span class="card-badge" style="position:static;display:inline-block">${escapeHtml(p.type||'Property')}</span>
        <h1>${escapeHtml(p.title)}</h1>
        <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.address||'')}, ${escapeHtml(p.city||'')}</p>
        <div class="detail-price">${fmtPrice(p.price)} <small style="font-size:1rem;color:var(--muted);font-weight:400">/ month</small></div>
        <div class="detail-meta">
          <div><i class="fa-solid fa-bed"></i> ${p.bedrooms||0} Bedrooms</div>
          <div><i class="fa-solid fa-bath"></i> ${p.bathrooms||0} Bathrooms</div>
          <div><i class="fa-solid fa-ruler-combined"></i> ${p.area||0} m²</div>
          <div><i class="fa-solid fa-house"></i> ${escapeHtml(p.type||'')}</div>
        </div>
        <h3 style="font-family:var(--display);margin-bottom:10px">Description</h3>
        <p style="color:var(--navy-2);line-height:1.8">${escapeHtml(p.description||'')}</p>
        ${amenities.length ? `
          <h3 style="font-family:var(--display);margin:30px 0 10px">Amenities</h3>
          <div class="amenities">
            ${amenities.map(a => `<span><i class="fa-solid fa-check"></i> ${escapeHtml(a)}</span>`).join('')}
          </div>` : ''}
        <h3 style="font-family:var(--display);margin:30px 0 14px">Location</h3>
        <div id="detail-map"></div>
      </div>
      <aside>
        <div class="contact-box">
          <h3>Contact Agent</h3>
          <form id="contact-form">
            <input name="name" placeholder="Your name" required>
            <input name="email" type="email" placeholder="Your email" required>
            <input name="phone" placeholder="Phone (optional)">
            <textarea name="message" placeholder="I'm interested in this property…" required></textarea>
            <button type="submit" class="btn btn-primary btn-block">Send Message</button>
          </form>
          <button id="fav-btn" class="btn btn-outline btn-block" style="border-color:var(--navy);color:var(--navy);margin-top:10px">
            <i class="fa-${isFav(p.id)?'solid':'regular'} fa-heart"></i> ${isFav(p.id)?'Saved':'Save to Favorites'}
          </button>
        </div>
      </aside>
    </div>
    <h2 style="font-family:var(--display);margin:40px 0 20px">Similar Properties</h2>
    <div class="grid" id="similar"></div>
  `;

  new Swiper('.gallerySwiper', {
    loop: images.length > 1,
    autoplay: { delay: 4000 },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
  });

  renderSingleMap('detail-map', p.lat, p.lng, p.title);

  document.getElementById('fav-btn').addEventListener('click', (e) => {
    const on = toggleFav(p.id);
    e.currentTarget.innerHTML = `<i class="fa-${on?'solid':'regular'} fa-heart"></i> ${on?'Saved':'Save to Favorites'}`;
    toast(on ? 'Added to favorites' : 'Removed from favorites');
  });

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await addDoc(collection(db, 'messages'), {
        name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
        message: fd.get('message'), propertyId: p.id, propertyTitle: p.title,
        read: false, createdAt: serverTimestamp()
      });
      e.target.reset();
      toast('Message sent successfully!');
    } catch (err) { toast('Failed to send', 'error'); }
  });

  // Similar
  const all = await listProperties();
  const similar = all.filter(x => x.id !== p.id && x.city === p.city).slice(0, 3);
  const html = (similar.length ? similar : all.slice(0, 3)).map(s => `
    <article class="card" onclick="location.href='property-details.html?id=${s.id}'">
      <div class="card-img"><img src="${(s.images||[])[0]||FALLBACK}" alt=""></div>
      <div class="card-body">
        <div class="card-price">${fmtPrice(s.price)}</div>
        <h3 class="card-title">${escapeHtml(s.title)}</h3>
        <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(s.city||'')}</p>
      </div>
    </article>`).join('');
  document.getElementById('similar').innerHTML = html || '<p class="empty">No similar properties.</p>';
}
