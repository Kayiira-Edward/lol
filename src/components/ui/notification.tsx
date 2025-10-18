// src/components/ui/notification.tsx
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertCircle, Info, Bell } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const icons = {
  success: Check,
  error: X,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-800',
    icon: 'text-green-500',
    progress: 'bg-green-500',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500',
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-800',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
  },
};

export function Notification({ notification, onDismiss }: NotificationProps) {
  const [progress, setProgress] = useState(100);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const Icon = icons[notification.type];
  const style = styles[notification.type];
  const duration = notification.duration || 5000;

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        handleDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const handleAction = () => {
    notification.action?.onClick();
    handleDismiss();
  };

  return (
    <div
      className={cn(
        "relative w-80 bg-white rounded-2xl border-2 shadow-2xl backdrop-blur-sm transform transition-all duration-300",
        style.container,
        isLeaving 
          ? "animate-slide-out-right opacity-0 scale-95" 
          : "animate-slide-in-right opacity-100 scale-100"
      )}
      style={{
        animationDelay: '0.1s',
      }}
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-gray-200 rounded-t-2xl">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", style.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("flex-shrink-0 w-5 h-5 mt-0.5", style.icon)}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="mb-1 text-sm font-semibold leading-tight">
              {notification.title}
            </h4>
            <p className="text-sm leading-relaxed opacity-90">
              {notification.message}
            </p>
            
            {notification.action && (
              <button
                onClick={handleAction}
                className="mt-2 text-sm font-medium underline transition-all duration-200 transform hover:no-underline hover:scale-105"
              >
                {notification.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="flex items-center justify-center flex-shrink-0 w-6 h-6 transition-colors duration-200 rounded-full hover:bg-black/5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}