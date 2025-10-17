"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, Heart, Flame, MessageSquare, Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Vibe = "question" | "compliment" | "confession" | "feedback" | "roast";

interface MessageFormProps {
  username: string;
}

export default function MessageForm({ username }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const [vibe, setVibe] = useState<Vibe>("question");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const vibeConfig = {
    question: { icon: MessageCircle, label: "Question", color: "text-blue-500" },
    compliment: { icon: Heart, label: "Compliment", color: "text-pink-500" },
    roast: { icon: Flame, label: "Roast", color: "text-orange-500" },
    confession: { icon: MessageSquare, label: "Confession", color: "text-purple-500" },
    feedback: { icon: Lightbulb, label: "Feedback", color: "text-yellow-500" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientUsername: username,
          content: message,
          vibe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message sent! 🎉",
        description: "Your anonymous message has been delivered.",
      });

      setMessage("");
      setVibe("question");
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block mb-4 text-lg font-semibold">Choose your vibe</Label>
          <RadioGroup value={vibe} onValueChange={(v) => setVibe(v as Vibe)} className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {Object.entries(vibeConfig).map(([key, config]) => (
              <div key={key}>
                <RadioGroupItem value={key} id={key} className="sr-only peer" />
                <Label
                  htmlFor={key}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                >
                  <config.icon className={`w-6 h-6 ${config.color}`} />
                  <span className="text-sm font-medium">{config.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="message" className="block mb-2 text-lg font-semibold">
            Your anonymous message
          </Label>
          <Textarea
            id="message"
            placeholder="Say something anonymously..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] resize-none"
            maxLength={500}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {message.length}/500 characters
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          size="lg"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send Anonymously
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your message is completely anonymous. No personal information is collected.
        </p>
      </form>
    </Card>
  );
}
