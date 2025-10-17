// src/lib/firebase/auth/social-auth.ts
import {
    GoogleAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
  } from 'firebase/auth'
  import { auth } from './config'
  
  const googleProvider = new GoogleAuthProvider()
  googleProvider.addScope('email')
  googleProvider.addScope('profile')
  
  const twitterProvider = new TwitterAuthProvider()
  const githubProvider = new GithubAuthProvider()
  
  export const socialAuth = {
    providers: {
      google: googleProvider,
      twitter: twitterProvider,
      github: githubProvider
    },
  
    async signInWithProvider(provider: 'google' | 'twitter' | 'github', method: 'popup' | 'redirect' = 'popup') {
      try {
        const selectedProvider = this.providers[provider]
        
        let result
        if (method === 'popup') {
          result = await signInWithPopup(auth, selectedProvider)
        } else {
          await signInWithRedirect(auth, selectedProvider)
          return null // Will handle redirect result separately
        }
        
        const { user } = result
        
        // Check if profile exists, create if not
        let profile = await getUserProfile(user.uid)
        if (!profile) {
          const username = await generateUniqueUsername(user.displayName || user.email)
          profile = await createUserProfile(user, username)
        }
        
        return { user, profile }
      } catch (error) {
        throw handleAuthError(error)
      }
    },
  
    async handleRedirectResult() {
      try {
        const result = await getRedirectResult(auth)
        if (!result) return null
        
        const { user } = result
        const profile = await getUserProfile(user.uid)
        
        return { user, profile }
      } catch (error) {
        throw handleAuthError(error)
      }
    }
  }