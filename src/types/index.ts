// src/types/index.ts

// User and Authentication Types
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: {
      creationTime?: string;
      lastSignInTime?: string;
    };
  }
  
  export interface UserProfile {
    uid: string;
    username: string;
    displayName: string;
    email: string;
    photoURL?: string;
    emailVerified: boolean;
    karma: number;
    subscription: Subscription;
    limits: UserLimits;
    inboxCount: number;
    totalMessages: number;
    referralCount: number;
    createdAt: Date;
    updatedAt: Date;
    preferences?: UserPreferences;
    stats?: UserStats;
  }
  
  export interface Subscription {
    tier: 'free' | 'premium';
    status: 'active' | 'inactive' | 'cancelled' | 'trial';
    since?: Date;
    expiresAt?: Date;
    paymentMethod?: string;
  }
  
  export interface UserLimits {
    freeMessagesSent: number;
    freeMessagesReceived: number;
    maxFreeMessages: number;
    nextReset: Date;
    lastReset?: Date;
  }
  
  export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      newMessages: boolean;
      messageReplies: boolean;
      marketing: boolean;
      emailDigest: boolean;
    };
    privacy: {
      showOnlineStatus: boolean;
      allowAnonymousMessages: boolean;
      profileVisibility: 'public' | 'friends' | 'private';
    };
    language: string;
    timezone: string;
  }
  
  export interface UserStats {
    totalMessages: number;
    messagesSent: number;
    messagesReceived: number;
    repliesSent: number;
    averageReplyTime: number; // in minutes
    activeDays: number;
    streak: number;
    topVibes: string[];
  }
  
  // Message Types
  export interface BaseMessage {
    id: string;
    senderId: string; // 'anonymous' for anonymous messages
    receiverId: string;
    content: string;
    vibe: VibeType;
    timestamp: Date;
    read: boolean;
    anonymous: boolean;
    parentMessageId?: string; // for replies
  }
  
  export interface AnonymousMessage extends BaseMessage {
    senderId: 'anonymous';
    anonymous: true;
    senderVibe?: VibeType; // vibe of the anonymous sender
  }
  
  export interface IdentifiedMessage extends BaseMessage {
    senderId: string;
    anonymous: false;
    senderProfile?: UserProfile;
  }
  
  export type Message = AnonymousMessage | IdentifiedMessage;
  
  export interface MessageThread {
    id: string;
    participants: string[]; // user IDs
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
    vibe?: VibeType;
  }
  
  export interface CreateMessageData {
    receiverId: string;
    content: string;
    vibe: VibeType;
    anonymous: boolean;
    parentMessageId?: string;
  }
  
  export interface MessageMetrics {
    totalMessages: number;
    unreadMessages: number;
    messagesToday: number;
    averageResponseTime: number;
    topSenders: Array<{
      userId: string;
      count: number;
      lastMessage: Date;
    }>;
  }
  
  // Vibe System Types
  export type VibeType = 'love' | 'silly' | 'spicy' | 'deep' | 'church' | 'vibeCheck';
  
  export interface VibeTheme {
    name: string;
    gradient: string;
    bgColor: string;
    border: string;
    emoji: string;
    color: string;
  }
  
  export interface VibeStats {
    vibe: VibeType;
    count: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }
  
  // UI Component Types
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    loading?: boolean;
    fullWidth?: boolean;
  }
  
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'success' | 'error' | 'warning' | 'premium';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
    loading?: boolean;
    status?: 'idle' | 'loading' | 'success' | 'error';
    label?: string;
    helperText?: string;
    containerClassName?: string;
  }
  
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'premium' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
  }
  
  // Form and Validation Types
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }
  
  export interface PasswordStrength {
    score: number; // 0-5
    level: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
    feedback: string[];
    suggestions: string[];
  }
  
  // Auth and API Types
  export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: Date;
  }
  
  export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
  
  // Admin and Analytics Types
  export interface AdminStats {
    totalUsers: number;
    totalMessages: number;
    premiumUsers: number;
    activeToday: number;
    freeMessagesUsed: number;
    freeMessagesTotal: number;
    conversionRate: number;
    avgMessagesPerUser: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueGrowth: number;
    userGrowth: number;
    recentActivity: RecentActivity[];
    topUsers: TopUser[];
    messageTrends: MessageTrend[];
  }
  
  export interface RecentActivity {
    id: string;
    type: 'signup' | 'premium' | 'message' | 'reveal' | 'share';
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
    emoji: string;
    metadata?: Record<string, any>;
  }
  
  export interface TopUser {
    userId: string;
    username: string;
    messages: number;
    isPremium: boolean;
    lastActive: Date;
    joinDate: Date;
  }
  
  export interface MessageTrend {
    date: string;
    messages: number;
    signups: number;
    revenue: number;
    activeUsers: number;
  }
  
  // Subscription and Payment Types
  export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    popular?: boolean;
    highlight?: boolean;
  }
  
  export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }
  
  export interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    date: Date;
    description: string;
    receiptUrl?: string;
  }
  
  // Notification Types
  export interface Notification {
    id: string;
    userId: string;
    type: 'message' | 'reply' | 'system' | 'premium' | 'marketing';
    title: string;
    body: string;
    data?: Record<string, any>;
    read: boolean;
    timestamp: Date;
    actionUrl?: string;
    actionText?: string;
  }
  
  // Share and Referral Types
  export interface ShareLink {
    id: string;
    userId: string;
    username: string;
    url: string;
    clicks: number;
    messagesReceived: number;
    createdAt: Date;
    lastClicked?: Date;
  }
  
  export interface Referral {
    id: string;
    referrerId: string;
    referredId: string;
    status: 'pending' | 'completed' | 'expired';
    reward?: string;
    createdAt: Date;
    completedAt?: Date;
  }
  
  // Feature Flag Types
  export interface FeatureFlags {
    enablePremium: boolean;
    enableReferrals: boolean;
    enableAnalytics: boolean;
    enableSocialSharing: boolean;
    enableMessageReplies: boolean;
    enableVibeSystem: boolean;
    maintenanceMode: boolean;
    newFeatures: string[];
  }
  
  // Error Types
  export interface AppError {
    code: string;
    message: string;
    userFriendlyMessage: string;
    timestamp: Date;
    stack?: string;
    context?: Record<string, any>;
  }
  
  export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
  }
  
  // Hook Return Types
  export interface UseAuthReturn extends AuthState {
    signUp: (email: string, password: string, username: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  }
  
  export interface UseMessageLimitsReturn {
    limits: UserLimits;
    showUpgradePrompt: boolean;
    setShowUpgradePrompt: (show: boolean) => void;
    incrementMessageCount: () => Promise<void>;
    canSendMessage: () => boolean;
    getUpgradeMessage: () => {
      title: string;
      message: string;
      type: 'warning' | 'urgent' | 'blocked';
    } | null;
  }
  
  export interface UseUsernameReturn {
    username: string;
    setUsername: (username: string) => void;
    status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
    message: string;
    getStatusColor: () => string;
    getStatusIcon: () => React.ReactNode;
    isValid: boolean;
  }
  
  // Event Tracking Types
  export interface AnalyticsEvent {
    name: string;
    userId?: string;
    properties: Record<string, any>;
    timestamp: Date;
  }
  
  export interface UserEvent extends AnalyticsEvent {
    type: 'page_view' | 'button_click' | 'form_submit' | 'message_sent' | 'vibe_selected';
  }
  
  // Settings and Configuration Types
  export interface AppConfig {
    version: string;
    environment: 'development' | 'staging' | 'production';
    features: FeatureFlags;
    limits: {
      maxMessageLength: number;
      maxUsernameLength: number;
      freeMessageLimit: number;
      resetInterval: number; // in days
    };
    urls: {
      terms: string;
      privacy: string;
      support: string;
      contact: string;
    };
  }
  
  // API Request Types
  export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface SignupRequest {
    email: string;
    password: string;
    username: string;
    displayName?: string;
    acceptTerms: boolean;
  }
  
  export interface MessageRequest {
    receiverUsername: string;
    content: string;
    vibe: VibeType;
    anonymous: boolean;
    parentMessageId?: string;
  }
  
  export interface UpdateProfileRequest {
    displayName?: string;
    photoURL?: string;
    preferences?: Partial<UserPreferences>;
  }
  
  // Response Types
  export interface LoginResponse {
    user: User;
    profile: UserProfile;
    token: string;
    expiresIn: number;
  }
  
  export interface MessagesResponse {
    messages: Message[];
    pagination: PaginatedResponse<Message>['pagination'];
  }
  
  // Component Prop Types
  export interface VibeSelectorProps {
    onVibeSelect: (vibe: VibeType) => void;
    selectedVibe?: VibeType;
    compact?: boolean;
    showPreview?: boolean;
  }
  
  export interface EmojiKeyboardProps {
    onEmojiSelect: (emoji: string) => void;
    onClose: () => void;
    position?: 'top' | 'bottom';
  }
  
  export interface PromptSuggestionsProps {
    onPromptSelect: (prompt: string) => void;
    vibe?: VibeType;
    maxSuggestions?: number;
  }
  
  export interface UsernameCheckerProps {
    onUsernameChange: (username: string, isValid: boolean) => void;
    initialUsername?: string;
    className?: string;
  }
  
  // Utility Types
  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
  
  export type ArrayElement<ArrayType extends readonly unknown[]> = 
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
  
  // Theme Types
  export interface Theme {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textMuted: string;
      border: string;
      error: string;
      warning: string;
      success: string;
    };
    gradients: {
      primary: string;
      secondary: string;
      premium: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
  
  // Export all types
  export type {
    // Re-export for convenience
    User as FirebaseUser,
    UserProfile as AppUser,
  };
  
  // Type guards
  export const isAnonymousMessage = (message: Message): message is AnonymousMessage => {
    return message.anonymous === true && message.senderId === 'anonymous';
  };
  
  export const isIdentifiedMessage = (message: Message): message is IdentifiedMessage => {
    return message.anonymous === false && message.senderId !== 'anonymous';
  };
  
  export const isPremiumUser = (profile: UserProfile): boolean => {
    return profile.subscription.tier === 'premium' && profile.subscription.status === 'active';
  };
  
  export const canSendMessage = (profile: UserProfile): boolean => {
    if (isPremiumUser(profile)) return true;
    return profile.limits.freeMessagesSent < profile.limits.maxFreeMessages;
  };
  
  export const getRemainingMessages = (profile: UserProfile): number => {
    if (isPremiumUser(profile)) return Infinity;
    return Math.max(0, profile.limits.maxFreeMessages - profile.limits.freeMessagesSent);
  };
  
  // Default values
  export const DEFAULT_USER_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: {
      newMessages: true,
      messageReplies: true,
      marketing: false,
      emailDigest: true,
    },
    privacy: {
      showOnlineStatus: true,
      allowAnonymousMessages: true,
      profileVisibility: 'public',
    },
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  
  export const DEFAULT_USER_LIMITS: UserLimits = {
    freeMessagesSent: 0,
    freeMessagesReceived: 0,
    maxFreeMessages: 5,
    nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  };
  
  export const VIBE_TYPES: VibeType[] = ['love', 'silly', 'spicy', 'deep', 'church', 'vibeCheck'];