// src/app/onboarding/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Users, Heart, Zap, ArrowRight } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function OnboardingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('personal');

  const completeOnboarding = async () => {
    if (!user) return;
    
    // Update user profile with onboarding completion
    await setDoc(doc(db, 'users', user.uid), {
      onboardingCompleted: true,
      accountType: selectedType,
      updatedAt: new Date()
    }, { merge: true });
    
    router.push('/inbox');
  };

  const accountTypes = [
    {
      id: 'personal',
      title: 'Personal',
      description: 'Connect with friends and share anonymously',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 'creator',
      title: 'Content Creator',
      description: 'Engage with your audience and fans',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      id: 'professional',
      title: 'Professional',
      description: 'Get feedback from colleagues and teams',
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            Welcome to <GradientText>LOL</GradientText>, {profile?.displayName}!
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Let's set up your account. How do you plan to use LOL?
          </p>
        </div>

        <div className="grid gap-6 mb-12 md:grid-cols-3">
          {accountTypes.map((type) => (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all border-2 ${
                selectedType === type.id 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${type.color}/20 to-${type.color}/5 flex items-center justify-center mb-4`}>
                <type.icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{type.title}</h3>
              <p className="text-muted-foreground">{type.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={completeOnboarding}
            size="lg" 
            className="px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Continue to Your Inbox
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}