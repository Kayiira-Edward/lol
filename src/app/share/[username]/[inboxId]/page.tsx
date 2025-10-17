// src/app/share/[username]/[inboxId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Send, Sparkles, Users, ArrowRight, Star } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/use-auth';

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showGetInbox, setShowGetInbox] = useState(false);
  const [inboxOwner, setInboxOwner] = useState(null);

  const username = params.username as string;
  const inboxId = params.inboxId as string;

  useEffect(() => {
    // Get inbox owner info for personalization
    const getInboxInfo = async () => {
      try {
        const inboxDoc = await getDoc(doc(db, 'inboxes', inboxId));
        if (inboxDoc.exists()) {
          const inboxData = inboxDoc.data();
          const userDoc = await getDoc(doc(db, 'users', inboxData.userId));
          if (userDoc.exists()) {
            setInboxOwner(userDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching inbox info:', error);
      }
    };

    getInboxInfo();
  }, [inboxId]);

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      // Create anonymous message
      await addDoc(collection(db, 'messages'), {
        inboxId: inboxId,
        content: message.trim(),
        vibe: 'question',
        status: 'pending',
        riskLevel: 'low',
        toneScore: 0.5,
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // Increment message count for analytics
      await updateDoc(doc(db, 'inboxes', inboxId), {
        messageCount: increment(1),
        lastMessageAt: serverTimestamp(),
      });

      setSent(true);
      setMessage('');
      
      // Show get inbox CTA after a short delay
      setTimeout(() => {
        setShowGetInbox(true);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const createAccountAndInbox = () => {
    // Redirect to signup with referral context
    router.push(`/auth?mode=signup&ref=message_sent&refInbox=${inboxId}`);
  };

  if (sent && showGetInbox) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 py-8 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-2xl">
          {/* Success Message */}
          <Card className="p-8 mb-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold">Message Sent! 🎉</h2>
            <p className="mb-2 text-muted-foreground">
              Your anonymous message has been delivered to {inboxOwner?.displayName || username}
            </p>
            <p className="text-sm text-muted-foreground">
              They'll see it in their LOL inbox soon
            </p>
          </Card>

          {/* Get Your Own Inbox CTA */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Get Your <GradientText>Own Inbox</GradientText>
              </h3>
              <p className="mb-4 text-muted-foreground">
                See what people really think about you. Get anonymous messages from friends, fans, and followers.
              </p>
            </div>

            <div className="grid gap-4 mb-6 md:grid-cols-2">
              <div className="p-4 text-center rounded-lg bg-background/50">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h4 className="mb-1 font-semibold">100% Anonymous</h4>
                <p className="text-sm text-muted-foreground">Real honesty from people you know</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-background/50">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h4 className="mb-1 font-semibold">Multiple Inboxes</h4>
                <p className="text-sm text-muted-foreground">Q&A, Confessions, Roasts & more</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button 
                onClick={createAccountAndInbox}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Create Free Inbox
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => setShowGetInbox(false)}
                variant="outline"
                size="lg"
              >
                Send Another Message
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Join thousands already getting authentic anonymous messages
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-background to-secondary/30">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold">Message Sent!</h2>
          <p className="mb-6 text-muted-foreground">
            Your anonymous message has been delivered to {inboxOwner?.displayName || username}
          </p>
          <div className="animate-pulse">
            <p className="mb-4 text-sm text-primary">
              Getting your own inbox ready...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md">
        {/* Header with subtle CTA */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LOL</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Send anonymous messages • Get your own inbox free
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold">
              Message <GradientText>{inboxOwner?.displayName || username}</GradientText>
            </h1>
            <p className="text-muted-foreground">
              They'll never know it was you
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you never say to their face?..."
                className="w-full h-32 p-4 border rounded-lg resize-none border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {message.length}/500
                </span>
                {!user && (
                  <span className="text-xs text-primary">
                    No account needed ✓
                  </span>
                )}
              </div>
            </div>

            <Button 
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
            >
              {sending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Sending...
                </div>
              ) : (
                <>
                  Send Anonymously
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Subtle CTA for non-users */}
          {!user && (
            <div className="p-4 mt-6 border rounded-lg bg-muted/30 border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium">
                    Get your own anonymous inbox
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Free • 2-minute setup • See what people really think
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/auth?mode=signup')}
                  variant="outline" 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Try Free
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 mt-6 border-t border-border/50">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>No Registration</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom CTA for mobile */}
        {!user && (
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-lg border-border md:hidden">
            <Button 
              onClick={() => router.push('/auth?mode=signup')}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get My Free Inbox
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}