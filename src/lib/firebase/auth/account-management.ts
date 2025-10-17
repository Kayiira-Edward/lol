// src/lib/firebase/auth/account-management.ts
import {
    updateProfile,
    updateEmail,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
  } from 'firebase/auth'
  import { auth } from './config'
  import { deleteUserProfile } from '@/lib/firestore/users'
  
  export const accountManagement = {
    async updateDisplayName(displayName: string) {
      if (!auth.currentUser) throw new Error('No user logged in')
      return await updateProfile(auth.currentUser, { displayName })
    },
  
    async updatePhotoURL(photoURL: string) {
      if (!auth.currentUser) throw new Error('No user logged in')
      return await updateProfile(auth.currentUser, { photoURL })
    },
  
    async updateEmail(newEmail: string, password: string) {
      if (!auth.currentUser) throw new Error('No user logged in')
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        password
      )
      await reauthenticateWithCredential(auth.currentUser, credential)
      
      return await updateEmail(auth.currentUser, newEmail)
    },
  
    async deleteAccount(password: string) {
      if (!auth.currentUser) throw new Error('No user logged in')
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        password
      )
      await reauthenticateWithCredential(auth.currentUser, credential)
      
      // Delete user data from Firestore
      await deleteUserProfile(auth.currentUser.uid)
      
      // Delete auth user
      await deleteUser(auth.currentUser)
    }
  }