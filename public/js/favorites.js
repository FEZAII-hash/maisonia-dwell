// Favorites stored in localStorage
const KEY = 'maisonia_favs';
export function getFavs() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
export function isFav(id) { return getFavs().includes(id); }
export function toggleFav(id) {
  const favs = getFavs();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1); else favs.push(id);
  localStorage.setItem(KEY, JSON.stringify(favs));
  return i < 0;
}
export function removeFav(id) {
  const favs = getFavs().filter(x => x !== id);
  localStorage.setItem(KEY, JSON.stringify(favs));
}
