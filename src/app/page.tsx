// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Sparkles, Users, Zap, Crown, ArrowRight, Star, Heart, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Anonymous",
      description: "Send and receive messages completely anonymously. No one will ever know it's you!",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Gen Z Vibe",
      description: "Built for today's generation with emojis, vibes, and authentic conversations",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant & Fun",
      description: "Get real-time messages from friends, crushes, and secret admirers",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Upgrade Anywhere",
      description: "Start free, upgrade to premium for unlimited messaging anytime",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const testimonials = [
    {
      name: "Alex 🎮",
      message: "Found out my crush lowkey liked me back! This app is fire! 🔥",
      vibe: "love"
    },
    {
      name: "Taylor 💫",
      message: "The anonymous roasts had me crying laughing 😂 Best app ever!",
      vibe: "silly"
    },
    {
      name: "Jordan 🙏",
      message: "Got some really deep and meaningful messages that made my day ✨",
      vibe: "deep"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Messages Sent" },
    { number: "95%", label: "Gen Z Users" },
    { number: "24/7", label: "Fun Times" }
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading LOL experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                LOL
              </span>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/inbox">
                  <Button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Go to Inbox 🎉
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-2 border-gray-300 hover:border-purple-300">
                        Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="px-4 pt-20 pb-16 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          {/* Animated Background Elements */}
          <div className="absolute w-20 h-20 bg-purple-200 rounded-full top-10 left-10 mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          <div className="absolute w-24 h-24 delay-75 bg-pink-200 rounded-full top-40 right-10 mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          <div className="absolute w-16 h-16 delay-150 bg-blue-200 rounded-full bottom-20 left-20 mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-purple-200 rounded-full bg-white/80 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">The #1 Gen Z Anonymous Messaging App</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl">
              Discover What
              <br />
              <GradientText>They Really Think</GradientText>
            </h1>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-gray-600 sm:text-2xl">
              Get honest, anonymous messages from friends, crushes, and secret admirers. 
              <span className="font-semibold text-purple-600"> 100% free to start!</span> 🚀
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
              {user ? (
                <Link href="/inbox" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-8 py-6 text-lg text-white transition-all duration-300 shadow-2xl sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl hover:shadow-3xl">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Go to Your Inbox
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full px-8 py-6 text-lg text-white transition-all duration-300 shadow-2xl sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl hover:shadow-3xl">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Free Today
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full px-8 py-6 text-lg text-gray-700 border-2 border-gray-300 sm:w-auto hover:border-purple-300 rounded-2xl backdrop-blur-sm">
                      Sign In to Account
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid max-w-2xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why <GradientText>LOL</GradientText> is Different
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Built specifically for Gen Z with features that actually matter
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 transition-all duration-300 border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl group hover:scale-105">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              How <GradientText>LOL</GradientText> Works
            </h2>
            <p className="text-xl text-gray-600">Get started in just 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 mx-auto text-2xl font-bold text-white transition-transform duration-300 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110">
                  1
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">Create Your Profile</h3>
              <p className="text-lg text-gray-600">
                Sign up in seconds with your favorite username. No personal info needed!
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 mx-auto text-2xl font-bold text-white transition-transform duration-300 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110">
                  2
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">Share Your Link</h3>
              <p className="text-lg text-gray-600">
                Share your unique LOL link on Instagram, TikTok, WhatsApp - everywhere!
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 mx-auto text-2xl font-bold text-white transition-transform duration-300 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110">
                  3
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">Receive Messages</h3>
              <p className="text-lg text-gray-600">
                Get anonymous messages and discover what people really think about you! 🔥
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What <GradientText>Gen Z Says</GradientText>
            </h2>
            <p className="text-xl text-gray-600">Real messages from real users</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 transition-all duration-300 border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 text-sm text-white rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    {testimonial.vibe === 'love' ? '💘' : testimonial.vibe === 'silly' ? '🤪' : '✨'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-gray-700">"{testimonial.message}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Simple, <GradientText>Fair Pricing</GradientText>
            </h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're hooked</p>
          </div>

          <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
            {/* Free Plan */}
            <Card className="relative p-8 overflow-hidden border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Free Forever</h3>
                <div className="mb-4 text-4xl font-bold text-gray-900">$0</div>
                
                <ul className="mb-8 space-y-3 text-left">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>5 free messages</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Anonymous messaging</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Gen Z prompts & emojis</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span>Unlimited messages</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span>Priority support</span>
                  </li>
                </ul>

                {user ? (
                  <Link href="/inbox">
                    <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-purple-300">
                      Go to Inbox
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-purple-300">
                      Start Free
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="relative p-8 overflow-hidden text-white transition-all duration-300 transform bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 text-sm font-semibold rounded-full bg-white/20 backdrop-blur-sm">
                  Most Popular ✨
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Premium</h3>
                <div className="mb-4 text-4xl font-bold">$2.99<span className="text-lg font-normal">/month</span></div>
                
                <ul className="mb-8 space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Unlimited messages</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Anonymous messaging</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>All Gen Z features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Priority message delivery</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Exclusive features</span>
                  </li>
                </ul>

                {user ? (
                  <Button className="w-full font-semibold text-purple-600 bg-white border-white hover:bg-gray-100">
                    Upgrade Now 🚀
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button className="w-full font-semibold text-purple-600 bg-white border-white hover:bg-gray-100">
                      Start Free Trial
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-white bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
            Ready to Discover the Truth? 🔥
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl sm:text-2xl opacity-90">
            Join thousands of Gen Z users getting real, anonymous messages today
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link href="/inbox">
                <Button size="lg" className="px-8 py-6 text-lg text-purple-600 bg-white border-white shadow-2xl hover:bg-gray-100 rounded-2xl">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Go to Your Inbox
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="px-8 py-6 text-lg text-purple-600 bg-white border-white shadow-2xl hover:bg-gray-100 rounded-2xl">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg text-white border-2 border-white hover:bg-white/10 rounded-2xl backdrop-blur-sm">
                    Sign In to Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="mt-6 text-sm opacity-80">
            No credit card required • 5 free messages included • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">LOL</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-gray-400 transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="/support" className="text-gray-400 transition-colors hover:text-white">
                Support
              </Link>
              <Link href="/admin" className="text-gray-400 transition-colors hover:text-white">
                Admin
              </Link>
            </div>

            <div className="mt-6 text-center md:mt-0 md:text-right">
              <p className="text-sm text-gray-400">
                Made with <Heart className="inline w-4 h-4 text-red-500" /> for Gen Z
              </p>
              <p className="mt-1 text-xs text-gray-500">© 2024 LOL. All vibes reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}