// src/lib/firebase/config-checker.ts
import { auth } from './config';

export async function checkFirebaseConfig(): Promise<{
  isConfigured: boolean;
  issues: string[];
  suggestions: string[];
}> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    issues.push(`Missing environment variables: ${missingVars.join(', ')}`);
    suggestions.push('Check your .env.local file and ensure all Firebase variables are set');
  }

  // Check if auth is initialized
  try {
    // Try a simple auth operation
    await new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
      
      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Auth initialization timeout')), 5000);
    });
  } catch (error) {
    issues.push('Firebase Auth not properly initialized');
    suggestions.push('Check your Firebase configuration and internet connection');
  }

  // Check if domain is authorized in Firebase Console
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  
  if (authDomain && currentDomain && !authDomain.includes(currentDomain)) {
    suggestions.push(`Make sure ${currentDomain} is added to authorized domains in Firebase Console`);
  }

  return {
    isConfigured: issues.length === 0,
    issues,
    suggestions
  };
}