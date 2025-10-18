// src/components/ui/gradient-text.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  gradient?: string;
  animate?: boolean;
  hoverEffect?: boolean;
  shimmer?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  speed?: "slow" | "normal" | "fast";
}

// Pre-defined gradient variants for different use cases
const GradientTextVariants = {
  // Brand gradients
  primary: "from-purple-600 to-pink-600",
  secondary: "from-blue-500 to-cyan-500",
  premium: "from-yellow-400 to-amber-500",
  
  // Vibe-based gradients
  love: "from-pink-500 to-rose-500",
  silly: "from-yellow-400 to-orange-500",
  spicy: "from-red-500 to-pink-500",
  deep: "from-blue-500 to-indigo-500",
  church: "from-emerald-500 to-green-500",
  vibe: "from-purple-500 to-violet-500",
  
  // Status gradients
  success: "from-green-500 to-emerald-500",
  warning: "from-yellow-500 to-orange-500",
  danger: "from-red-500 to-pink-500",
  info: "from-blue-500 to-cyan-500",
  
  // Fun colorful gradients
  rainbow: "from-red-500 via-purple-500 to-blue-500",
  sunset: "from-orange-500 to-pink-500",
  ocean: "from-blue-400 to-cyan-400",
  forest: "from-green-500 to-emerald-600",
  candy: "from-pink-400 to-purple-400",
  neon: "from-cyan-400 to-blue-500"
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ 
    className, 
    gradient = GradientTextVariants.primary, 
    animate = false, 
    hoverEffect = false,
    shimmer = false,
    direction = "horizontal",
    speed = "normal",
    ...props 
  }, ref) => {
    
    const getDirectionClass = () => {
      switch (direction) {
        case "vertical":
          return "bg-gradient-to-b"
        case "diagonal":
          return "bg-gradient-to-br"
        default:
          return "bg-gradient-to-r"
      }
    }

    const getSpeedClass = () => {
      switch (speed) {
        case "slow":
          return "animate-gradient-slow"
        case "fast":
          return "animate-gradient-fast"
        default:
          return "animate-gradient"
      }
    }

    return (
      <span
        ref={ref}
        className={cn(
          "bg-clip-text text-transparent",
          getDirectionClass(),
          gradient,
          animate && getSpeedClass(),
          hoverEffect && "transition-all duration-500 hover:scale-105 hover:brightness-110",
          shimmer && "animate-shimmer bg-200%",
          className
        )}
        {...props}
      />
    )
  }
)
GradientText.displayName = "GradientText"

// Animated gradient text with moving gradient
const AnimatedGradientText = React.forwardRef<HTMLSpanElement, Omit<GradientTextProps, 'animate'>>(
  ({ className, gradient = "from-purple-600 via-pink-600 to-purple-600", speed = "normal", ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={gradient}
        animate={true}
        speed={speed}
        className={cn("bg-300%", className)}
        {...props}
      />
    )
  }
)
AnimatedGradientText.displayName = "AnimatedGradientText"

// Interactive gradient text with hover effects
const InteractiveGradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, gradient = GradientTextVariants.primary, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={gradient}
        hoverEffect={true}
        className={cn("cursor-pointer", className)}
        {...props}
      />
    )
  }
)
InteractiveGradientText.displayName = "InteractiveGradientText"

// Shimmer effect gradient text
const ShimmerGradientText = React.forwardRef<HTMLSpanElement, Omit<GradientTextProps, 'shimmer'>>(
  ({ className, gradient = GradientTextVariants.rainbow, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={gradient}
        shimmer={true}
        className={className}
        {...props}
      />
    )
  }
)
ShimmerGradientText.displayName = "ShimmerGradientText"

// Multi-color animated text
const RainbowGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <AnimatedGradientText
        ref={ref}
        gradient={GradientTextVariants.rainbow}
        speed="slow"
        className={cn("font-bold", className)}
        {...props}
      />
    )
  }
)
RainbowGradientText.displayName = "RainbowGradientText"

// Premium gold text effect
const PremiumGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={GradientTextVariants.premium}
        hoverEffect={true}
        className={cn("font-bold drop-shadow-sm", className)}
        {...props}
      />
    )
  }
)
PremiumGradientText.displayName = "PremiumGradientText"

// Vibe-specific gradient text components
const LoveGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={GradientTextVariants.love}
        className={cn("font-semibold", className)}
        {...props}
      />
    )
  }
)
LoveGradientText.displayName = "LoveGradientText"

const SillyGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={GradientTextVariants.silly}
        className={cn("font-semibold", className)}
        {...props}
      />
    )
  }
)
SillyGradientText.displayName = "SillyGradientText"

const SpicyGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <GradientText
        ref={ref}
        gradient={GradientTextVariants.spicy}
        className={cn("font-semibold", className)}
        {...props}
      />
    )
  }
)
SpicyGradientText.displayName = "SpicyGradientText"

// Glass morphism gradient text
const GlassGradientText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-white/80 to-white/60 bg-clip-text text-transparent backdrop-blur-sm",
          "border border-white/20 rounded-lg px-3 py-1",
          "shadow-lg shadow-black/5",
          className
        )}
        {...props}
      />
    )
  }
)
GlassGradientText.displayName = "GlassGradientText"

// Export all components and variants
export { 
  GradientText,
  AnimatedGradientText,
  InteractiveGradientText,
  ShimmerGradientText,
  RainbowGradientText,
  PremiumGradientText,
  LoveGradientText,
  SillyGradientText,
  SpicyGradientText,
  GlassGradientText,
  GradientTextVariants
}

// CSS animations for the gradient effects
export const GradientTextStyles = `
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes gradient-slow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes gradient-fast {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .animate-gradient {
    animation: gradient 3s ease infinite;
  }

  .animate-gradient-slow {
    animation: gradient 6s ease infinite;
  }

  .animate-gradient-fast {
    animation: gradient 1.5s ease infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite linear;
  }

  .bg-200% {
    background-size: 200% 100%;
  }

  .bg-300% {
    background-size: 300% 100%;
  }
`

// Utility to inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = GradientTextStyles;
  document.head.appendChild(styleSheet);
}