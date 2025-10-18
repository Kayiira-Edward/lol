// src/lib/firebase/config.ts - Updated version
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Enhanced auth configuration for better email delivery
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = false; // Make sure this is false

// Configure action code settings for password reset
export const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  handleCodeInApp: true, // This must be true for mobile apps
  iOS: {
    bundleId: 'com.yourapp.bundle' // If you have an iOS app
  },
  android: {
    packageName: 'com.yourapp.package', // If you have an Android app
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: "lolapp.page.link" // If you have dynamic links configured
};

export default app;