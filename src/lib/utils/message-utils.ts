// src/lib/utils/message-utils.ts - Updated to save messages properly
import { doc, setDoc, serverTimestamp, collection, addDoc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';

// Self-contained function
async function ensureUserProfileExists(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return true;
    }

    const user = auth.currentUser;
    if (!user) return false;

    const userProfile = {
      uid: user.uid,
      username: user.displayName?.toLowerCase() || 'user',
      displayName: user.displayName || 'User',
      email: user.email!,
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified || false,
      karma: 0,
      subscription: { tier: 'free', status: 'active' },
      limits: {
        freeMessagesSent: 0,
        freeMessagesReceived: 0,
        maxFreeMessages: 5,
        nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      inboxCount: 0,
      totalMessages: 0,
      referralCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, userProfile);
    return true;
  } catch (error) {
    console.error('Error ensuring user profile exists:', error);
    return false;
  }
}

export interface SendMessageData {
  receiverUsername: string;
  content: string;
  vibe: string;
  anonymous: boolean;
  parentMessageId?: string;
}

export async function safeSendMessage(uid: string, messageData: SendMessageData): Promise<boolean> {
  try {
    // Ensure user profile exists before sending message
    const profileExists = await ensureUserProfileExists(uid);
    
    if (!profileExists) {
      console.error('Failed to create user profile for sender:', uid);
      return false;
    }

    // Get sender's profile to get username
    const senderRef = doc(db, 'users', uid);
    const senderDoc = await getDoc(senderRef);
    
    if (!senderDoc.exists()) {
      console.error('Sender profile not found:', uid);
      return false;
    }

    const senderData = senderDoc.data();
    const senderUsername = senderData.username;

    // Create the message document
    const messageId = generateMessageId();
    const messageRef = doc(db, 'messages', messageId);
    
    const messageDoc = {
      id: messageId,
      senderId: messageData.anonymous ? 'anonymous' : uid,
      senderUsername: messageData.anonymous ? 'anonymous' : senderUsername,
      receiverUsername: messageData.receiverUsername.toLowerCase(), // Store lowercase for querying
      content: messageData.content,
      vibe: messageData.vibe,
      timestamp: serverTimestamp(),
      read: false,
      anonymous: messageData.anonymous,
      parentMessageId: messageData.parentMessageId || null,
    };

    await setDoc(messageRef, messageDoc);

    // Increment sender's message count
    await updateDoc(senderRef, {
      'limits.freeMessagesSent': increment(1),
      'totalMessages': increment(1),
      'updatedAt': serverTimestamp(),
    });

    console.log('✅ Message sent successfully:', {
      messageId,
      from: messageData.anonymous ? 'anonymous' : senderUsername,
      to: messageData.receiverUsername,
      vibe: messageData.vibe
    });

    return true;
  } catch (error) {
    console.error('❌ Error in safeSendMessage:', error);
    return false;
  }
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}