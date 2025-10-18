// src/app/(dashboard)/inbox/page.tsx
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Plus, Crown, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useMessageLimits } from '@/hooks/use-message-limits';

export default function InboxPage() {
  const { user, profile } = useAuth();
  const { limits, getUpgradeMessage } = useMessageLimits();
  const [activeTab, setActiveTab] = useState('inbox');

  const mockMessages = [
    { id: 1, sender: "Anonymous", message: "You're so funny! 😂", vibe: "silly", timestamp: "2 min ago", unread: true },
    { id: 2, sender: "Secret Admirer", message: "Lowkey crushing on you 🫣", vibe: "love", timestamp: "1 hour ago", unread: true },
    { id: 3, sender: "Anonymous", message: "Your vibe is immaculate ✨", vibe: "vibeCheck", timestamp: "3 hours ago", unread: false },
  ];

  const upgradeMessage = getUpgradeMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">LOL Inbox</h1>
                <p className="text-sm text-gray-600">@{profile?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Message Limit Indicator */}
              <div className="items-center hidden gap-2 px-3 py-2 border border-purple-200 sm:flex bg-white/80 rounded-xl">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {limits.remaining}/{limits.total} messages
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${limits.percentage}%` }}
                    ></div>
                  </div>
                </div>
                {!limits.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>

              <Link href="/inbox/create">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </Link>
            </div>
          </div>

          {/* Upgrade Banner */}
          {upgradeMessage && (
            <div className={`mt-4 p-4 rounded-xl border-2 ${
              upgradeMessage.type === 'blocked' 
                ? 'border-red-300 bg-red-50' 
                : upgradeMessage.type === 'urgent'
                ? 'border-orange-300 bg-orange-50'
                : 'border-yellow-300 bg-yellow-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${
                    upgradeMessage.type === 'blocked' ? 'text-red-500' :
                    upgradeMessage.type === 'urgent' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-gray-800">{upgradeMessage.title}</h3>
                    <p className="text-sm text-gray-600">{upgradeMessage.message}</p>
                  </div>
                </div>
                <Button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl p-4 mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <Card className="p-4 border-purple-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockMessages.length}</div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>
          </Card>
          <Card className="p-4 border-pink-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{limits.used}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
          </Card>
          <Card className="p-4 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Replies</div>
            </div>
          </Card>
          <Card className="p-4 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
          </Card>
        </div>

        {/* Messages List */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Messages</h2>
              <div className="flex gap-2">
                <Button 
                  variant={activeTab === 'inbox' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('inbox')}
                  className="rounded-xl"
                >
                  Inbox
                </Button>
                <Button 
                  variant={activeTab === 'sent' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('sent')}
                  className="rounded-xl"
                >
                  Sent
                </Button>
              </div>
            </div>

            {mockMessages.length === 0 ? (
              <div className="py-12 text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-600">No messages yet</h3>
                <p className="mb-6 text-gray-500">Share your link to start receiving messages!</p>
                <Link href="/inbox/create">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Share Your Link
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div 
                    key={message.id}
                    className="p-4 transition-all duration-300 bg-white border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          message.vibe === 'love' ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                          message.vibe === 'silly' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                          'bg-gradient-to-br from-purple-500 to-blue-500'
                        }`}>
                          {message.vibe === 'love' ? '💘' : message.vibe === 'silly' ? '🤪' : '✨'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{message.sender}</h3>
                          <p className="text-sm text-gray-500">{message.timestamp}</p>
                        </div>
                      </div>
                      {message.unread && (
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      )}
                    </div>
                    <p className="text-lg text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Share Prompt */}
        <Card className="p-6 mt-6 text-center text-white bg-gradient-to-r from-purple-500 to-pink-500">
          <h3 className="mb-2 text-xl font-bold">Share your link everywhere! 🌟</h3>
          <p className="mb-4 opacity-90">Instagram, TikTok, WhatsApp - get those messages flowing!</p>
          <Link href="/inbox/create">
            <Button variant="outline" className="text-purple-600 bg-white border-white hover:bg-gray-100">
              <Users className="w-4 h-4 mr-2" />
              Get Your Share Link
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}