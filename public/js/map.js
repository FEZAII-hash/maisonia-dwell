// Leaflet map helpers (Leaflet loaded globally via CDN)
export function renderPropertiesMap(elId, properties) {
  if (!window.L || !document.getElementById(elId)) return;
  const map = L.map(elId).setView([40.7128, -74.006], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const bounds = [];
  properties.forEach(p => {
    if (!p.lat || !p.lng) return;
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.bindPopup(`
      <div style="min-width:200px">
        <img src="${(p.images||[])[0]||''}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px">
        <strong>${p.title||''}</strong><br>
        <span style="color:#D4A373;font-weight:700">$${Number(p.price||0).toLocaleString()}</span><br>
        <a href="property-details.html?id=${p.id}" style="color:#06B6D4">View details →</a>
      </div>`);
    bounds.push([p.lat, p.lng]);
  });
  if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
}

export function renderSingleMap(elId, lat, lng, title = '') {
  if (!window.L || !document.getElementById(elId) || !lat || !lng) return;
  const map = L.map(elId).setView([lat, lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(title).openPopup();
}

export function locationPicker(elId, onChange, initial = null) {
  if (!window.L) return null;
  const startLat = initial?.lat || 40.7128;
  const startLng = initial?.lng || -74.006;
  const map = L.map(elId).setView([startLat, startLng], initial ? 13 : 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
  let marker = initial ? L.marker([startLat, startLng], { draggable: true }).addTo(map) : null;
  const place = (lat, lng) => {
    if (!marker) marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    else marker.setLatLng([lat, lng]);
    marker.on('dragend', e => {
      const { lat, lng } = e.target.getLatLng();
      onChange({ lat, lng });
    });
    onChange({ lat, lng });
  };
  map.on('click', e => place(e.latlng.lat, e.latlng.lng));
  if (marker) {
    marker.on('dragend', e => {
      const { lat, lng } = e.target.getLatLng();
      onChange({ lat, lng });
    });
  }
  return map;
}
