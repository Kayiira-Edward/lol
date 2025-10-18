// src/app/inbox/[id]/share/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { Share2, Copy, Check, Instagram, MessageCircle, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function ShareInboxPage() {
  const { user, profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const inboxId = params.id as string;
  const shareUrl = `${window.location.origin}/share/${profile?.username}/${inboxId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToInstagram = () => {
    const text = `Send me anonymous messages! ${shareUrl}`;
    const url = `https://www.instagram.com/stories/create/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Button variant="ghost" onClick={() => router.push('/inbox')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inbox
          </Button>
          <div className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Share Your Inbox</span>
          </div>
          <div></div>
        </div>
      </nav>

      <div className="container max-w-2xl px-6 pt-32 pb-20 mx-auto">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            Your Inbox is <GradientText>Ready!</GradientText>
          </h1>
          <p className="text-xl text-muted-foreground">
            Share this link to start receiving anonymous messages
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 p-4 font-mono text-sm break-all rounded-lg bg-muted">
              {shareUrl}
            </div>
            <Button onClick={copyToClipboard} className="whitespace-nowrap">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button onClick={shareToInstagram} size="lg" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
              <Instagram className="w-5 h-5 mr-2" />
              Share to Instagram
            </Button>
            <Button 
              onClick={() => router.push('/inbox')}
              size="lg" 
              variant="outline" 
              className="w-full"
            >
              View Messages
            </Button>
          </div>
        </Card>

        <div className="text-center text-muted-foreground">
          <p>You'll see messages appear in your main inbox as people start sending them</p>
        </div>
      </div>
    </div>
  );
}