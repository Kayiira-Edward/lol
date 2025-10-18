// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for generating random gradients
export function getRandomGradient(): string {
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-teal-500 to-green-500"
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

// Utility function for vibe-based gradients
export function getVibeGradient(vibe: string): string {
  const vibeGradients: Record<string, string> = {
    love: "from-pink-500 to-rose-500",
    silly: "from-yellow-400 to-orange-500",
    spicy: "from-red-500 to-pink-500",
    deep: "from-blue-500 to-indigo-500",
    church: "from-emerald-500 to-green-500",
    vibeCheck: "from-purple-500 to-violet-500"
  }
  return vibeGradients[vibe] || "from-purple-500 to-pink-500"
}

// Utility function for formatting numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Utility function for generating initials
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}