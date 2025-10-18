// src/components/genz/prompt-suggestions.tsx
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap } from "lucide-react";
import { genZPrompts, vibeThemes } from '@/lib/utils/genz-prompts';

interface PromptSuggestionsProps {
  onPromptSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onPromptSelect }: PromptSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof genZPrompts>('vibeCheck');

  return (
    <Card className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">Quick Prompts</h3>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 pb-2 mb-4 overflow-x-auto">
        {Object.entries(vibeThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as keyof typeof genZPrompts)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{theme.emoji}</span>
            <span className="hidden sm:inline">{theme.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Prompts List */}
      <div className="space-y-2 overflow-y-auto max-h-96">
        {genZPrompts[activeCategory].map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptSelect(prompt)}
            className="w-full p-3 text-left transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 group"
          >
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{prompt}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="p-3 mt-4 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <p className="text-xs text-center text-gray-600">
          💡 Click any prompt to auto-fill your message
        </p>
      </div>
    </Card>
  );
}