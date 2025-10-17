// src/lib/firebase/auth/error-handler.ts
export function handleAuthError(error: any): AuthError {
    const errorCode = error.code
    let message = 'An unexpected error occurred'
    let type: AuthErrorType = 'unknown'
  
    switch (errorCode) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered'
        type = 'email_exists'
        break
        
      case 'auth/invalid-email':
        message = 'Please enter a valid email address'
        type = 'invalid_email'
        break
        
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters'
        type = 'weak_password'
        break
        
      case 'auth/user-not-found':
        message = 'No account found with this email'
        type = 'user_not_found'
        break
        
      case 'auth/wrong-password':
        message = 'Incorrect password'
        type = 'wrong_password'
        break
        
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later'
        type = 'rate_limited'
        break
        
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection'
        type = 'network_error'
        break
        
      default:
        message = error.message || 'An unexpected error occurred'
        type = 'unknown'
    }
  
    return {
      code: errorCode,
      message,
      type,
      originalError: error
    }
  }
  
  export type AuthErrorType = 
    | 'email_exists'
    | 'invalid_email'
    | 'weak_password'
    | 'user_not_found'
    | 'wrong_password'
    | 'rate_limited'
    | 'network_error'
    | 'unknown'
  
  export interface AuthError {
    code: string
    message: string
    type: AuthErrorType
    originalError: any
  }