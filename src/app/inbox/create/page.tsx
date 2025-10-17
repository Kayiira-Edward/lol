// src/app/inbox/create/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Users, Heart, Zap, Share2, ArrowLeft } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function CreateInboxPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');

  const inboxTypes = [
    {
      id: 'qa',
      title: 'Q&A Session',
      description: 'Answer questions from your audience',
      icon: MessageCircle,
      color: 'text-blue-500',
      prompt: 'Ask me anything!'
    },
    {
      id: 'confessions',
      title: 'Confessions',
      description: 'Receive anonymous secrets and stories',
      icon: Heart,
      color: 'text-pink-500',
      prompt: 'Share your confessions with me...'
    },
    {
      id: 'roast',
      title: 'Roast Me',
      description: 'Playful teasing and funny comments',
      icon: Zap,
      color: 'text-orange-500',
      prompt: 'Roast me (be nice!) 🔥'
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Get constructive criticism and suggestions',
      icon: Users,
      color: 'text-green-500',
      prompt: 'Give me your honest feedback'
    }
  ];

  const createInbox = async () => {
    if (!selectedType || !user) return;

    try {
      const inboxData = {
        userId: user.uid,
        type: selectedType,
        name: inboxTypes.find(t => t.id === selectedType)?.title + ' Inbox',
        shareLink: `${profile?.username}-${selectedType}-${Date.now()}`,
        prompt: inboxTypes.find(t => t.id === selectedType)?.prompt,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messageCount: 0,
        settings: {
          allowAnonymous: true,
          moderateContent: true,
          public: true
        }
      };

      // Create inbox in Firestore
      const inboxRef = await addDoc(collection(db, 'inboxes'), inboxData);
      
      // Update user's inbox count
      await setDoc(doc(db, 'users', user.uid), {
        inboxCount: (profile?.inboxCount || 0) + 1,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Redirect to share page
      router.push(`/inbox/${inboxRef.id}/share`);
    } catch (error) {
      console.error('Error creating inbox:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Create Inbox</span>
          </div>
          <div></div>
        </div>
      </nav>

      <div className="container max-w-4xl px-6 pt-32 pb-20 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Choose Your <GradientText>Inbox Vibe</GradientText>
          </h1>
          <p className="text-xl text-muted-foreground">
            What kind of messages do you want to receive?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {inboxTypes.map((type) => (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all border-2 ${
                selectedType === type.id 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${type.color.split('-')[1]}/20 to-${type.color.split('-')[1]}/5 flex items-center justify-center mb-4`}>
                <type.icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{type.title}</h3>
              <p className="mb-4 text-muted-foreground">{type.description}</p>
              <div className="text-sm font-medium text-primary">
                "{type.prompt}"
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            onClick={createInbox}
            disabled={!selectedType}
            size="lg" 
            className="px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Create Inbox & Get Link
          </Button>
        </div>
      </div>
    </div>
  );
}