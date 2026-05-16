# Maisonia

A premium real estate rental platform with a modern public site and a separated admin dashboard, powered by Firebase (Auth, Firestore, Storage).

## Live URLs

The site is served as a static app from the `/public` folder:

- `/index.html` — Home (hero, featured properties, map, stats, testimonials)
- `/properties.html` — All properties with filters & pagination
- `/property-details.html?id=…` — Property details (gallery, map, contact)
- `/favorites.html` — Saved properties (localStorage)
- `/contact.html` — Contact form (writes to Firestore)
- `/login.html` — Admin login (Firebase Auth)
- `/admin/admin-dashboard.html` — Admin overview
- `/admin/properties-manager.html` — Manage properties
- `/admin/add-property.html` — Add new property (multi-image upload + map picker)
- `/admin/edit-property.html?id=…` — Edit property
- `/admin/messages.html` — Contact messages

## Setup

1. In the Firebase console, enable **Authentication → Email/Password** and create an admin user.
2. Enable **Firestore Database** and **Storage**.
3. Suggested security rules:
   - Firestore: public `read` for `properties`, `create` for `messages`, full `read/write` only when `request.auth != null`.
   - Storage: public `read` on `properties/*`, `write` only when `request.auth != null`.

## Tech

HTML5 · CSS3 · Vanilla JS (ES modules) · Firebase (modular SDK v12) · Leaflet · Swiper · Font Awesome
