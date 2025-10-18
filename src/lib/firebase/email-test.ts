// src/lib/firebase/email-test.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './config';

export async function testEmailFunctionality(): Promise<{
  success: boolean;
  message: string;
  details: any;
}> {
  try {
    const testEmail = `test-${Date.now()}@test.com`;
    const testPassword = 'testPassword123!';

    console.log('🧪 Testing Firebase email functionality...');

    // Test 1: Create a user (to ensure email/password auth is enabled)
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ User creation test passed');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Test email already exists, trying sign in');
        userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      } else if (error.code === 'auth/operation-not-allowed') {
        return {
          success: false,
          message: 'Email/Password authentication is not enabled in Firebase Console',
          details: { error: error.message }
        };
      } else {
        throw error;
      }
    }

    // Test 2: Send password reset email
    try {
      await sendPasswordResetEmail(auth, testEmail);
      console.log('✅ Password reset email test passed');
      
      return {
        success: true,
        message: 'Email functionality is working correctly',
        details: {
          testEmail,
          userCreated: !!userCredential
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Password reset email failed',
        details: {
          error: error.message,
          code: error.code,
          testEmail
        }
      };
    }

  } catch (error: any) {
    console.error('❌ Email functionality test failed:', error);
    
    return {
      success: false,
      message: 'Email functionality test failed',
      details: {
        error: error.message,
        code: error.code
      }
    };
  }
}