// src/app/auth/signup/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-20">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LOL</span>
          </Link>
          <Link href="/auth?mode=login">
            <Button variant="ghost">Log In</Button>
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-md animate-scale-in">
        <Card className="p-8 shadow-2xl bg-card/80 backdrop-blur-sm border-border/50">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold">Join LOL</h1>
            <p className="text-muted-foreground">Create your account to get started</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border rounded-lg border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-lg border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Create a password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth?mode=login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}