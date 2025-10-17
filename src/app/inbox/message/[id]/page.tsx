// src/app/inbox/message/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { 
  MessageCircle, 
  ArrowLeft, 
  Send, 
  Share2, 
  Eye, 
  Clock,
  Heart,
  ThumbsUp,
  Laugh,
  Zap,
  Brain
} from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function MessageDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const messageId = params.id as string;
  
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('reply');

  useEffect(() => {
    if (!user || !messageId) return;

    // Listen to message
    const messageRef = doc(db, 'messages', messageId);
    const unsubscribeMessage = onSnapshot(messageRef, (doc) => {
      if (doc.exists()) {
        const messageData = { id: doc.id, ...doc.data() };
        setMessage(messageData);
        
        // Mark as read if not already
        if (!messageData.isRead) {
          updateDoc(messageRef, { isRead: true });
        }
      }
    });

    // Listen to replies
    const repliesQuery = collection(db, 'replies');
    const repliesQueryFiltered = query(
      repliesQuery, 
      where('messageId', '==', messageId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeReplies = onSnapshot(repliesQueryFiltered, (snapshot) => {
      const repliesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReplies(repliesData);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeReplies();
    };
  }, [user, messageId]);

  const sendReply = async () => {
    if (!reply.trim() || !message || sending) return;

    setSending(true);
    try {
      const replyData = {
        messageId: messageId,
        inboxId: message.inboxId,
        content: reply.trim(),
        isPublic: true,
        postedToStory: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'replies'), replyData);
      
      // Update message with reply count
      await updateDoc(doc(db, 'messages', messageId), {
        hasReplies: true,
        updatedAt: serverTimestamp(),
      });

      setReply('');
      setActiveTab('preview');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const postToStory = async (replyContent: string) => {
    try {
      // In a real app, you'd integrate with Instagram API
      // For now, we'll simulate it
      const storyReplyData = {
        messageId: messageId,
        inboxId: message.inboxId,
        content: replyContent,
        isPublic: true,
        postedToStory: true,
        storyPostedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'replies'), storyReplyData);
      
      // Update analytics
      await updateDoc(doc(db, 'messages', messageId), {
        postedToStory: true,
        updatedAt: serverTimestamp(),
      });

      alert('Posted to your story! (Simulated)');
    } catch (error) {
      console.error('Error posting to story:', error);
    }
  };

  const addReaction = async (reactionType: string) => {
    if (!message) return;

    try {
      const currentReactions = message.reactions || [];
      const existingReactionIndex = currentReactions.findIndex(r => r.type === reactionType);
      
      let newReactions;
      if (existingReactionIndex > -1) {
        newReactions = [...currentReactions];
        newReactions[existingReactionIndex].count += 1;
      } else {
        newReactions = [...currentReactions, { type: reactionType, count: 1 }];
      }

      await updateDoc(doc(db, 'messages', messageId), {
        reactions: newReactions,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  if (!message) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p>Loading message...</p>
        </div>
      </div>
    );
  }

  const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    laugh: Laugh,
    fire: Zap,
    think: Brain
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg border-border">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Button variant="ghost" onClick={() => router.push('/inbox')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inbox
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Message</span>
          </div>
          <div></div>
        </div>
      </nav>

      <div className="container max-w-4xl px-6 pt-32 pb-20 mx-auto">
        {/* Original Message */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                message.vibe === 'question' ? 'bg-blue-100 text-blue-800' :
                message.vibe === 'compliment' ? 'bg-pink-100 text-pink-800' :
                message.vibe === 'confession' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {message.vibe}
              </span>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {message.createdAt?.toDate ? 
                    new Date(message.createdAt.toDate()).toLocaleString() : 
                    'Recently'
                  }
                </span>
                <Eye className="w-4 h-4 ml-2" />
                <span>Anonymous</span>
              </div>
            </div>
            
            {/* Risk Indicator */}
            {message.riskLevel === 'high' && (
              <div className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                ⚠️ Review Needed
              </div>
            )}
          </div>

          <p className="mb-6 text-lg whitespace-pre-wrap">{message.content}</p>

          {/* Reactions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">React:</span>
            {Object.entries(reactionIcons).map(([type, Icon]) => (
              <button
                key={type}
                onClick={() => addReaction(type)}
                className="flex items-center gap-1 p-2 transition-colors rounded-lg hover:bg-muted"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">
                  {message.reactions?.find(r => r.type === type)?.count || 0}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Reply Interface */}
        <Card className="p-6">
          <div className="flex mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('reply')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'reply' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              Write Reply
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'preview' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              Previous Replies ({replies.length})
            </button>
          </div>

          {activeTab === 'reply' ? (
            <div className="space-y-4">
              <div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your response to this anonymous message..."
                  className="w-full h-32 p-4 border rounded-lg resize-none border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    {reply.length}/1000 characters
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => postToStory(reply)}
                      disabled={!reply.trim()}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Post to Story
                    </Button>
                    <Button
                      onClick={sendReply}
                      disabled={!reply.trim() || sending}
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      {sending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <>
                          Post Reply
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Responses */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                  Quick Responses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Thanks for sharing! 💫",
                    "That's really interesting!",
                    "I appreciate your honesty 🙏",
                    "Great question! Let me think about that...",
                    "Haha, that's awesome! 😂"
                  ].map((quickReply) => (
                    <button
                      key={quickReply}
                      onClick={() => setReply(quickReply)}
                      className="px-3 py-2 text-sm transition-colors border rounded-lg border-border hover:bg-muted"
                    >
                      {quickReply}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Previous Replies */
            <div className="space-y-4">
              {replies.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No replies yet. Be the first to respond!</p>
                </div>
              ) : (
                replies.map((replyItem) => (
                  <div key={replyItem.id} className="p-4 border rounded-lg border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <span>You</span>
                      <span>•</span>
                      <span>
                        {replyItem.createdAt?.toDate ? 
                          new Date(replyItem.createdAt.toDate()).toLocaleString() : 
                          'Recently'
                        }
                      </span>
                      {replyItem.postedToStory && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                          <Share2 className="w-3 h-3" />
                          Story
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{replyItem.content}</p>
                    
                    {replyItem.postedToStory && (
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {replyItem.storyViews || 0} story views
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}