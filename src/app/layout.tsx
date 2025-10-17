import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LOL - Live Out Loud | Anonymous Questions Platform",
  description: "Anonymous questions, authentically fun answers. Share your LOL inbox and get authentic anonymous questions. Safe, fun, and rewarding.",
  keywords: ["anonymous", "questions", "Q&A", "social", "messaging", "LOL"],
  authors: [{ name: "LOL Team" }],
  openGraph: {
    title: "LOL - Live Out Loud",
    description: "Anonymous questions, authentically fun answers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </body>
    </html>
  );
}
