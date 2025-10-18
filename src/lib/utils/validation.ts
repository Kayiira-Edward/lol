// src/lib/utils/validation.ts

// Validation patterns
export const VALIDATION_PATTERNS = {
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    displayName: /^[a-zA-Z0-9_ ]{2,30}$/,
    message: /^[\s\S]{1,50}$/, // 1-50 characters including newlines
    url: /^https?:\/\/.+\..+$/,
    emoji: /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu,
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  } as const;
  
  // Reserved usernames that cannot be used
  export const RESERVED_USERNAMES = [
    'admin', 'administrator', 'mod', 'moderator', 'support', 'help', 'contact',
    'official', 'staff', 'team', 'system', 'root', 'owner', 'founder',
    'lol', 'lolapp', 'anonymous', 'anon', 'unknown', 'null', 'undefined',
    'api', 'web', 'app', 'application', 'service', 'bot', 'robot',
    'test', 'demo', 'example', 'sample', 'guest', 'user', 'users',
    'me', 'you', 'your', 'my', 'mine', 'our', 'we', 'us', 'them', 'they',
    'this', 'that', 'those', 'these', 'it', 'its', 'yourself', 'myself',
    'facebook', 'twitter', 'instagram', 'tiktok', 'youtube', 'google',
    'whatsapp', 'telegram', 'discord', 'snapchat', 'reddit', 'linkedin', 'edward',
  ];
  
  // Validation rules
  export const VALIDATION_RULES = {
    username: {
      minLength: 3,
      maxLength: 20,
      pattern: VALIDATION_PATTERNS.username,
      reserved: RESERVED_USERNAMES,
    },
    email: {
      pattern: VALIDATION_PATTERNS.email,
      maxLength: 254,
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    displayName: {
      minLength: 2,
      maxLength: 30,
      pattern: VALIDATION_PATTERNS.displayName,
    },
    message: {
      minLength: 1,
      maxLength: 500,
      pattern: VALIDATION_PATTERNS.message,
    },
    vibe: {
      allowed: ['love', 'silly', 'spicy', 'deep', 'church', 'vibeCheck'] as const,
    }
  } as const;
  
  // Validation error messages
  export const VALIDATION_MESSAGES = {
    username: {
      required: 'Username is required',
      tooShort: `Username must be at least ${VALIDATION_RULES.username.minLength} characters`,
      tooLong: `Username must be less than ${VALIDATION_RULES.username.maxLength} characters`,
      invalidPattern: 'Username can only contain letters, numbers, and underscores',
      reserved: 'This username is reserved',
      unavailable: 'Username is already taken',
    },
    email: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address',
      tooLong: 'Email address is too long',
      unavailable: 'This email is already registered',
    },
    password: {
      required: 'Password is required',
      tooShort: `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,
      tooLong: `Password must be less than ${VALIDATION_RULES.password.maxLength} characters`,
      noUppercase: 'Password must contain at least one uppercase letter',
      noLowercase: 'Password must contain at least one lowercase letter',
      noNumber: 'Password must contain at least one number',
      noSpecial: 'Password must contain at least one special character (@$!%*?&)',
      weak: 'Password is too weak',
      medium: 'Password could be stronger',
      strong: 'Strong password!',
    },
    displayName: {
      required: 'Display name is required',
      tooShort: `Display name must be at least ${VALIDATION_RULES.displayName.minLength} characters`,
      tooLong: `Display name must be less than ${VALIDATION_RULES.displayName.maxLength} characters`,
      invalidPattern: 'Display name can only contain letters, numbers, spaces, and underscores',
    },
    message: {
      required: 'Message is required',
      tooShort: 'Message cannot be empty',
      tooLong: `Message must be less than ${VALIDATION_RULES.message.maxLength} characters`,
      empty: 'Please enter a message',
    },
    general: {
      required: 'This field is required',
      invalid: 'Invalid format',
      network: 'Network error. Please try again.',
      unknown: 'An unknown error occurred',
    }
  } as const;
  
  // Validation result types
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }
  
  export interface PasswordStrength {
    score: number; // 0-4
    level: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
    feedback: string[];
    suggestions: string[];
  }
  
  // Main validation functions
  
  /**
   * Validates a username against all rules
   */
  export function validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
  
    // Required check
    if (!username || username.trim().length === 0) {
      errors.push(VALIDATION_MESSAGES.username.required);
      return { isValid: false, errors, warnings, suggestions };
    }
  
    const trimmedUsername = username.trim();
  
    // Length checks
    if (trimmedUsername.length < VALIDATION_RULES.username.minLength) {
      errors.push(VALIDATION_MESSAGES.username.tooShort);
    }
  
    if (trimmedUsername.length > VALIDATION_RULES.username.maxLength) {
      errors.push(VALIDATION_MESSAGES.username.tooLong);
    }
  
    // Pattern check
    if (!VALIDATION_RULES.username.pattern.test(trimmedUsername)) {
      errors.push(VALIDATION_MESSAGES.username.invalidPattern);
    }
  
    // Reserved check
    if (RESERVED_USERNAMES.includes(trimmedUsername.toLowerCase())) {
      errors.push(VALIDATION_MESSAGES.username.reserved);
    }
  
    // Suggestions for improvement
    if (trimmedUsername.length <= 3) {
      suggestions.push('Try a longer username for better uniqueness');
    }
  
    if (trimmedUsername.includes('_')) {
      suggestions.push('Consider removing underscores for easier sharing');
    }
  
    if (/^\d+$/.test(trimmedUsername)) {
      warnings.push('Username contains only numbers - consider adding letters');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  /**
   * Validates an email address
   */
  export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
  
    // Required check
    if (!email || email.trim().length === 0) {
      errors.push(VALIDATION_MESSAGES.email.required);
      return { isValid: false, errors, warnings, suggestions };
    }
  
    const trimmedEmail = email.trim().toLowerCase();
  
    // Pattern check
    if (!VALIDATION_RULES.email.pattern.test(trimmedEmail)) {
      errors.push(VALIDATION_MESSAGES.email.invalid);
    }
  
    // Length check
    if (trimmedEmail.length > VALIDATION_RULES.email.maxLength) {
      errors.push(VALIDATION_MESSAGES.email.tooLong);
    }
  
    // Common email provider suggestions
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const currentDomain = trimmedEmail.split('@')[1];
    if (currentDomain && !domains.includes(currentDomain)) {
      warnings.push('Consider using a major email provider for better deliverability');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  /**
   * Validates password and returns strength analysis
   */
  export function validatePassword(password: string): ValidationResult & { strength: PasswordStrength } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const feedback: string[] = [];
  
    // Required check
    if (!password) {
      errors.push(VALIDATION_MESSAGES.password.required);
      return {
        isValid: false,
        errors,
        warnings,
        suggestions,
        strength: { score: 0, level: 'very-weak', feedback, suggestions: [] }
      };
    }
  
    // Length checks
    if (password.length < VALIDATION_RULES.password.minLength) {
      errors.push(VALIDATION_MESSAGES.password.tooShort);
    }
  
    if (password.length > VALIDATION_RULES.password.maxLength) {
      errors.push(VALIDATION_MESSAGES.password.tooLong);
    }
  
    // Complexity checks
    let score = 0;
  
    // Length contributes to score
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
  
    // Character variety
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
  
    if (!hasUppercase) {
      errors.push(VALIDATION_MESSAGES.password.noUppercase);
    } else {
      score += 1;
    }
  
    if (!hasLowercase) {
      errors.push(VALIDATION_MESSAGES.password.noLowercase);
    } else {
      score += 1;
    }
  
    if (!hasNumbers) {
      errors.push(VALIDATION_MESSAGES.password.noNumber);
    } else {
      score += 1;
    }
  
    if (!hasSpecial) {
      errors.push(VALIDATION_MESSAGES.password.noSpecial);
    } else {
      score += 1;
    }
  
    // Determine strength level
    let level: PasswordStrength['level'] = 'very-weak';
    let strengthMessage = '';
  
    if (score >= 5) {
      level = 'very-strong';
      strengthMessage = VALIDATION_MESSAGES.password.strong;
    } else if (score >= 4) {
      level = 'strong';
      strengthMessage = VALIDATION_MESSAGES.password.strong;
    } else if (score >= 3) {
      level = 'medium';
      strengthMessage = VALIDATION_MESSAGES.password.medium;
    } else if (score >= 2) {
      level = 'weak';
      strengthMessage = VALIDATION_MESSAGES.password.weak;
    } else {
      level = 'very-weak';
      strengthMessage = VALIDATION_MESSAGES.password.weak;
    }
  
    if (strengthMessage) {
      feedback.push(strengthMessage);
    }
  
    // Generate suggestions
    if (password.length < 12) {
      suggestions.push('Use at least 12 characters for better security');
    }
  
    if (!hasSpecial) {
      suggestions.push('Add special characters (@$!%*?&) to increase strength');
    }
  
    if (isCommonPassword(password)) {
      warnings.push('This password is commonly used - consider something more unique');
      suggestions.push('Avoid common words and patterns');
    }
  
    if (hasRepeatingPatterns(password)) {
      warnings.push('Password contains repeating patterns');
      suggestions.push('Avoid sequences like "123" or "abc"');
    }
  
    const strength: PasswordStrength = {
      score: Math.min(score, 5), // Cap at 5
      level,
      feedback,
      suggestions: [...suggestions],
    };
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      strength,
    };
  }
  
  /**
   * Validates a display name
   */
  export function validateDisplayName(displayName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
  
    // Required check
    if (!displayName || displayName.trim().length === 0) {
      errors.push(VALIDATION_MESSAGES.displayName.required);
      return { isValid: false, errors, warnings, suggestions };
    }
  
    const trimmedName = displayName.trim();
  
    // Length checks
    if (trimmedName.length < VALIDATION_RULES.displayName.minLength) {
      errors.push(VALIDATION_MESSAGES.displayName.tooShort);
    }
  
    if (trimmedName.length > VALIDATION_RULES.displayName.maxLength) {
      errors.push(VALIDATION_MESSAGES.displayName.tooLong);
    }
  
    // Pattern check
    if (!VALIDATION_RULES.displayName.pattern.test(trimmedName)) {
      errors.push(VALIDATION_MESSAGES.displayName.invalidPattern);
    }
  
    // Suggestions
    if (trimmedName.includes('  ')) {
      suggestions.push('Consider removing extra spaces');
    }
  
    if (/^\d+$/.test(trimmedName)) {
      warnings.push('Display name contains only numbers');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  /**
   * Validates a message content
   */
  export function validateMessage(message: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
  
    // Required check
    if (!message || message.trim().length === 0) {
      errors.push(VALIDATION_MESSAGES.message.required);
      return { isValid: false, errors, warnings, suggestions };
    }
  
    const trimmedMessage = message.trim();
  
    // Length checks
    if (trimmedMessage.length < VALIDATION_RULES.message.minLength) {
      errors.push(VALIDATION_MESSAGES.message.tooShort);
    }
  
    if (trimmedMessage.length > VALIDATION_RULES.message.maxLength) {
      errors.push(VALIDATION_MESSAGES.message.tooLong);
    }
  
    // Content warnings
    const offensivePatterns = [
      /\b(hate|stupid|idiot|dumb|ugly|fat)\b/i,
      /(\bkill\b|\bdie\b|\bdeath\b)/i,
      /(\bsex\b|\bporn\b|\bnude\b)/i,
    ];
  
    offensivePatterns.forEach(pattern => {
      if (pattern.test(trimmedMessage)) {
        warnings.push('Message may contain offensive language');
      }
    });
  
    // Spam detection
    const spamPatterns = [
      /(http|www\.)/i,
      /(@everyone|@here)/i,
      /(\bfree\b|\bmoney\b|\bwin\b)/i,
    ];
  
    spamPatterns.forEach(pattern => {
      if (pattern.test(trimmedMessage)) {
        warnings.push('Message looks like spam');
      }
    });
  
    // Suggestions
    if (trimmedMessage.length < 10) {
      suggestions.push('Consider making your message more detailed');
    }
  
    if (!hasEmoji(trimmedMessage) && trimmedMessage.length < 100) {
      suggestions.push('Add an emoji to make your message more engaging! 😊');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  /**
   * Validates a vibe type
   */
  export function validateVibe(vibe: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
  
    if (!vibe) {
      errors.push('Vibe is required');
      return { isValid: false, errors, warnings, suggestions };
    }
  
    if (!VALIDATION_RULES.vibe.allowed.includes(vibe as any)) {
      errors.push('Invalid vibe selected');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  // Helper functions
  
  /**
   * Checks if a password is in the list of common passwords
   */
  function isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '12345678', '123456789', '12345',
      'qwerty', 'abc123', 'password1', '1234567', '1234567890',
      'admin', 'welcome', 'monkey', 'letmein', 'login', 'passw0rd'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }
  
  /**
   * Checks for repeating patterns in password
   */
  function hasRepeatingPatterns(password: string): boolean {
    const patterns = [
      /(.)\1{2,}/, // Same character repeated 3+ times
      /(012|123|234|345|456|567|678|789)/, // Number sequences
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // Letter sequences
      /(qwer|asdf|zxcv)/i, // Keyboard sequences
    ];
    
    return patterns.some(pattern => pattern.test(password));
  }
  
  /**
   * Checks if text contains emojis
   */
  export function hasEmoji(text: string): boolean {
    return VALIDATION_PATTERNS.emoji.test(text);
  }
  
  /**
   * Counts emojis in text
   */
  export function countEmojis(text: string): number {
    const matches = text.match(VALIDATION_PATTERNS.emoji);
    return matches ? matches.length : 0;
  }
  
  /**
   * Sanitizes message content (basic XSS protection)
   */
  export function sanitizeMessage(message: string): string {
    return message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }
  
  /**
   * Truncates text to specified length with ellipsis
   */
  export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Formats validation errors for display
   */
  export function formatValidationErrors(result: ValidationResult): string {
    if (result.isValid) return '';
    return result.errors.join('. ') + (result.errors.length > 0 ? '.' : '');
  }
  
  /**
   * Gets password strength color based on score
   */
  export function getPasswordStrengthColor(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  }
  
  /**
   * Gets password strength text
   */
  export function getPasswordStrengthText(level: PasswordStrength['level']): string {
    switch (level) {
      case 'very-weak':
        return 'Very Weak 😟';
      case 'weak':
        return 'Weak 😐';
      case 'medium':
        return 'Medium 😊';
      case 'strong':
        return 'Strong 🎉';
      case 'very-strong':
        return 'Very Strong 🔥';
      default:
        return 'Unknown';
    }
  }
  
  // Validation composable for React hooks
  export function useValidation() {
    return {
      validateUsername,
      validateEmail,
      validatePassword,
      validateDisplayName,
      validateMessage,
      validateVibe,
      hasEmoji,
      countEmojis,
      sanitizeMessage,
      truncateText,
      formatValidationErrors,
      getPasswordStrengthColor,
      getPasswordStrengthText,
    };
  }
  
  export default {
    PATTERNS: VALIDATION_PATTERNS,
    RULES: VALIDATION_RULES,
    MESSAGES: VALIDATION_MESSAGES,
    validateUsername,
    validateEmail,
    validatePassword,
    validateDisplayName,
    validateMessage,
    validateVibe,
    hasEmoji,
    countEmojis,
    sanitizeMessage,
    truncateText,
    formatValidationErrors,
    getPasswordStrengthColor,
    getPasswordStrengthText,
    useValidation,
  };