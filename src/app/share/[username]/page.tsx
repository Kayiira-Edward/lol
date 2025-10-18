// src/app/share/[username]/page.tsx - Updated version
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Send, Sparkles, Eye, Crown } from "lucide-react";
import { EmojiKeyboard } from '@/components/genz/emoji-keyboard';
import { PromptSuggestions } from '@/components/genz/prompt-suggestions';
import { useMessageLimits } from '@/hooks/use-message-limits';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { safeSendMessage } from '@/lib/utils/message-utils';

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user } = useAuth();
  const toast = useToast();
  
  const [message, setMessage] = useState('');
  const [vibe, setVibe] = useState('vibeCheck');
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  const { limits, canSendMessage, getUpgradeMessage } = useMessageLimits();
  const upgradeMessage = getUpgradeMessage();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(
        'Sign In Required',
        'Please sign in to send messages'
      );
      router.push('/login');
      return;
    }

    if (!canSendMessage()) {
      toast.messageLimitReached();
      return;
    }

    if (!message.trim()) {
      toast.error(
        'Empty Message',
        'Please enter a message before sending'
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await safeSendMessage(user.uid, {
        receiverUsername: username,
        content: message,
        vibe: vibe,
        anonymous: isAnonymous
      });

      if (success) {
        setMessage('');
        toast.messageSent();
      } else {
        toast.error(
          'Failed to Send',
          'There was an issue sending your message. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(
        'Send Failed',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiKeyboard(false);
  };

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
  };

  if (!canSendMessage() && limits.used >= 5) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Card className="w-full max-w-md p-8 text-center border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Message Limit Reached! 🚨
          </h1>
          <p className="mb-6 text-gray-600">
            You've used all {limits.total} free messages. Upgrade to premium for unlimited messaging!
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => router.push('/upgrade')}
            >
              Upgrade to Premium - $2.99/month
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => router.push('/login')}
            >
              Sign In to Your Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="pt-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              LOL
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Send message to <GradientText>@{username}</GradientText>
          </h1>
          <p className="text-gray-600">
            Be honest, be funny, be you! Your message is 100% anonymous 😉
          </p>
        </div>

        {/* Upgrade Warning */}
        {upgradeMessage && (
          <Card className={`p-4 mb-6 border-2 ${
            upgradeMessage.type === 'blocked' 
              ? 'border-red-300 bg-red-50' 
              : upgradeMessage.type === 'urgent'
              ? 'border-orange-300 bg-orange-50'
              : 'border-yellow-300 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${
                upgradeMessage.type === 'blocked' ? 'text-red-500' :
                upgradeMessage.type === 'urgent' ? 'text-orange-500' :
                'text-yellow-500'
              }`} />
              <div>
                <h3 className="font-semibold text-gray-800">{upgradeMessage.title}</h3>
                <p className="text-sm text-gray-600">{upgradeMessage.message}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Message Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSendMessage}>
                {/* Message Input */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Your Anonymous Message {!isAnonymous && '👀'}
                  </label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here... Be kind! ✨"
                      rows={4}
                      className="w-full px-4 py-3 transition-all border-2 border-gray-300 resize-none rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                      maxLength={500}
                    />
                    <div className="absolute flex gap-2 bottom-3 right-3">
                      <button
                        type="button"
                        onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}
                        className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        😊
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>{message.length}/500 characters</span>
                    <span>{limits.remaining} messages left</span>
                  </div>
                </div>

                {/* Emoji Keyboard */}
                {showEmojiKeyboard && (
                  <div className="mb-4">
                    <EmojiKeyboard 
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiKeyboard(false)}
                    />
                  </div>
                )}

                {/* Anonymous Toggle */}
                <div className="flex items-center gap-3 p-3 mb-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        isAnonymous ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                          isAnonymous ? 'translate-x-7' : 'translate-x-1'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                    <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                      Send Anonymously
                    </label>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting || !canSendMessage()}
                  className="w-full py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message Anonymously 🚀
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Prompt Suggestions */}
          <div className="lg:col-span-1">
            <PromptSuggestions onPromptSelect={handlePromptSelect} />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">🔒</div>
            <h4 className="mb-1 font-semibold text-gray-800">100% Anonymous</h4>
            <p className="text-sm text-gray-600">No one will know it's you</p>
          </Card>
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">✨</div>
            <h4 className="mb-1 font-semibold text-gray-800">Gen Z Vibe</h4>
            <p className="text-sm text-gray-600">Fun, casual, authentic</p>
          </Card>
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">💌</div>
            <h4 className="mb-1 font-semibold text-gray-800">Instant Delivery</h4>
            <p className="text-sm text-gray-600">They'll get it right away</p>
          </Card>
        </div>
      </div>
    </div>
  );
}