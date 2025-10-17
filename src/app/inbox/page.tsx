"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { 
  MessageCircle, 
  Plus, 
  Share2, 
  Settings, 
  LogOut, 
  Mail, 
  Eye, 
  EyeOff,
  Reply, // Added for message list
  Heart, // Added for message list (though Zap/Heart aren't used, they were in the imported list)
  Zap // Added for message list
} from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import Link from "next/link";
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Define expected message and inbox types for better type safety (optional but good practice)
// type Message = {
//   id: string;
//   content: string;
//   vibe: 'question' | 'compliment' | 'confession' | 'feedback' | 'roast';
//   isRead: boolean;
//   riskLevel?: 'high' | 'low';
//   hasReplies?: boolean;
//   reactions?: { type: string; count: number }[];
//   createdAt: { toDate: () => Date } | null;
// };

// type Inbox = {
//   id: string;
//   name: string;
//   messageCount: number;
// };


export default function InboxPage() {
  const { user, profile, logout } = useAuth();
  // Using 'any' for messages/inboxes for simplicity, but types should be defined
  const [messages, setMessages] = useState<any[]>([]); 
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to user's inboxes
    const inboxesQuery = query(
      collection(db, 'inboxes'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeInboxes = onSnapshot(inboxesQuery, (snapshot) => {
      const inboxData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInboxes(inboxData);
      
      // If user has inboxes, listen to their messages
      if (inboxData.length > 0) {
        const messagesQuery = query(
          collection(db, 'messages'),
          // NOTE: The 'in' query requires up to 10 items. For more, pagination or composite queries are needed.
          where('inboxId', 'in', inboxData.map(inbox => inbox.id).slice(0, 10)), 
          orderBy('createdAt', 'desc')
        );

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
          const messageData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messageData);
          setLoading(false);
        });

        return () => unsubscribeMessages();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeInboxes();
  }, [user]);

  // --- START: Helper functions from the first block ---

  const getReactionIcon = (message: any) => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    // Check if reactions is an array (to handle data structure variations)
    const reactionsArray = Array.isArray(message.reactions) ? message.reactions : Object.values(message.reactions);

    if (reactionsArray.length === 0) return null;

    const topReaction = reactionsArray.reduce((prev: any, current: any) => 
      (prev.count > current.count) ? prev : current
    );
    
    const icons: { [key: string]: string } = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      fire: '🔥',
      think: '💭'
    };
    
    return icons[topReaction.type] || null;
  };

  const getVibeColor = (vibe: string) => {
    const colors: { [key: string]: string } = {
      question: 'text-blue-500',
      compliment: 'text-pink-500',
      confession: 'text-purple-500',
      feedback: 'text-green-500',
      roast: 'text-orange-500'
    };
    return colors[vibe] || 'text-gray-500';
  };

  const getVibeIcon = (vibe: string) => {
    const icons: { [key: string]: string } = {
      question: '❓',
      compliment: '💫',
      confession: '🗣️',
      feedback: '💡',
      roast: '🔥'
    };
    return icons[vibe] || '💬';
  };

  // --- END: Helper functions from the first block ---

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const totalMessages = messages.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LOL</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-semibold text-foreground">{profile?.displayName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container max-w-6xl px-6 pt-32 pb-20 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Your <GradientText>LOL Inbox</GradientText>
          </h1>
          <p className="text-xl text-muted-foreground">
            {totalMessages === 0 
              ? "Share your inbox and start receiving anonymous messages"
              : `You have ${unreadCount} new message${unreadCount !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="mb-2 text-2xl font-bold text-primary">{totalMessages}</div>
            <div className="text-muted-foreground">Total Messages</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-2xl font-bold text-accent">{profile?.karma || 0}</div>
            <div className="text-muted-foreground">Karma Points</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-2xl font-bold text-purple-500">{inboxes.length}</div>
            <div className="text-muted-foreground">Active Inboxes</div>
          </Card>
        </div>

        {inboxes.length === 0 ? (
          // No inboxes - show create CTA
          <Card className="max-w-2xl p-8 mx-auto text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Plus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="mb-4 text-2xl font-bold">Create Your First Inbox</h2>
            <p className="mb-6 text-muted-foreground">
              Choose an inbox type and start sharing your unique link to receive anonymous messages
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/inbox/create">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Share2 className="w-4 h-4 mr-2" />
                  Create Inbox
                </Button>
              </Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </Card>
        ) : (
          // Has inboxes - show messages and inboxes
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Messages List - REPLACED WITH ENHANCED LOGIC */}
            <Card className="p-6">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <Mail className="w-5 h-5" />
                Recent Messages {unreadCount > 0 && `(${unreadCount} new)`}
              </h3>
              
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                // Empty message state (copied from first block)
                <div className="py-8 text-center text-muted-foreground">
                  <EyeOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Share your inbox link to get started!</p>
                </div>
              ) : (
                // Full message list with click functionality (copied and adapted from first block)
                <div className="space-y-4">
                  {/* Using all messages, not just slice(0, 5) as the first block showed the full list UI */}
                  {messages.map((message) => (
                    <Link 
                      key={message.id} 
                      href={`/inbox/message/${message.id}`}
                      className="block transition-transform hover:scale-[1.02]"
                    >
                      <div className={`p-4 rounded-lg border cursor-pointer ${
                        message.isRead ? 'bg-muted/50' : 'bg-primary/5 border-primary/20'
                      } hover:shadow-md transition-all`}>
                        <div className="flex items-start justify-between mb-2">
                          {/* Vibe Icon and Text */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getVibeIcon(message.vibe)}</span>
                            <span className={`text-xs font-medium ${getVibeColor(message.vibe)}`}>
                              {message.vibe}
                            </span>
                            {/* Risk Level */}
                            {message.riskLevel === 'high' && (
                              <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                                ⚠️ Review
                              </span>
                            )}
                          </div>
                          {/* Reaction Icon and Reply Icon */}
                          <div className="flex items-center gap-2">
                            {getReactionIcon(message) && (
                              <span className="text-sm">{getReactionIcon(message)}</span>
                            )}
                            {message.hasReplies && (
                              <Reply className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        
                        {/* Message Content */}
                        <p className="mb-2 text-sm line-clamp-2">{message.content}</p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {/* Timestamp */}
                          <span>
                            {message.createdAt?.toDate ? 
                              new Date(message.createdAt.toDate()).toLocaleDateString() : 
                              'Recently'
                            }
                          </span>
                          <div className="flex items-center gap-2">
                            {/* New Badge */}
                            {!message.isRead && (
                              <span className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground">
                                New
                              </span>
                            )}
                            {/* Reply Button (Inside Link) */}
                            {/* NOTE: This button is technically inside the main message Link, which is fine, 
                                but in a real app, you might want a more complex click handler here
                                to prevent the main link navigation if Reply is clicked. 
                                For this component, keeping it as is from the first block's structure.
                            */}
                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={(e) => {
                                // Prevent navigating to the message details when clicking Reply
                                e.preventDefault(); 
                                e.stopPropagation();
                                // TODO: Add reply action (e.g., open reply modal)
                                console.log(`Attempting to reply to message ${message.id}`);
                            }}>
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Inboxes List (kept from second block) */}
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Your Inboxes</h3>
              <div className="space-y-4">
                {inboxes.map((inbox) => (
                  <div key={inbox.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{inbox.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {inbox.messageCount || 0} messages
                      </p>
                    </div>
                    <Link href={`/inbox/${inbox.id}/share`}>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link href="/inbox/create">
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Inbox
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}