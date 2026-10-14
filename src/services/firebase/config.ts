import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Get Firebase config from env or local override
export const getFirebaseConfig = () => {
  if (typeof window !== 'undefined') {
    const localSaved = localStorage.getItem('iq_firebase_config_override');
    if (localSaved) {
      try {
        return JSON.parse(localSaved);
      } catch (e) {
        // ignore
      }
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDErKB2idIOK8uDMbUBNr-xh8fjl1BEBUs',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ikraamul-qur-an-b7cdf.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ikraamul-qur-an-b7cdf',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ikraamul-qur-an-b7cdf.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '734749628987',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:734749628987:web:b7f0aa18109900dcb31a1e',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-9RB41CJN70'
  };
};

export const isFirebaseConfigured = (): boolean => {
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId);
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

try {
  const config = getFirebaseConfig();
  if (config.apiKey && config.projectId) {
    appInstance = !getApps().length ? initializeApp(config) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && appInstance) {
          analyticsInstance = getAnalytics(appInstance);
        }
      }).catch((err) => {
        console.warn('Firebase analytics note:', err);
      });
    }
  }
} catch (error) {
  console.warn('Firebase initialization note:', error);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export const analytics = analyticsInstance;
