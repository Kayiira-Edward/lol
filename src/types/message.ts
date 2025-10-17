// src/types/message.ts
export interface AnonymousMessage {
    id: string;
    inboxId: string;
    content: string;
    vibe: 'question' | 'compliment' | 'confession' | 'feedback' | 'roast';
    toneScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    status: 'pending' | 'approved' | 'filtered' | 'quarantined';
    isRead: boolean;
    reactions: Reaction[];
    createdAt: any; // Firestore timestamp
    updatedAt?: any;
  }
  
  export interface Reply {
    id: string;
    messageId: string;
    inboxId: string;
    content: string;
    isPublic: boolean;
    postedToStory: boolean;
    storyViews?: number;
    createdAt: any;
    updatedAt?: any;
  }
  
  export interface Reaction {
    type: 'like' | 'love' | 'laugh' | 'fire' | 'think';
    count: number;
  }