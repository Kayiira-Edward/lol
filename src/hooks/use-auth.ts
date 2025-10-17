// src/hooks/use-auth.ts
"use client";

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config'; // Fixed import path
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  karma: number;
  safetyLevel: 'chill' | 'guardian' | 'open';
  subscription: 'free' | 'pro' | 'community';
  inboxCount: number;
  totalMessages: number;
  isVerified: boolean;
  createdAt: any;
  updatedAt: any;
  lastActiveAt: any;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
    initialized: false
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const profile = await getUserProfile(user.uid);
          
          setState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              isAnonymous: user.isAnonymous,
            },
            profile,
            loading: false,
            error: null,
            initialized: true
          });
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
            initialized: true
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (error as Error).message,
          initialized: true
        }));
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Create auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with username
      await updateProfile(user, { displayName: username });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        username: username.toLowerCase(),
        displayName: username,
        email: email,
        karma: 0,
        safetyLevel: 'chill',
        subscription: 'free',
        inboxCount: 0,
        totalMessages: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Redirect to onboarding
      router.push('/onboarding');
      
      return { user, profile: userProfile };
    } catch (error: any) {
      const message = error.code === 'auth/email-already-in-use' 
        ? 'This email is already registered' 
        : error.message;
      
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(user.uid);
      
      // Update last active
      await updateLastActive(user.uid);
      
      // Redirect based on profile completion
      if (!profile?.username) {
        router.push('/onboarding');
      } else {
        router.push('/inbox');
      }
      
      return { user, profile };
    } catch (error: any) {
      const message = error.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.message;
      
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    logout,
    isAuthenticated: !!state.user && !state.user.isAnonymous,
  };
}

// Firestore helper functions
async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

async function updateLastActive(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { 
      lastActiveAt: serverTimestamp() 
    }, { merge: true });
  } catch (error) {
    console.error('Error updating last active:', error);
  }
}