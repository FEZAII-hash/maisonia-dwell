// Firebase configuration & initialization (CDN modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc,
  updateDoc, deleteDoc, onSnapshot, query, orderBy, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGwidKq4JN_JWFZJLXmgae9FKLA-wCy3o",
  authDomain: "maisonia-762da.firebaseapp.com",
  projectId: "maisonia-762da",
  storageBucket: "maisonia-762da.firebasestorage.app",
  messagingSenderId: "822234775030",
  appId: "1:822234775030:web:43cc1403ef5d0450079bd7",
  measurementId: "G-KG6RNCM5WD"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export {
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, where, serverTimestamp,
  sRef, uploadBytes, getDownloadURL, deleteObject,
  signInWithEmailAndPassword, onAuthStateChanged, signOut
};
