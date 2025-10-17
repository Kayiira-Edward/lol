// src/lib/firebase/auth/anonymous-auth.ts
import { signInAnonymously, linkWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from './config'

export const anonymousAuth = {
  async signInAnonymously() {
    try {
      const { user } = await signInAnonymously(auth)
      
      // Create temporary anonymous profile
      const tempProfile = await createAnonymousProfile(user.uid)
      
      return { user, profile: tempProfile }
    } catch (error) {
      throw handleAuthError(error)
    }
  },

  async upgradeToPermanent(email: string, password: string, username: string) {
    if (!auth.currentUser?.isAnonymous) {
      throw new Error('User is not anonymous')
    }

    try {
      const credential = EmailAuthProvider.credential(email, password)
      const { user } = await linkWithCredential(auth.currentUser, credential)
      
      // Convert anonymous profile to permanent
      const profile = await convertToPermanentProfile(user.uid, username, email)
      
      // Send verification email
      await sendEmailVerification(user)
      
      return { user, profile }
    } catch (error) {
      throw handleAuthError(error)
    }
  }
}