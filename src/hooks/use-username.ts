// src/hooks/use-username.ts
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useUsername() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setStatus('invalid');
        setMessage('Username must be at least 3 characters');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setStatus('invalid');
        setMessage('Only letters, numbers, and underscores allowed');
        return;
      }

      setStatus('checking');
      setMessage('Checking availability...');

      try {
        // Simulate API call - in real app, query Firestore
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock availability - 80% chance available
        const isAvailable = Math.random() > 0.2;
        
        if (isAvailable) {
          setStatus('available');
          setMessage('🎉 Username is available!');
        } else {
          setStatus('taken');
          setMessage('😢 Username is already taken');
        }
      } catch (error) {
        setStatus('invalid');
        setMessage('Error checking username');
      }
    };

    const debounceTimer = setTimeout(() => {
      if (username.length >= 3) {
        checkUsername();
      } else {
        setStatus('idle');
        setMessage('');
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'border-green-500 bg-green-50 text-green-700';
      case 'taken': return 'border-red-500 bg-red-50 text-red-700';
      case 'invalid': return 'border-red-500 bg-red-50 text-red-700';
      case 'checking': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available': return '✅';
      case 'taken': return '❌';
      case 'invalid': return '⚠️';
      case 'checking': return '⏳';
      default: return '💡';
    }
  };

  return {
    username,
    setUsername,
    status,
    message,
    getStatusColor,
    getStatusIcon,
    isValid: status === 'available'
  };
}