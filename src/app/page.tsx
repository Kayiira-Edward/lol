import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { MessageCircle, Shield, Sparkles, Users, ArrowRight, Lock, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import heroBg from "@/assets/hero-bg.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LOL</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-slide-up">
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
                Anonymous Questions,{" "}
                <GradientText>Authentically Fun</GradientText> Answers
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Share your LOL inbox and get authentic anonymous questions. Safe, fun, and rewarding.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow">
                    Create Your Inbox
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span>AI Moderated</span>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl animate-glow" />
              <Image
                src={heroBg}
                alt="LOL App Preview"
                className="relative border shadow-2xl rounded-3xl border-border/50"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-card/50">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-16 text-center animate-fade-in">
            <h2 className="mb-4 text-4xl font-bold">
              Why Choose <GradientText>LOL</GradientText>?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              We're redefining anonymous Q&A with safety, authenticity, and real value
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "True Anonymity",
                description: "Zero sender data collection. End-to-end encrypted routing for complete privacy.",
                color: "text-primary"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Safety",
                description: "Smart moderation that understands context, not just keywords. Stay protected.",
                color: "text-accent"
              },
              {
                icon: Heart,
                title: "Positive Vibes",
                description: "Karma system rewards kindness. Gamification that encourages great conversations.",
                color: "text-pink-500"
              },
              {
                icon: MessageCircle,
                title: "Multiple Inbox Types",
                description: "Q&A, Confessions, Roast Me, Feedback, and more. Choose your vibe.",
                color: "text-purple-500"
              },
              {
                icon: Users,
                title: "Creator Friendly",
                description: "Advanced analytics, bulk management, and tools built for influencers.",
                color: "text-cyan-500"
              },
              {
                icon: Lock,
                title: "Your Safety First",
                description: "Granular filters, panic button, time-based controls. You're in charge.",
                color: "text-emerald-500"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="container max-w-4xl mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-accent/10 border-border/50 animate-scale-in">
            <h2 className="mb-4 text-4xl font-bold">
              Ready to <GradientText>Live Out Loud</GradientText>?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-muted-foreground">
              Join thousands creating authentic connections through anonymous questions
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow">
                Start Your LOL Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">LOL</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 LOL. Anonymous questions, authentically fun answers.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
              <a href="#" className="transition-colors hover:text-foreground">Terms</a>
              <a href="#" className="transition-colors hover:text-foreground">Safety</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
