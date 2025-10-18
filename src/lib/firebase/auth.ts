// src/lib/firebase/auth.ts
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
    confirmPasswordReset,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    reload,
    User,
    UserCredential
  } from 'firebase/auth';
  import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
  import { auth, db } from './config';
  
  // Types
  export interface UserProfile {
    uid: string;
    username: string;
    displayName: string;
    email: string;
    photoURL?: string;
    emailVerified: boolean;
    karma: number;
    subscription: {
      tier: 'free' | 'premium';
      status: 'active' | 'inactive' | 'cancelled';
      since?: Date;
    };
    limits: {
      freeMessagesSent: number;
      freeMessagesReceived: number;
      maxFreeMessages: number;
      nextReset: Date;
    };
    inboxCount: number;
    totalMessages: number;
    referralCount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AuthError {
    code: string;
    message: string;
    userFriendlyMessage: string;
  }
  
  // Error mapping for user-friendly messages
  const ERROR_MESSAGES: Record<string, string> = {
    // Email/Password errors
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled',
    
    // Google auth errors
    'auth/popup-closed-by-user': 'Sign in was cancelled',
    'auth/popup-blocked': 'Popup was blocked by your browser',
    'auth/unauthorized-domain': 'This domain is not authorized',
    
    // General errors
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/requires-recent-login': 'Please sign in again to continue',
    'auth/invalid-credential': 'Invalid login credentials',
    
    // Password reset errors
    'auth/expired-action-code': 'Reset link has expired',
    'auth/invalid-action-code': 'Invalid reset link',
    'auth/user-mismatch': 'This reset link is for a different account',
  };
  
  const getErrorMessage = (error: any): AuthError => {
    const code = error.code || 'auth/unknown-error';
    const message = error.message || 'An unknown error occurred';
    const userFriendlyMessage = ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
    
    return { code, message, userFriendlyMessage };
  };
  
  // User profile management
  export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: data.uid,
          username: data.username,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          emailVerified: data.emailVerified || false,
          karma: data.karma || 0,
          subscription: data.subscription || { tier: 'free', status: 'active' },
          limits: data.limits || {
            freeMessagesSent: 0,
            freeMessagesReceived: 0,
            maxFreeMessages: 5,
            nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          inboxCount: data.inboxCount || 0,
          totalMessages: data.totalMessages || 0,
          referralCount: data.referralCount || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const createUserProfile = async (user: User, username: string, additionalData = {}): Promise<UserProfile> => {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        username: username.toLowerCase(),
        displayName: user.displayName || username,
        email: user.email!,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified || false,
        karma: 0,
        subscription: {
          tier: 'free',
          status: 'active',
          since: new Date()
        },
        limits: {
          freeMessagesSent: 0,
          freeMessagesReceived: 0,
          maxFreeMessages: 5,
          nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
        },
        inboxCount: 0,
        totalMessages: 0,
        referralCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...additionalData
      };
  
      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
  
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Username management
  export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // In a real implementation, you'd query Firestore for username uniqueness
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock: 80% chance username is available
      // In production, you'd use:
      // const usersRef = collection(db, 'users');
      // const q = query(usersRef, where('username', '==', username.toLowerCase()));
      // const querySnapshot = await getDocs(q);
      // return querySnapshot.empty;
      
      const isAvailable = Math.random() > 0.2;
      return isAvailable;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const generateUniqueUsername = async (base: string): Promise<string> => {
    const cleanBase = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let username = cleanBase;
    let counter = 1;
    
    while (counter < 100) { // Safety limit
      const isAvailable = await checkUsernameAvailability(username);
      if (isAvailable) {
        return username;
      }
      username = `${cleanBase}${Math.floor(Math.random() * 1000)}`;
      counter++;
    }
    
    throw new Error('Could not generate unique username');
  };
  
  // Authentication methods
  export const signUpWithEmail = async (
    email: string, 
    password: string, 
    username: string
  ): Promise<{ user: User; profile: UserProfile }> => {
    try {
      // Check username availability
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        throw { code: 'auth/username-taken', message: 'Username already taken' };
      }
  
      // Create user with email and password
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
  
      // Update profile with username
      await updateProfile(user, {
        displayName: username,
      });
  
      // Create user profile in Firestore
      const profile = await createUserProfile(user, username);
  
      // Send email verification
      await sendEmailVerification(user);
  
      return { user, profile };
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const signInWithEmail = async (email: string, password: string): Promise<{ user: User; profile: UserProfile }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
  
      // Get user profile
      const profile = await getUserProfile(user.uid);
      if (!profile) {
        throw { code: 'auth/profile-not-found', message: 'User profile not found' };
      }
  
      return { user, profile };
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const signInWithGoogle = async (): Promise<{ user: User; profile: UserProfile }> => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
  
      const userCredential = await signInWithPopup(auth, provider);
      const { user } = userCredential;
  
      // Check if user profile exists
      let profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // Create profile with generated username
        const baseUsername = user.displayName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 
                            user.email?.split('@')[0] || 'user';
        const username = await generateUniqueUsername(baseUsername);
        profile = await createUserProfile(user, username);
      }
  
      return { user, profile };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Password management
  export const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const confirmPasswordReset = async (code: string, newPassword: string): Promise<void> => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Email verification
  export const sendVerificationEmail = async (): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Profile management
  export const updateUserDisplayName = async (displayName: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updateProfile(user, { displayName });
      await updateUserProfile(user.uid, { displayName });
    } catch (error) {
      console.error('Error updating display name:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const updateUserEmail = async (newEmail: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updateEmail(user, newEmail);
      await updateUserProfile(user.uid, { email: newEmail });
      
      // Send verification email for new email
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Error updating email:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const updateUserPassword = async (newPassword: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const updateUserPhotoURL = async (photoURL: string): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updateProfile(user, { photoURL });
      await updateUserProfile(user.uid, { photoURL });
    } catch (error) {
      console.error('Error updating photo URL:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Subscription management
  export const upgradeToPremium = async (): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updateUserProfile(user.uid, {
        subscription: {
          tier: 'premium',
          status: 'active',
          since: new Date()
        }
      });
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw getErrorMessage(error);
    }
  };
  
  export const cancelPremium = async (): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw { code: 'auth/no-user', message: 'No user signed in' };
      }
      
      await updateUserProfile(user.uid, {
        subscription: {
          tier: 'free',
          status: 'cancelled'
        }
      });
    } catch (error) {
      console.error('Error cancelling premium:', error);
      throw getErrorMessage(error);
    }
  };
  
  // Message limits management
  export const incrementMessageCount = async (uid: string): Promise<void> => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'limits.freeMessagesSent': await getIncrementValue('limits.freeMessagesSent', uid),
        'totalMessages': await getIncrementValue('totalMessages', uid),
        'updatedAt': serverTimestamp(),
      });
    } catch (error) {
      console.error('Error incrementing message count:', error);
      throw getErrorMessage(error);
    }
  };
  
  const getIncrementValue = async (field: string, uid: string): Promise<any> => {
    // In Firestore, we use increment function
    // This is a simplified version - in real implementation, you'd use FieldValue.increment(1)
    const profile = await getUserProfile(uid);
    if (!profile) return 1;
    
    if (field === 'limits.freeMessagesSent') {
      return profile.limits.freeMessagesSent + 1;
    } else if (field === 'totalMessages') {
      return profile.totalMessages + 1;
    }
    
    return 1;
  };
  
  // Auth state observer
  export const onAuthStateChange = (callback: (user: User | null, profile: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          callback(user, profile);
        } catch (error) {
          console.error('Error getting user profile in auth state change:', error);
          callback(user, null);
        }
      } else {
        callback(null, null);
      }
    });
  };
  
  // Current user helpers
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
    const user = getCurrentUser();
    if (!user) return null;
    
    return await getUserProfile(user.uid);
  };
  
  // Export auth instance for direct use if needed
  export { auth };
  
  export default {
    // Authentication
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    
    // Password management
    resetPassword,
    confirmPasswordReset,
    
    // Email verification
    sendVerificationEmail,
    
    // Profile management
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    updateUserDisplayName,
    updateUserEmail,
    updateUserPassword,
    updateUserPhotoURL,
    
    // Username management
    checkUsernameAvailability,
    generateUniqueUsername,
    
    // Subscription
    upgradeToPremium,
    cancelPremium,
    
    // Message limits
    incrementMessageCount,
    
    // Auth state
    onAuthStateChange,
    getCurrentUser,
    getCurrentUserProfile,
    
    // Error handling
    getErrorMessage,
  };