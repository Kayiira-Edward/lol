// src/components/ui/notification-provider.tsx
"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { Notification, NotificationType } from './notification';
import { Notification as NotificationComponent } from './notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ notifications, addNotification, removeNotification, clearNotifications }}
    >
      {children}
      
      {/* Notification Container */}
      <div className="fixed z-50 space-y-3 pointer-events-none top-4 right-4">
        {notifications.map(notification => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationComponent
              notification={notification}
              onDismiss={removeNotification}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Hook for easy notification triggers
export function useNotify() {
  const { addNotification } = useNotification();

  const notify = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    addNotification({
      type,
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    });
  }, [addNotification]);

  const success = useCallback((title: string, message: string, options?: any) => {
    notify('success', title, message, options);
  }, [notify]);

  const error = useCallback((title: string, message: string, options?: any) => {
    notify('error', title, message, options);
  }, [notify]);

  const warning = useCallback((title: string, message: string, options?: any) => {
    notify('warning', title, message, options);
  }, [notify]);

  const info = useCallback((title: string, message: string, options?: any) => {
    notify('info', title, message, options);
  }, [notify]);

  return {
    notify,
    success,
    error,
    warning,
    info,
  };
}