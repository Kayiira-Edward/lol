// src/app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Eye, EyeOff, Loader2, Chrome, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { SocialButtons } from '@/components/auth/social-buttons';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signIn, signInWithGoogle, loading, error } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(formData.email, formData.password);
  };

  const handleDemoLogin = async () => {
    // Demo credentials for quick testing
    setFormData({
      email: 'demo@lolapp.com',
      password: 'demopassword123'
    });
    
    // Auto-submit after a brief delay to show the filled form
    setTimeout(async () => {
      await signIn('demo@lolapp.com', 'demopassword123');
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-8 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
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
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            Sign in to check your anonymous messages
          </p>
        </div>

        <Card className="p-6 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          {/* Social Sign In */}
          <SocialButtons 
            onGoogleSignIn={signInWithGoogle}
            loading={loading}
          />

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or continue with email</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 transition-all border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 transition-all border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                ❌ {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Sign In to Your Account 🚀
                </div>
              )}
            </Button>

            {/* Demo Login Button */}
            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              variant="outline"
              className="w-full py-3 font-medium text-blue-600 transition-all duration-300 border-2 border-blue-300 hover:bg-blue-50 rounded-xl disabled:opacity-50"
            >
              🎯 Try Demo Account
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="pt-6 mt-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-purple-600 transition-colors hover:text-purple-700">
                Create one here
              </Link>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-3 text-center border border-purple-200 bg-white/50 rounded-xl">
            <div className="mb-1 text-lg">🔒</div>
            <p className="text-xs font-medium text-gray-700">Secure</p>
          </div>
          <div className="p-3 text-center border border-pink-200 bg-white/50 rounded-xl">
            <div className="mb-1 text-lg">⚡</div>
            <p className="text-xs font-medium text-gray-700">Fast</p>
          </div>
          <div className="p-3 text-center border border-blue-200 bg-white/50 rounded-xl">
            <div className="mb-1 text-lg">🎯</div>
            <p className="text-xs font-medium text-gray-700">Gen Z</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 mt-6 text-center border border-yellow-200 bg-yellow-50 rounded-xl">
          <p className="text-sm text-yellow-800">
            🔐 Your messages are 100% anonymous and secure
          </p>
        </div>
      </div>
    </div>
  );
}