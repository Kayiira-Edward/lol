// src/hooks/use-message-limits.ts
"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from './use-auth';

export function useMessageLimits() {
  const { user, profile } = useAuth();
  const [limits, setLimits] = useState({
    used: 0,
    total: 5,
    remaining: 5,
    percentage: 0,
    isPremium: false,
    nextReset: null
  });
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
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

        // Show upgrade prompts at strategic points
        if (used === 3 && !isPremium) {
          setShowUpgradePrompt(true);
        }
      }
    });

    return unsubscribe;
  }, [user]);

  const incrementMessageCount = async () => {
    if (!user || limits.isPremium) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'limits.freeMessagesSent': increment(1),
        'totalMessages': increment(1),
        'updatedAt': new Date()
      });
    } catch (error) {
      console.error('Error incrementing message count:', error);
    }
  };

  const canSendMessage = () => {
    return limits.isPremium || limits.remaining > 0;
  };

  const getUpgradeMessage = () => {
    if (limits.used === 3) {
      return {
        title: "Only 2 messages left! 🚨",
        message: "Upgrade to keep the conversation going!",
        type: "warning"
      };
    } else if (limits.used >= 4) {
      return {
        title: "Last message! ⚠️",
        message: "This is your final free message. Upgrade for unlimited!",
        type: "urgent"
      };
    } else if (limits.used >= 5) {
      return {
        title: "Message limit reached! 🔒",
        message: "Upgrade to premium to continue messaging",
        type: "blocked"
      };
    }
    return null;
  };

  return {
    limits,
    showUpgradePrompt,
    setShowUpgradePrompt,
    incrementMessageCount,
    canSendMessage,
    getUpgradeMessage
  };
}