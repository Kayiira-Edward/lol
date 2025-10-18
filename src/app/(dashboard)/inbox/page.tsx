// src/app/(dashboard)/inbox/page.tsx - Updated with real message display
"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Plus, Crown, Users, Zap, RefreshCw, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useMessageLimits } from '@/hooks/use-message-limits';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  receiverUsername: string;
  content: string;
  vibe: string;
  timestamp: any;
  read: boolean;
  anonymous: boolean;
}

export default function InboxPage() {
  const { user, profile } = useAuth();
  const { limits, getUpgradeMessage } = useMessageLimits();
  const toast = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [refreshing, setRefreshing] = useState(false);

  const upgradeMessage = getUpgradeMessage();

  // Fetch messages from Firestore
  useEffect(() => {
    if (!user || !profile) return;

    const messagesRef = collection(db, 'messages');
    
    // Query for messages sent to the current user
    const q = query(
      messagesRef, 
      where('receiverUsername', '==', profile.username.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messagesData: Message[] = [];
        snapshot.forEach((doc) => {
          messagesData.push({
            id: doc.id,
            ...doc.data()
          } as Message);
        });
        
        setMessages(messagesData);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
        setRefreshing(false);
        toast.error('Error', 'Failed to load messages');
      }
    );

    return () => unsubscribe();
  }, [user, profile, toast]);

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        read: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const refreshMessages = () => {
    setRefreshing(true);
    // The snapshot listener will automatically update
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getVibeEmoji = (vibe: string) => {
    const vibeEmojis: Record<string, string> = {
      love: '💘',
      silly: '🤪',
      spicy: '🌶️',
      deep: '💭',
      church: '⛪',
      vibeCheck: '✨'
    };
    return vibeEmojis[vibe] || '💬';
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

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
              <div className="text-2xl font-bold text-purple-600">{messages.length}</div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
          </Card>
          <Card className="p-4 border-pink-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
          </Card>
          <Card className="p-4 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{limits.used}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
          </Card>
          <Card className="p-4 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile?.inboxCount || 0}</div>
              <div className="text-sm text-gray-600">Received</div>
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
                  Inbox ({messages.length})
                </Button>
                <Button 
                  variant={activeTab === 'sent' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('sent')}
                  className="rounded-xl"
                >
                  Sent ({limits.used})
                </Button>
                <Button
                  variant="outline"
                  onClick={refreshMessages}
                  disabled={refreshing}
                  className="rounded-xl"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
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
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                      message.read 
                        ? 'border-gray-200 bg-white' 
                        : 'border-purple-300 bg-purple-50'
                    }`}
                    onClick={() => !message.read && markAsRead(message.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          message.vibe === 'love' ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                          message.vibe === 'silly' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                          message.vibe === 'spicy' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                          message.vibe === 'deep' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                          message.vibe === 'church' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
                          'bg-gradient-to-br from-purple-500 to-violet-500'
                        }`}>
                          {getVibeEmoji(message.vibe)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {message.anonymous ? 'Anonymous' : 'Someone'}
                          </h3>
                          <p className="text-sm text-gray-500">{getTimeAgo(message.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        )}
                        {message.anonymous && (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-lg text-gray-700">{message.content}</p>
                    
                    {/* Vibe Badge */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-2 py-1 text-xs text-gray-600 capitalize bg-gray-100 rounded-full">
                        {message.vibe} vibe
                      </span>
                    </div>
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