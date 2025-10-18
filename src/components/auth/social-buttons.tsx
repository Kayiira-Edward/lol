// src/components/auth/social-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";

interface SocialButtonsProps {
  onGoogleSignIn: () => void;
  loading: boolean;
}

export function SocialButtons({ onGoogleSignIn, loading }: SocialButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={onGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="flex items-center justify-center w-full gap-3 py-3 font-medium text-gray-700 transition-all duration-300 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-xl disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Chrome className="w-5 h-5" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}