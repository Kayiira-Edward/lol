// src/hooks/use-auth.ts
"use client";

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [state, setState] = useState({
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
          error: error.message,
          initialized: true
        }));
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check username availability
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        throw new Error('Username already taken! Try another one 😊');
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with username
      await updateProfile(user, { displayName: username });
      
      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        username: username.toLowerCase(),
        displayName: username,
        email: email,
        karma: 0,
        subscription: { tier: 'free', status: 'active' },
        limits: {
          freeMessagesSent: 0,
          freeMessagesReceived: 0,
          maxFreeMessages: 5,
          nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
        },
        inboxCount: 0,
        totalMessages: 0,
        referralCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      router.push('/inbox');
      
      return { user, profile: userProfile };
    } catch (error) {
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
      
      router.push('/inbox');
      
      return { user, profile };
    } catch (error) {
      const message = error.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.message;
      
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if profile exists, create if not
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        const username = await generateUniqueUsername(user.displayName || user.email.split('@')[0]);
        profile = await createUserProfile(user, username);
      }
      
      router.push('/inbox');
      
      return { user, profile };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    isAuthenticated: !!state.user && !state.user.isAnonymous,
  };
}

async function getUserProfile(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

async function checkUsernameAvailability(username: string): Promise<boolean> {
  // Check if username exists in users collection
  // This would require a username index in Firestore
  // For now, we'll simulate the check
  return true;
}

async function generateUniqueUsername(base: string): Promise<string> {
  // Generate unique username with random numbers
  const cleanBase = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanBase}${randomNum}`;
}

async function createUserProfile(user: any, username: string) {
  const userProfile = {
    uid: user.uid,
    username: username.toLowerCase(),
    displayName: user.displayName || username,
    email: user.email,
    photoURL: user.photoURL,
    karma: 0,
    subscription: { tier: 'free', status: 'active' },
    limits: {
      freeMessagesSent: 0,
      freeMessagesReceived: 0,
      maxFreeMessages: 5,
      nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    inboxCount: 0,
    totalMessages: 0,
    referralCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
}