// src/app/(auth)/signup/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useUsername } from '@/hooks/use-username';
import { SocialButtons } from '@/components/auth/social-buttons';

export default function SignupPage() {
  const { signUp, signInWithGoogle, loading, error } = useAuth();
  const { 
    username, 
    setUsername, 
    status, 
    message, 
    getStatusColor, 
    getStatusIcon, 
    isValid 
  } = useUsername();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak 😟';
    if (passwordStrength <= 3) return 'Medium 😊';
    return 'Strong 🎉';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      alert('Please choose an available username');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      alert('Please choose a stronger password');
      return;
    }

    await signUp(formData.email, formData.password, username);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full max-w-md">
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
            Join the Fun! 🎉
          </h1>
          <p className="text-gray-600">
            Create your account and start receiving anonymous messages
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
            {/* Username Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Choose Your Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                    status === 'available' 
                      ? 'border-green-500 focus:border-green-500' 
                      : status === 'taken' || status === 'invalid'
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-purple-500'
                  } bg-white/80 backdrop-blur-sm`}
                  placeholder="coolusername"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                />
                <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                  {status === 'checking' && <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />}
                  {status === 'available' && <Check className="w-5 h-5 text-green-500" />}
                  {(status === 'taken' || status === 'invalid') && <X className="w-5 h-5 text-red-500" />}
                </div>
              </div>
              {message && (
                <div className={`mt-2 p-2 rounded-lg border text-sm ${getStatusColor()}`}>
                  {getStatusIcon()} {message}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only letters, numbers, and underscores. 3-20 characters.
              </p>
            </div>

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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-3 pr-12 transition-all border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength <= 2 ? 'text-red-600' :
                      passwordStrength <= 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 bg-white/80 backdrop-blur-sm transition-all ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                }`}
                placeholder="Confirm your password"
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">❌ Passwords don't match</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-500">✅ Passwords match!</p>
              )}
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
              disabled={loading || !isValid || passwordStrength < 3}
              className="w-full py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Create My LOL Account 🎉
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="pt-6 mt-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 text-center border border-purple-200 bg-white/50 rounded-xl">
            <div className="mb-2 text-2xl">🔒</div>
            <p className="text-sm font-medium text-gray-700">100% Anonymous</p>
          </div>
          <div className="p-4 text-center border border-pink-200 bg-white/50 rounded-xl">
            <div className="mb-2 text-2xl">🎮</div>
            <p className="text-sm font-medium text-gray-700">Gen Z Vibe</p>
          </div>
          <div className="p-4 text-center border border-blue-200 bg-white/50 rounded-xl">
            <div className="mb-2 text-2xl">🚀</div>
            <p className="text-sm font-medium text-gray-700">5 Free Messages</p>
          </div>
          <div className="p-4 text-center border border-green-200 bg-white/50 rounded-xl">
            <div className="mb-2 text-2xl">💎</div>
            <p className="text-sm font-medium text-gray-700">Upgrade Anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}