// src/lib/firebase/auth/email-auth.ts
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    verifyBeforeUpdateEmail
  } from 'firebase/auth'
  import { auth } from './config'
  import { createUserProfile } from '../firestore/users'
  
  export const emailAuth = {
    async signUp(email: string, password: string, username: string) {
      try {
        // Validate username availability
        await validateUsername(username)
        
        // Create auth user
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        
        // Create user profile in Firestore
        const userProfile = await createUserProfile(user, username)
        
        // Send verification email
        await sendEmailVerification(user)
        
        return { user, profile: userProfile }
      } catch (error) {
        throw handleAuthError(error)
      }
    },
  
    async signIn(email: string, password: string) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        const profile = await getUserProfile(user.uid)
        
        // Update last active timestamp
        await updateLastActive(user.uid)
        
        return { user, profile }
      } catch (error) {
        throw handleAuthError(error)
      }
    },
  
    async resetPassword(email: string) {
      return await sendPasswordResetEmail(auth, email)
    },
  
    async updateUserPassword(newPassword: string) {
      if (!auth.currentUser) throw new Error('No user logged in')
      return await updatePassword(auth.currentUser, newPassword)
    }
  }