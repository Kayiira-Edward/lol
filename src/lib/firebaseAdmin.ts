import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { admin, adminDb, adminAuth };

// Helper function to verify Firebase ID token
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Helper function to get user by UID
export async function getUserByUid(uid: string) {
  try {
    const user = await adminAuth.getUser(uid);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
