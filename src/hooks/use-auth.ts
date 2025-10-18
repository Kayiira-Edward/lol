// src/hooks/use-auth.ts - COMPLETELY FIXED VERSION
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
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

// MOVE ALL HELPER FUNCTIONS OUTSIDE THE HOOK
const ensureUserProfileExists = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return true;
    }

    // Create user profile if it doesn't exist
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Generate a unique username
    let username = user.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
    if (username.length < 3) {
      username = 'user';
    }
    
    // Ensure username is unique
    let finalUsername = username;
    let counter = 1;
    
    while (counter < 100) {
      const isAvailable = await checkUsernameAvailability(finalUsername);
      if (isAvailable) break;
      finalUsername = `${username}${counter}`;
      counter++;
    }

    const userProfile = {
      uid: user.uid,
      username: finalUsername,
      displayName: user.displayName || finalUsername,
      email: user.email!,
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified || false,
      karma: 0,
      subscription: {
        tier: 'free',
        status: 'active',
        since: serverTimestamp()
      },
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

    await setDoc(userRef, userProfile);
    console.log('✅ User profile created for:', uid);
    return true;
    
  } catch (error) {
    console.error('❌ Error ensuring user profile exists:', error);
    return false;
  }
};

// Helper function to check username availability
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};

// Helper function to get user profile
const getUserProfile = async (uid: string) => {
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
};

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
          // Ensure user profile exists before getting it
          await ensureUserProfileExists(user.uid);
          
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
        console.error('Error in auth state change:', error);
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
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified || false,
        karma: 0,
        subscription: { 
          tier: 'free', 
          status: 'active',
          since: serverTimestamp()
        },
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
      
      // Ensure profile exists after sign in
      await ensureUserProfileExists(user.uid);
      
      const profile = await getUserProfile(user.uid);
      
      router.push('/inbox');
      
      return { user, profile };
    } catch (error) {
      let message = 'An error occurred during sign in';
      
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else {
        message = error.message;
      }
      
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const provider = new GoogleAuthProvider();
      // Add scopes for better user experience
      provider.addScope('profile');
      provider.addScope('email');
      
      const { user } = await signInWithPopup(auth, provider);
      
      // Ensure profile exists after Google sign in
      await ensureUserProfileExists(user.uid);
      
      // Get the updated profile
      const profile = await getUserProfile(user.uid);
      
      router.push('/inbox');
      
      return { user, profile };
    } catch (error) {
      let message = 'An error occurred during Google sign in';
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized for Google sign in.';
      } else {
        message = error.message;
      }
      
      setState(prev => ({ ...prev, error: message, loading: false }));
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