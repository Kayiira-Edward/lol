// src/components/auth/username-checker-firebase.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Check, X, Clock, Sparkles, AlertCircle } from "lucide-react";

interface UsernameCheckerFirebaseProps {
  onUsernameChange: (username: string, isValid: boolean) => void;
  initialUsername?: string;
  className?: string;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

export function UsernameCheckerFirebase({ 
  onUsernameChange, 
  initialUsername = '',
  className = '' 
}: UsernameCheckerFirebaseProps) {
  const [username, setUsername] = useState(initialUsername);
  const [status, setStatus] = useState<UsernameStatus>('idle');
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const validationRules = {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    reserved: ['admin', 'moderator', 'support', 'help', 'official', 'lol', 'root']
  };

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username.length === 0) {
        setStatus('idle');
        setMessage('');
        onUsernameChange('', false);
        return;
      }

      // Basic validation
      if (username.length < validationRules.minLength) {
        setStatus('invalid');
        setMessage(`Username must be at least ${validationRules.minLength} characters`);
        onUsernameChange(username, false);
        return;
      }

      if (username.length > validationRules.maxLength) {
        setStatus('invalid');
        setMessage(`Username must be less than ${validationRules.maxLength} characters`);
        onUsernameChange(username, false);
        return;
      }

      if (!validationRules.pattern.test(username)) {
        setStatus('invalid');
        setMessage('Only letters, numbers, and underscores allowed');
        onUsernameChange(username, false);
        return;
      }

      if (validationRules.reserved.includes(username.toLowerCase())) {
        setStatus('invalid');
        setMessage('This username is reserved');
        onUsernameChange(username, false);
        return;
      }

      // Firebase availability check
      setStatus('checking');
      setMessage('Checking availability...');
      setIsChecking(true);
      onUsernameChange(username, false);

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setStatus('available');
          setMessage('🎉 Perfect! This username is available');
          onUsernameChange(username, true);
        } else {
          setStatus('taken');
          setMessage('😢 Username is already taken');
          onUsernameChange(username, false);
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setStatus('error');
        setMessage('⚠️ Error checking username. Please try again.');
        onUsernameChange(username, false);
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (username.length >= validationRules.minLength) {
        checkUsernameAvailability();
      } else if (username.length > 0) {
        setStatus('invalid');
        setMessage(`Username must be at least ${validationRules.minLength} characters`);
        onUsernameChange(username, false);
      } else {
        setStatus('idle');
        setMessage('');
        onUsernameChange('', false);
      }
    }, 600);

    return () => clearTimeout(debounceTimer);
  }, [username, onUsernameChange]);

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'taken':
      case 'invalid':
      case 'error':
        return 'border-red-500 bg-red-50 text-red-700';
      case 'checking':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4" />;
      case 'taken':
      case 'invalid':
      case 'error':
        return <X className="w-4 h-4" />;
      case 'checking':
        return <Clock className="w-4 h-4 animate-spin" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const generateSuggestions = () => {
    if (status !== 'taken') return [];
    
    const base = username.toLowerCase();
    const suggestions = [
      `${base}${Math.floor(Math.random() * 999)}`,
      `${base}_${Math.floor(Math.random() * 99)}`,
      `real${base.charAt(0).toUpperCase() + base.slice(1)}`,
      `the${base.charAt(0).toUpperCase() + base.slice(1)}`,
      `${base}${new Date().getFullYear()}`
    ];
    
    return suggestions.slice(0, 3);
  };

  const suggestions = generateSuggestions();

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg transition-colors ${
              status === 'available' ? 'border-green-500' :
              status === 'taken' || status === 'invalid' ? 'border-red-500' :
              status === 'checking' ? 'border-yellow-500' :
              'border-gray-300'
            }`}
            placeholder="Enter username"
          />
          <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
            {getStatusIcon()}
          </div>
        </div>

        {message && (
          <div className={`p-2 rounded text-sm ${getStatusColor()}`}>
            {message}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="p-2 border border-blue-200 rounded bg-blue-50">
            <p className="mb-1 text-sm text-blue-800">Try these instead:</p>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setUsername(suggestion)}
                  className="block w-full text-sm text-left text-blue-600 hover:text-blue-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}