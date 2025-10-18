// src/components/genz/vibe-selector.tsx
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Heart, Laugh, Flame, Brain, Church } from "lucide-react";
import { vibeThemes } from '@/lib/utils/genz-prompts';

interface VibeSelectorProps {
  onVibeSelect: (vibe: string) => void;
  selectedVibe?: string;
  compact?: boolean;
  showPreview?: boolean;
}

export function VibeSelector({ 
  onVibeSelect, 
  selectedVibe = 'vibeCheck',
  compact = false,
  showPreview = true 
}: VibeSelectorProps) {
  const [hoveredVibe, setHoveredVibe] = useState<string | null>(null);

  const vibeIcons = {
    love: <Heart className="w-5 h-5" />,
    silly: <Laugh className="w-5 h-5" />,
    spicy: <Flame className="w-5 h-5" />,
    deep: <Brain className="w-5 h-5" />,
    church: <Church className="w-5 h-5" />,
    vibeCheck: <Zap className="w-5 h-5" />
  };

  const vibeDescriptions = {
    love: "Crush confessions, compliments, and romantic questions 💘",
    silly: "Funny roasts, jokes, and lighthearted banter 😂",
    spicy: "Bold questions, flirty vibes, and daring confessions 🌶️",
    deep: "Meaningful conversations and thought-provoking questions 💭",
    church: "Faith-based questions and spiritual conversations 🙏",
    vibeCheck: "General vibes, first impressions, and casual questions ✨"
  };

  const getVibeGradient = (vibe: string, isHovered: boolean = false) => {
    const theme = vibeThemes[vibe as keyof typeof vibeThemes];
    if (!theme) return 'from-gray-500 to-gray-700';
    
    if (isHovered) {
      return theme.gradient.replace('500', '600').replace('400', '500');
    }
    return theme.gradient;
  };

  const getVibeBgColor = (vibe: string) => {
    const theme = vibeThemes[vibe as keyof typeof vibeThemes];
    return theme?.bgColor || 'bg-gray-100';
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Choose Vibe:</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(vibeThemes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onVibeSelect(key)}
              onMouseEnter={() => setHoveredVibe(key)}
              onMouseLeave={() => setHoveredVibe(null)}
              className={`p-2 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedVibe === key
                  ? `border-${theme.border.split('-')[1]}-500 bg-${theme.border.split('-')[1]}-50 shadow-sm`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{theme.emoji}</span>
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {theme.name.split(' ')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {showPreview && selectedVibe && (
          <div className={`p-3 rounded-lg border-2 ${getVibeBgColor(selectedVibe)} border-${vibeThemes[selectedVibe as keyof typeof vibeThemes]?.border.split('-')[1]}-300`}>
            <p className="text-sm text-center text-gray-700">
              {vibeDescriptions[selectedVibe as keyof typeof vibeDescriptions]}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Choose Your Vibe</h3>
        </div>
        <p className="text-sm text-gray-600">
          Select a vibe to get matching prompt suggestions
        </p>
      </div>

      {/* Vibe Selection Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Object.entries(vibeThemes).map(([key, theme]) => (
          <Card 
            key={key}
            className={`
              p-4 cursor-pointer transition-all duration-500 transform hover:scale-105 border-2
              ${selectedVibe === key 
                ? `border-${theme.border.split('-')[1]}-500 shadow-lg scale-105` 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${getVibeBgColor(key)}
              relative overflow-hidden group
            `}
            onClick={() => onVibeSelect(key)}
            onMouseEnter={() => setHoveredVibe(key)}
            onMouseLeave={() => setHoveredVibe(null)}
          >
            {/* Animated Background Gradient */}
            <div 
              className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-br ${getVibeGradient(key, true)}
              `}
            />
            
            <div className="relative z-10">
              {/* Vibe Icon and Emoji */}
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-white
                  bg-gradient-to-br ${getVibeGradient(key)}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {vibeIcons[key as keyof typeof vibeIcons]}
                </div>
                <span className="text-2xl">{theme.emoji}</span>
              </div>

              {/* Vibe Name */}
              <h4 className={`
                font-semibold mb-2 transition-colors duration-300
                ${selectedVibe === key 
                  ? `text-${theme.border.split('-')[1]}-700` 
                  : 'text-gray-800 group-hover:text-white'
                }
              `}>
                {theme.name}
              </h4>

              {/* Description */}
              <p className={`
                text-xs transition-colors duration-300 line-clamp-2
                ${selectedVibe === key 
                  ? `text-${theme.border.split('-')[1]}-600` 
                  : 'text-gray-600 group-hover:text-white/90'
                }
              `}>
                {vibeDescriptions[key as keyof typeof vibeDescriptions]}
              </p>

              {/* Selection Indicator */}
              {selectedVibe === key && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {/* Hover Effect */}
            <div 
              className={`
                absolute inset-0 rounded-lg transition-all duration-300
                ${hoveredVibe === key ? 'bg-black/5' : 'bg-transparent'}
              `}
            />
          </Card>
        ))}
      </div>

      {/* Selected Vibe Preview */}
      {showPreview && selectedVibe && (
        <Card className={`
          p-4 border-2 transition-all duration-500
          ${getVibeBgColor(selectedVibe)}
          border-${vibeThemes[selectedVibe as keyof typeof vibeThemes]?.border.split('-')[1]}-300
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg
              bg-gradient-to-br ${getVibeGradient(selectedVibe)}
            `}>
              {vibeThemes[selectedVibe as keyof typeof vibeThemes]?.emoji}
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-gray-800">
                {vibeThemes[selectedVibe as keyof typeof vibeThemes]?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {vibeDescriptions[selectedVibe as keyof typeof vibeDescriptions]}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-lg font-bold text-purple-600">64%</div>
          <div className="text-xs text-gray-600">Love & Spicy</div>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-lg font-bold text-blue-600">23%</div>
          <div className="text-xs text-gray-600">Silly & Fun</div>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-lg font-bold text-green-600">13%</div>
          <div className="text-xs text-gray-600">Deep & Church</div>
        </div>
      </div>

      {/* Vibe Tips */}
      <Card className="p-4 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="mb-1 text-sm font-semibold text-purple-800">
              Vibe Selection Tips
            </h4>
            <ul className="space-y-1 text-xs text-purple-700">
              <li>• <strong>Love & Spicy</strong> are most popular for crushes</li>
              <li>• <strong>Silly & Fun</strong> work great with friends</li>
              <li>• <strong>Deep & Church</strong> create meaningful conversations</li>
              <li>• You can change vibes anytime! ✨</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Enhanced vibe themes with better color consistency
export const enhancedVibeThemes = {
  love: {
    name: "Love & Crushes 💘",
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-500/10 to-rose-500/10",
    border: "border-pink-300",
    emoji: "💘",
    color: "pink"
  },
  silly: {
    name: "Silly & Fun 🤪",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-400/10 to-orange-500/10",
    border: "border-yellow-300",
    emoji: "🤪",
    color: "yellow"
  },
  spicy: {
    name: "Spicy & Bold 🌶️",
    gradient: "from-red-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-red-500/10 to-pink-500/10",
    border: "border-red-300",
    emoji: "🌶️",
    color: "red"
  },
  deep: {
    name: "Deep & Real 💭",
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    border: "border-blue-300",
    emoji: "💭",
    color: "blue"
  },
  church: {
    name: "Church & Faith ⛪",
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
    border: "border-emerald-300",
    emoji: "⛪",
    color: "emerald"
  },
  vibeCheck: {
    name: "Vibe Check ✨",
    gradient: "from-purple-500 to-violet-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
    border: "border-purple-300",
    emoji: "✨",
    color: "purple"
  }
};

// Mobile-optimized horizontal scroller version
export function VibeSelectorHorizontal({ 
  onVibeSelect, 
  selectedVibe = 'vibeCheck' 
}: {
  onVibeSelect: (vibe: string) => void;
  selectedVibe?: string;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 px-1 mb-3">
        <Sparkles className="flex-shrink-0 w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Choose Vibe:
        </span>
      </div>
      
      <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
        {Object.entries(enhancedVibeThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onVibeSelect(key)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300
              flex-shrink-0 whitespace-nowrap transform hover:scale-105
              ${selectedVibe === key
                ? `border-${theme.color}-500 bg-${theme.color}-50 shadow-sm`
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <span className="text-lg">{theme.emoji}</span>
            <span className="text-sm font-medium text-gray-700">
              {theme.name.split(' ')[0]}
            </span>
            {selectedVibe === key && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}