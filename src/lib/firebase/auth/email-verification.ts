// src/lib/firebase/auth/email-verification.ts
import { 
    sendEmailVerification, 
    applyActionCode,
    checkActionCode 
  } from 'firebase/auth'
  import { auth } from './config'
  
  export const emailVerification = {
    async sendVerificationEmail() {
      if (!auth.currentUser) throw new Error('No user logged in')
      
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/verify-success`,
        handleCodeInApp: true
      }
      
      return await sendEmailVerification(auth.currentUser, actionCodeSettings)
    },
  
    async verifyEmail(actionCode: string) {
      try {
        // Check if action code is valid
        const info = await checkActionCode(auth, actionCode)
        
        // Apply the email verification code
        await applyActionCode(auth, actionCode)
        
        // Reload user to get updated emailVerified status
        await auth.currentUser?.reload()
        
        return { success: true, email: info.data.email }
      } catch (error) {
        throw handleAuthError(error)
      }
    },
  
    async resendVerificationEmail() {
      return await this.sendVerificationEmail()
    }
  }