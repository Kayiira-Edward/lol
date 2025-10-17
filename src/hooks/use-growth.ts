// src/hooks/use-growth.ts
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useGrowth(userId: string) {
  const [growthStats, setGrowthStats] = useState({
    messagesReceived: 0,
    referrals: 0,
    inboxViews: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    if (!userId) return;

    // Listen to user's growth metrics
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setGrowthStats({
          messagesReceived: userData.totalMessages || 0,
          referrals: userData.referralCount || 0,
          inboxViews: userData.inboxViews || 0,
          conversionRate: userData.conversionRate || 0,
        });
      }
    });

    return unsubscribe;
  }, [userId]);

  const trackInboxView = async (inboxId: string) => {
    try {
      await updateDoc(doc(db, 'inboxes', inboxId), {
        views: increment(1),
        lastViewedAt: new Date(),
      });
    } catch (error) {
      console.error('Error tracking inbox view:', error);
    }
  };

  const trackMessageSent = async (inboxId: string, senderType: 'anonymous' | 'user') => {
    try {
      await updateDoc(doc(db, 'inboxes', inboxId), {
        [`analytics.${senderType}Messages`]: increment(1),
        totalMessages: increment(1),
      });
    } catch (error) {
      console.error('Error tracking message:', error);
    }
  };

  return {
    growthStats,
    trackInboxView,
    trackMessageSent,
  };
}