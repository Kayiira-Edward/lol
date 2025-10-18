// src/app/(dashboard)/inbox/create/page.tsx
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { Link2, Copy, Share2, Check, MessageCircle, Users, Zap } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function CreateSharePage() {
  const { user, profile } = useAuth();
  const toast = useToast();
  
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${profile?.username}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.copiedToClipboard();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Copy Failed', 'Failed to copy link to clipboard');
    }
  };

  const shareToSocial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Send me anonymous messages!',
          text: 'Send me your honest thoughts, questions, or just say hi! Completely anonymous 😊',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const shareTexts = {
    instagram: "Send me your honest thoughts! Completely anonymous 💌",
    tiktok: "Roast me or compliment me - be honest! Anonymous messages 👀",
    whatsapp: "Hey! Send me anonymous messages here - be honest! 😊",
    twitter: "Ask me anything anonymously! Let's see what you really think 👀"
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="pt-8 mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            <GradientText>Share Your Link</GradientText> 📤
          </h1>
          <p className="text-lg text-gray-600">
            Share everywhere and get those anonymous messages flowing!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Share Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Link2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  Your Personal Link
                </h2>
                <p className="text-gray-600">
                  Share this link to receive anonymous messages
                </p>
              </div>

              {/* Share URL */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Your Share Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 font-mono text-sm text-gray-700 truncate bg-gray-100 border-2 border-gray-300 rounded-xl">
                    {shareUrl}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    className="px-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <Check className="w-4 h-4" /> Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Quick Share Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={shareToSocial}
                  className="text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Now
                </Button>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              {/* Share Tips */}
              <div className="p-4 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                  <Zap className="w-4 h-4 text-purple-500" />
                  Pro Tips for More Messages
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Post on Instagram Stories with a fun question</li>
                  <li>• Share in WhatsApp groups with friends</li>
                  <li>• Add to your TikTok bio</li>
                  <li>• Tweet it with a provocative question</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Sidebar - Copy-Paste Texts */}
          <div className="space-y-6">
            {/* Pre-written Texts */}
            <Card className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                Copy & Paste Texts
              </h3>
              
              <div className="space-y-4">
                {Object.entries(shareTexts).map(([platform, text]) => (
                  <div key={platform}>
                    <label className="block mb-1 text-xs font-medium text-gray-500 uppercase">
                      {platform}
                    </label>
                    <div className="relative">
                      <textarea
                        value={text}
                        readOnly
                        rows={3}
                        className="w-full p-3 pr-10 text-sm bg-gray-100 border-2 border-gray-300 resize-none rounded-xl"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="absolute w-6 h-6 right-2 top-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 text-white bg-gradient-to-br from-purple-500 to-pink-500">
              <h3 className="flex items-center gap-2 mb-4 font-semibold">
                <Users className="w-4 h-4" />
                Your Impact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Messages Received</span>
                  <span className="font-bold">{profile?.inboxCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Link Clicks</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile Views</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Platform Guides */}
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">📱</div>
            <h4 className="mb-1 font-semibold text-gray-800">Instagram</h4>
            <p className="text-sm text-gray-600">Add to your bio & stories</p>
          </Card>
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">🎵</div>
            <h4 className="mb-1 font-semibold text-gray-800">TikTok</h4>
            <p className="text-sm text-gray-600">Put in your bio link</p>
          </Card>
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">💬</div>
            <h4 className="mb-1 font-semibold text-gray-800">WhatsApp</h4>
            <p className="text-sm text-gray-600">Share in groups & status</p>
          </Card>
          <Card className="p-4 text-center border-0 bg-white/80 backdrop-blur-sm">
            <div className="mb-2 text-2xl">🐦</div>
            <h4 className="mb-1 font-semibold text-gray-800">Twitter</h4>
            <p className="text-sm text-gray-600">Pin to your profile</p>
          </Card>
        </div>
      </div>
    </div>
  );
}