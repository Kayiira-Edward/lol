"use client";
import React, { useState, useEffect, useContext, createContext } from 'react';

// --- Single-File Environment Mock/Setup (MANDATORY) ---

// 1. Firebase/Firestore Configuration and Utilities
// Global variables are provided by the immersive environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock Firebase imports for the single-file environment
// In a real project, these would be imported from 'firebase/app', 'firebase/auth', 'firebase/firestore'
let app, db, auth;
const firebaseMock = {
  initializeApp: () => ({ name: 'mock-app' }),
  getAuth: () => ({ name: 'mock-auth', currentUser: { uid: 'mock-user-id' } }),
  getFirestore: () => ({ name: 'mock-firestore' }),
  // Firestore utility mocks
  doc: (db, collectionPath, docId) => ({ path: `${collectionPath}/${docId}` }),
  updateDoc: async (docRef, data) => {
    console.log('Firestore: updateDoc called', docRef.path, data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  arrayUnion: (value) => ({ type: 'arrayUnion', value }),
  increment: (value) => ({ type: 'increment', value }),
  // Auth utility mocks
  signInWithCustomToken: async () => ({ user: { uid: 'mock-user-id' } }),
  signInAnonymously: async () => ({ user: { uid: 'anon-id' } }),
  onAuthStateChanged: (auth, callback) => {
    // Simulate immediate authentication
    callback(auth.currentUser);
    return () => {}; // Unsubscribe mock
  },
};

// 2. Initialize Firebase (This runs once)
try {
  const { initializeApp, getAuth, signInWithCustomToken, signInAnonymously, getFirestore } = firebaseMock;
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

// 3. Mock Authentication Context
const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  signIn: async () => console.log('Mock signIn'),
  signUp: async () => ({ user: { uid: 'new-mock-uid' } }),
});

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth && initialAuthToken) {
      const authenticate = async () => {
        try {
          await firebaseMock.signInWithCustomToken(auth, initialAuthToken);
        } catch (e) {
          console.error("Custom token sign-in failed, falling back to anonymous:", e);
          await firebaseMock.signInAnonymously(auth);
        }
        firebaseMock.onAuthStateChanged(auth, (u) => {
          setUser(u);
        });
      };
      authenticate();
    }
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (email === 'user@example.com' && password === 'password') {
      setUser({ uid: 'mock-user-id', email });
      setError(null);
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const signUp = async (email, password, username) => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (email === 'existing@example.com') {
      setError('Email already in use.');
      setLoading(false);
      return null;
    }
    const newUser = { user: { uid: crypto.randomUUID(), email } };
    setUser(newUser.user);
    setLoading(false);
    return newUser;
  };

  return { user, loading, error, signIn, signUp };
};


// 4. Mock UI Components (Tailwind CSS included in classes)
const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ children, className = '' }) => (
  <div className={`rounded-3xl border p-6 ${className}`}>
    {children}
  </div>
);
const GradientText = ({ children, className = '' }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent ${className}`}>
    {children}
  </span>
);
const Link = ({ children, href, className = '', ...props }) => (
  <a href={href} className={className} onClick={(e) => {
    // Prevent default and simulate Next.js Link behavior for mode switching
    e.preventDefault();
    if (href.startsWith('/auth')) {
      const newMode = new URLSearchParams(new URL(href, window.location.origin).search).get('mode');
      const newRef = new URLSearchParams(new URL(href, window.location.origin).search).get('ref');
      const newRefInbox = new URLSearchParams(new URL(href, window.location.origin).search).get('refInbox');
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('mode', newMode);
      if (newRef) currentUrl.searchParams.set('ref', newRef);
      if (newRefInbox) currentUrl.searchParams.set('refInbox', newRefInbox);
      
      // Simulate navigation for useSearchParams hook
      window.history.pushState({}, '', currentUrl.toString());
      window.dispatchEvent(new Event('popstate')); // Trigger re-render
    } else {
      console.log('Navigating to:', href);
    }
  }} {...props}>
    {children}
  </a>
);

// 5. Mock useSearchParams (Adapts to URL changes in the simulated environment)
const useSearchParams = () => {
  const [params, setParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return params;
};

// 6. Lucide Icons (Inline SVGs for single-file self-containment)
const MessageCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20.3c-.4.8-1.7 1.2-2.8.8-1.5-.5-2.2-2.3-1.8-3.7 0-.5-.3-.9-.7-1.3C1.5 13.6 1 12 1 10.5 1 5.8 5.4 2 10 2s9 3.8 9 8.5c0 1.5-.5 3.1-1.6 4.3-.4.4-.7.9-.7 1.3.4 1.4-.3 3.2-1.8 3.7-1.1.4-2.4 0-2.8-.8-.4-.8-1.7-1.2-2.8-.8-1.5.5-2.2 2.3-1.8 3.7 0 .5-.3.9-.7 1.3C1.5 13.6 1 12 1 10.5 1 5.8 5.4 2 10 2s9 3.8 9 8.5c0 1.5-.5 3.1-1.6 4.3-.4.4-.7.9-.7 1.3.4 1.4-.3 3.2-1.8 3.7-1.1.4-2.4 0-2.8-.8z"/></svg>;
const Shield = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ArrowRight = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14 0"/><path d="M12 5l7 7-7 7"/></svg>;
const Lock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Sparkles = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zM20.5 8.5a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 0 1 1.4 0zM3.5 8.5a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 0 1 0-1.4zM20 12a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4 12a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM12 20a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM20.5 16.5a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1 0 1.4zM3.5 16.5a1 1 0 0 1 0 1.4l1.4 1.4a1 1 0 0 1 1.4 0l1.4-1.4a1 1 0 0 1 0-1.4l-1.4-1.4a1 1 0 0 1-1.4 0z"/></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;


// --- AuthPage Component (The main application logic) ---

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  // Referral parameters
  const refSource = searchParams.get('ref');
  const refInbox = searchParams.get('refInbox');
  
  const { signIn, signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState(null); // Separate error for form validation

  // Track referral when user signs up
  const handleSignUp = async (email, password, username) => {
    try {
      // Step 1: Attempt sign up
      const result = await signUp(email, password, username);
      
      // If sign up failed (e.g., error from useAuth), result will be null
      if (!result || result.user.uid === 'mock-user-id') {
        // In a real app, the `useAuth` hook handles setting `error`.
        // We log the mock failure here but rely on `error` state.
        return; 
      }

      // Step 2: Track referral if coming from message sent
      if (db && result.user.uid && refSource === 'message_sent' && refInbox) {
        // Path: /artifacts/{appId}/public/data/inboxes/{refInbox}
        const inboxDocRef = firebaseMock.doc(db, `artifacts/${appId}/public/data/inboxes`, refInbox);
        
        await firebaseMock.updateDoc(inboxDocRef, {
          referrals: firebaseMock.arrayUnion(result.user.uid),
          referralCount: firebaseMock.increment(1),
        });
        
        // Path: /artifacts/{appId}/users/{userId}/user_profile (assuming user profile is stored here or similar)
        // Note: For simplicity, assuming a top-level 'users' collection for this global state update.
        // If we strictly follow security rules, it would be under the user's private path, but here we award public karma.
        // We'll use a common 'users' collection path for global actions like karma.
        const userDocRef = firebaseMock.doc(db, `artifacts/${appId}/public/data/users`, result.user.uid);
        
        await firebaseMock.updateDoc(userDocRef, {
          karma: firebaseMock.increment(10), // Bonus karma for referral signup
          signupSource: 'message_sent_referral',
        });
        
        console.log(`Referral tracked. User ${result.user.uid} awarded 10 karma.`);
      }
      
      return result;
    } catch (e) {
      console.error("Referral tracking or sign up failed:", e);
      throw e;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters long.');
        return;
      }
      await handleSignUp(formData.email, formData.password, formData.username);
    } else {
      await signIn(formData.email, formData.password);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen p-4 text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <style>
        {`
        /* Minimal Tailwind-like setup for a good look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .bg-background { background-color: #ffffff; }
        .dark .bg-background { background-color: #030712; }
        .bg-card { background-color: #f9fafb; }
        .dark .bg-card { background-color: #111827; }
        .border-border { border-color: #e5e7eb; }
        .dark .border-border { border-color: #374151; }
        .text-primary { color: #4f46e5; } /* Indigo 600 */
        .text-accent { color: #f97316; } /* Orange 500 */
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, #4f46e5, #f97316); }
        .bg-gradient-to-r { background-image: linear-gradient(to right, #4f46e5, #f97316); }
        .text-primary-foreground { color: #ffffff; }
        .text-muted-foreground { color: #6b7280; }
        .dark .text-muted-foreground { color: #9ca3af; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; opacity: 0; }
        @keyframes scaleIn { 
          from { transform: scale(0.9); opacity: 0; } 
          to { transform: scale(1); opacity: 1; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); }
        }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .bg-background\\/80 { background-color: rgba(255, 255, 255, 0.8); }
        .dark .bg-background\\/80 { background-color: rgba(3, 7, 18, 0.8); }
        .bg-card\\/80 { background-color: rgba(249, 250, 251, 0.8); }
        .dark .bg-card\\/80 { background-color: rgba(17, 24, 39, 0.8); }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LOL</span>
          </Link>
          <Link href="/">
            <Button className="text-gray-700 bg-transparent shadow-none hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300">Back Home</Button>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen pt-20 pb-10">
        <div className="w-full max-w-md animate-scale-in">
          <Card className="p-8 shadow-2xl bg-card/80 backdrop-blur-sm border-border/50">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent">
                  {mode === 'login' ? <Lock className="w-8 h-8 text-primary-foreground" /> : <Users className="w-8 h-8 text-primary-foreground" />}
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Join LOL'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Sign in to your account' 
                  : 'Create your account to get started'
                }
              </p>
              {refSource && mode === 'signup' && (
                <p className="mt-2 text-sm text-primary/80">
                  You were invited! Complete sign up to receive a **+10 Karma bonus**.
                </p>
              )}
            </div>

            {/* Error Messages */}
            {(error || formError) && (
              <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error || formError}
              </div>
            )}

            {/* Mode Toggle */}
            <div className="flex p-1 mb-6 border shadow-inner rounded-xl bg-muted/50 border-border/50">
              <Link 
                href="/auth?mode=login" 
                className={`flex-1 text-center py-2 rounded-lg transition-all text-sm font-medium ${
                  mode === 'login' 
                    ? 'bg-background shadow-md text-primary dark:text-white' 
                    : 'text-muted-foreground hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
              >
                Login
              </Link>
              <Link 
                href="/auth?mode=signup" 
                className={`flex-1 text-center py-2 rounded-lg transition-all text-sm font-medium ${
                  mode === 'signup' 
                    ? 'bg-background shadow-md text-primary dark:text-white' 
                    : 'text-muted-foreground hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
              >
                Sign Up
              </Link>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="username" className="block mb-1 text-sm font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 transition duration-150 border rounded-xl border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                    placeholder="Choose a username"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition duration-150 border rounded-xl border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition duration-150 border rounded-xl border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min 6 chars)'}
                  minLength={6}
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 transition duration-150 border rounded-xl border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-6 text-lg text-white shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-95 disabled:opacity-50 shadow-primary/20 dark:shadow-accent/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {mode === 'login' && (
                <div className="pt-2 text-center">
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              )}
            </form>

            {/* Security Features */}
            <div className="pt-6 mt-8 border-t border-border/50">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span>Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Modern</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
