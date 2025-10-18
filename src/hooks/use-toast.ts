// src/hooks/use-toast.ts - Updated version
import { useNotify } from '@/components/ui/notification-provider';

export function useToast() {
  const notify = useNotify();

  return {
    // Auth notifications
    signInSuccess: () => notify.success('Welcome Back! 👋', 'Successfully signed in to your account', { duration: 3000 }),
    signUpSuccess: () => notify.success('Account Created! 🎉', 'Your LOL account has been created successfully', { duration: 4000 }),
    signOutSuccess: () => notify.info('Signed Out', 'You have been successfully signed out', { duration: 3000 }),
    
    // Message notifications
    messageSent: () => notify.success('Message Sent! ✨', 'Your anonymous message was delivered', { duration: 3000 }),
    messageLimitWarning: (remaining: number) => notify.warning(
      `Only ${remaining} Messages Left!`,
      'Upgrade to premium for unlimited messaging',
      {
        duration: 5000,
        action: remaining === 1 ? {
          label: 'Upgrade Now',
          onClick: () => { window.location.href = '/upgrade'; }
        } : undefined
      }
    ),
    messageLimitReached: () => notify.error(
      'Message Limit Reached! 🔒',
      'You\'ve used all your free messages. Upgrade to continue messaging.',
      {
        duration: 6000,
        action: {
          label: 'Upgrade Now',
          onClick: () => { window.location.href = '/upgrade'; }
        }
      }
    ),

    // Error notifications
    authError: (message: string) => notify.error('Authentication Error 🔐', message, { duration: 5000 }),
    networkError: () => notify.error('Network Error 📡', 'Please check your internet connection and try again', { duration: 5000 }),
    unknownError: () => notify.error('Oops! Something went wrong 😅', 'Please try again in a moment', { duration: 4000 }),

    // Success notifications
    profileUpdated: () => notify.success('Profile Updated! ✅', 'Your changes have been saved successfully', { duration: 3000 }),
    settingsSaved: () => notify.success('Settings Saved! ⚙️', 'Your preferences have been updated', { duration: 3000 }),

    // Premium notifications
    premiumUpgraded: () => notify.success(
      'Welcome to Premium! 💎',
      'You now have unlimited messaging and premium features',
      { duration: 5000 }
    ),
    
    // Copy to clipboard
    copiedToClipboard: () => notify.info('Copied! 📋', 'Link copied to clipboard', { duration: 2000 }),

    // Generic notifications
    success: (title: string, message: string, options?: any) => notify.success(title, message, options),
    error: (title: string, message: string, options?: any) => notify.error(title, message, options),
    warning: (title: string, message: string, options?: any) => notify.warning(title, message, options),
    info: (title: string, message: string, options?: any) => notify.info(title, message, options),
  };
}