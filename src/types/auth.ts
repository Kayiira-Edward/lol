// src/types/auth.ts
export interface FirebaseUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    emailVerified: boolean
    phoneNumber: string | null
    isAnonymous: boolean
    metadata: {
      creationTime?: string
      lastSignInTime?: string
    }
  }
  
  export interface UserProfile {
    uid: string
    username: string
    displayName: string
    email: string
    avatar?: string
    karma: number
    safetyLevel: 'chill' | 'guardian' | 'open'
    subscription: 'free' | 'pro' | 'community'
    inboxCount: number
    totalMessages: number
    isVerified: boolean
    createdAt: FirebaseTimestamp
    updatedAt: FirebaseTimestamp
    lastActiveAt: FirebaseTimestamp
    
    // Privacy settings
    privacy: {
      showKarma: boolean
      allowDiscoverability: boolean
      dataRetention: '30days' | '90days' | '1year'
    }
    
    // Notification preferences
    notifications: {
      newMessages: boolean
      karmaMilestones: boolean
      safetyAlerts: boolean
      productUpdates: boolean
    }
  }
  
  export interface AuthState {
    user: FirebaseUser | null
    profile: UserProfile | null
    loading: boolean
    error: string | null
    initialized: boolean
  }