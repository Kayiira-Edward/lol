import MessageForm from "@/components/MessageForm";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    username: string;
  };
}

export default function AskPage({ params }: PageProps) {
  const { username } = params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">LOL</span>
            </div>
          </Link>
          <Link href="/auth">
            <Button variant="ghost">Create Your Own</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Send <GradientText>@{username}</GradientText> an anonymous message
            </h1>
            <p className="text-xl text-muted-foreground">
              Your identity is protected. Say what's on your mind.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-accent" />
              <span>100% Anonymous & Encrypted</span>
            </div>
          </div>

          <div className="animate-scale-in">
            <MessageForm username={username} />
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Your Privacy Matters
            </h3>
            <p className="text-sm text-muted-foreground">
              LOL uses advanced AI moderation to filter harmful content. All messages are encrypted and anonymous. 
              We never collect sender information like IP addresses or device data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Send @${params.username} an anonymous message | LOL`,
    description: `Send an anonymous message to @${params.username}. Completely private and secure.`,
  };
}
