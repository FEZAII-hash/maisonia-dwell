// Properties data layer
import {
  db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
  storage, sRef, uploadBytes, getDownloadURL
} from './firebase-config.js';

const COL = 'properties';

export function watchProperties(cb) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => { console.error(err); cb([]); });
}

export async function listProperties() {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProperty(id) {
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}

export async function addProperty(data) {
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
}

export async function updateProperty(id, data) {
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteProperty(id) {
  return deleteDoc(doc(db, COL, id));
}

export async function uploadImages(files) {
  const urls = [];
  for (const f of files) {
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name}`;
    const r = sRef(storage, path);
    await uploadBytes(r, f);
    urls.push(await getDownloadURL(r));
  }
  return urls;
}
