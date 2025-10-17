"use client";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText = ({ children, className }: GradientTextProps) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent font-bold",
        className
      )}
    >
      {children}
    </span>
  );
};
