// src/hooks/use-message-limits.ts - Remove external dependency
"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, increment, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Self-contained function for message limits hook
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

export function useMessageLimits() {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [limits, setLimits] = useState({
    used: 0,
    total: 5,
    remaining: 5,
    percentage: 0,
    isPremium: false,
    nextReset: null as Date | null
  });
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, 
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const used = userData.limits?.freeMessagesSent || 0;
            const total = userData.limits?.maxFreeMessages || 5;
            const remaining = Math.max(0, total - used);
            const percentage = (used / total) * 100;
            const isPremium = userData.subscription?.tier === 'premium';
            const nextReset = userData.limits?.nextReset?.toDate();

            setLimits({
              used,
              total,
              remaining,
              percentage,
              isPremium,
              nextReset
            });

            if (used === 3 && !isPremium && !showUpgradePrompt) {
              setShowUpgradePrompt(true);
              toast.messageLimitWarning(2);
            } else if (used === 4 && !isPremium && !showUpgradePrompt) {
              setShowUpgradePrompt(true);
              toast.messageLimitWarning(1);
            }
          } else {
            setLimits({
              used: 0,
              total: 5,
              remaining: 5,
              percentage: 0,
              isPremium: false,
              nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
          }
        } catch (error) {
          console.error('Error processing user data:', error);
          toast.unknownError();
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error listening to user limits:', error);
        setLoading(false);
        toast.networkError();
      }
    );

    return unsubscribe;
  }, [user, showUpgradePrompt, toast]);

  const incrementMessageCount = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Ensure profile exists first
      await ensureUserProfileExists(user.uid);

      await updateDoc(userRef, {
        'limits.freeMessagesSent': increment(1),
        'totalMessages': increment(1),
        'updatedAt': serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      console.error('Error incrementing message count:', error);
      toast.unknownError();
      return false;
    }
  };

  const canSendMessage = (): boolean => {
    return limits.isPremium || limits.remaining > 0;
  };

  const getUpgradeMessage = () => {
    if (limits.used === 3) {
      return {
        title: "Only 2 messages left! 🚨",
        message: "Upgrade to keep the conversation going!",
        type: "warning" as const
      };
    } else if (limits.used === 4) {
      return {
        title: "Last message! ⚠️",
        message: "This is your final free message. Upgrade for unlimited!",
        type: "urgent" as const
      };
    } else if (limits.used >= 5) {
      return {
        title: "Message limit reached! 🔒",
        message: "Upgrade to premium to continue messaging",
        type: "blocked" as const
      };
    }
    return null;
  };

  return {
    limits,
    loading,
    showUpgradePrompt,
    setShowUpgradePrompt,
    incrementMessageCount,
    canSendMessage,
    getUpgradeMessage
  };
}