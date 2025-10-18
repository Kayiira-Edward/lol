// src/components/genz/emoji-keyboard.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, X } from "lucide-react";

interface EmojiKeyboardProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  "Smileys & People": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  "Love & Romance": ["🥰", "😍", "😘", "😗", "😙", "😚", "💋", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💌"],
  "Funny & Silly": ["😂", "🤣", "😜", "😝", "😛", "🤑", "🤗", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😈", "👿", "👹", "👺"],
  "Questions & Thinking": ["🤔", "💭", "💡", "❓", "❔", "⁉️", "❗", "❕", "🔍", "🔎", "🧠", "👀", "👁️", "👅", "👂", "👃"],
  "Gen Z Vibes": ["✨", "🌟", "💫", "⭐", "🔥", "💯", "🫡", "🫣", "🫠", "🫢", "🫥", "👀", "🙈", "🙉", "🙊", "💀", "☠️", "😭", "🥹", "🫶"]
};

export function EmojiKeyboard({ onEmojiSelect, onClose }: EmojiKeyboardProps) {
  const [activeCategory, setActiveCategory] = useState("Smileys & People");

  return (
    <Card className="w-full max-w-md border-2 border-purple-200 shadow-2xl bg-white/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-800">Add Emoji</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 p-2 overflow-x-auto border-b border-gray-200">
        {Object.keys(emojiCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-4 overflow-y-auto max-h-64">
        <div className="grid grid-cols-8 gap-2">
          {emojiCategories[activeCategory].map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="flex items-center justify-center w-10 h-10 text-2xl transition-colors duration-200 transform rounded-lg hover:bg-purple-100 hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
        <p className="text-xs text-center text-gray-600">
          Click an emoji to add it to your message ✨
        </p>
      </div>
    </Card>
  );
}