// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, ArrowLeft, Lock, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { confirmPasswordReset } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Get the reset code from URL parameters
    const oobCode = searchParams.get('oobCode');
    if (oobCode) {
      setCode(oobCode);
    } else {
      setError('Invalid or missing reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(code, newPassword);
      setLoading(false);
      setSuccess(true);
      
      toast.success(
        'Password Reset! ✅',
        'Your password has been reset successfully. You can now sign in with your new password.',
        { duration: 5000 }
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      setLoading(false);
      setError(error.userFriendlyMessage || error.message);
      
      toast.error(
        'Reset Failed',
        error.userFriendlyMessage || 'There was an error resetting your password. Please try again.'
      );
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="w-full max-w-md">
          <Card className="p-6 text-center border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Password Reset! ✅
            </h1>
            
            <p className="mb-6 text-gray-600">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            
            <Link href="/login">
              <Button className="w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Sign In Now
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full max-w-md">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 mb-8 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              LOL
            </span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Reset Password 🔑
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        <Card className="p-6 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              ❌ {error}
            </div>
          )}

          {!code ? (
            <div className="p-4 text-center">
              <p className="mb-4 text-red-600">Invalid or expired reset link.</p>
              <Link href="/forgot-password">
                <Button variant="outline">
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  New Password *
                </label>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm New Password *
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              {/* Password Requirements */}
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="mb-2 text-sm font-medium text-gray-700">Password Requirements:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                    • At least 6 characters
                  </li>
                  <li className={newPassword === confirmPassword && confirmPassword ? 'text-green-600' : ''}>
                    • Passwords must match
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    Resetting Password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Reset Password 🚀
                  </div>
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}