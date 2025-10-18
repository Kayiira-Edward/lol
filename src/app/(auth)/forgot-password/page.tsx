// src/app/(auth)/forgot-password/page.tsx - Clean professional version
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, ArrowLeft, Mail, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { resetPassword } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(email);
      setLoading(false);
      setSubmitted(true);
      
      toast.success(
        'Check Your Email',
        `We've sent a password reset link to ${email}`,
        { duration: 6000 }
      );
    } catch (error: any) {
      setLoading(false);
      setError(error.userFriendlyMessage);
      
      toast.error(
        'Unable to Send',
        error.userFriendlyMessage
      );
    }
  };

  if (submitted) {
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

          <Card className="p-6 text-center border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Check Your Email
            </h1>
            
            <p className="mb-6 text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>

            <div className="p-4 mb-6 space-y-3 text-sm text-gray-500 rounded-lg bg-gray-50">
              <p className="font-semibold">Not seeing the email?</p>
              <ul className="mt-2 space-y-2 text-left">
                <li>• Check your spam or junk folder</li>
                <li>• Wait a few minutes for delivery</li>
                <li>• Verify the email address is correct</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Return to Login
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500">
                Need a new link?{' '}
                <button 
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  Send again
                </button>
              </p>
            </div>
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
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        <Card className="p-6 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          {error && (
            <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-3 transition-all border-2 border-gray-300 pl-11 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Reset Link
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </div>
              )}
            </Button>
          </form>

          <div className="pt-6 mt-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Back to login
              </Link>
            </p>
          </div>
        </Card>

        <div className="p-4 mt-6 text-center border border-blue-200 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            Check your spam folder if you don't see the email within a few minutes
          </p>
        </div>
      </div>
    </div>
  );
}