// src/components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, Eye, EyeOff, Check, X, Loader2, Mail, Lock, User, MessageCircle, Sparkles } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = 'default',
    size = 'md',
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    loading = false,
    status = 'idle',
    label,
    helperText,
    containerClassName,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type

    const getVariantStyles = () => {
      switch (variant) {
        case 'success':
          return {
            input: 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/50 text-green-900 placeholder-green-700/60',
            label: 'text-green-700',
            helper: 'text-green-600'
          }
        case 'error':
          return {
            input: 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50 text-red-900 placeholder-red-700/60',
            label: 'text-red-700',
            helper: 'text-red-600'
          }
        case 'warning':
          return {
            input: 'border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-yellow-50/50 text-yellow-900 placeholder-yellow-700/60',
            label: 'text-yellow-700',
            helper: 'text-yellow-600'
          }
        case 'premium':
          return {
            input: 'border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 text-amber-900 placeholder-amber-700/60',
            label: 'text-amber-700',
            helper: 'text-amber-600'
          }
        default:
          return {
            input: 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 text-gray-900 placeholder-gray-500',
            label: 'text-gray-700',
            helper: 'text-gray-600'
          }
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            input: 'h-9 px-3 py-2 text-sm rounded-lg',
            label: 'text-sm',
            helper: 'text-xs',
            icon: 'w-4 h-4'
          }
        case 'lg':
          return {
            input: 'h-12 px-4 py-3 text-base rounded-xl',
            label: 'text-base',
            helper: 'text-sm',
            icon: 'w-5 h-5'
          }
        case 'xl':
          return {
            input: 'h-14 px-4 py-3 text-lg rounded-xl',
            label: 'text-lg',
            helper: 'text-base',
            icon: 'w-6 h-6'
          }
        default:
          return {
            input: 'h-11 px-4 py-3 text-sm rounded-xl',
            label: 'text-sm',
            helper: 'text-xs',
            icon: 'w-4 h-4'
          }
      }
    }

    const getStatusIcon = () => {
      if (loading || status === 'loading') {
        return <Loader2 className={cn("animate-spin", getSizeStyles().icon)} />
      }
      
      switch (status) {
        case 'success':
          return <Check className={cn("text-green-500", getSizeStyles().icon)} />
        case 'error':
          return <X className={cn("text-red-500", getSizeStyles().icon)} />
        default:
          return null
      }
    }

    const variantStyles = getVariantStyles()
    const sizeStyles = getSizeStyles()

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className={cn("block font-medium", variantStyles.label, sizeStyles.label)}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
              isFocused ? "text-purple-500" : "text-gray-400"
            )}>
              {React.cloneElement(leftIcon as React.ReactElement, {
                className: cn((leftIcon as React.ReactElement).props.className, sizeStyles.icon)
              })}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "flex w-full border-2 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm font-medium",
              variantStyles.input,
              sizeStyles.input,
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || status !== 'idle' || loading) && "pr-10",
              isFocused && "transform scale-[1.02]",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          <div className="absolute flex items-center gap-2 transform -translate-y-1/2 right-3 top-1/2">
            {getStatusIcon()}
            
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:outline-none focus:text-purple-500"
              >
                {showPassword ? (
                  <EyeOff className={sizeStyles.icon} />
                ) : (
                  <Eye className={sizeStyles.icon} />
                )}
              </button>
            )}
            
            {rightIcon && !showPasswordToggle && (status === 'idle' && !loading) && (
              <div className={cn(
                "transition-colors duration-200",
                isFocused ? "text-purple-500" : "text-gray-400"
              )}>
                {React.cloneElement(rightIcon as React.ReactElement, {
                  className: cn((rightIcon as React.ReactElement).props.className, sizeStyles.icon)
                })}
              </div>
            )}
          </div>

          {/* Focus ring animation */}
          {isFocused && (
            <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-purple-200 animate-pulse" />
          )}
        </div>

        {helperText && (
          <p className={cn("font-medium", variantStyles.helper, sizeStyles.helper)}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Specialized Input Variants

// Search Input
const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        leftIcon={<Search />}
        placeholder="Search messages, users..."
        variant={variant}
        className={cn("pr-4", className)}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Password Input
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="password"
        showPasswordToggle={true}
        leftIcon={<Lock />}
        placeholder="Enter your password"
        variant={variant}
        className={className}
        {...props}
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// Email Input
const EmailInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="email"
        leftIcon={<Mail />}
        placeholder="email@example.com"
        variant={variant}
        className={className}
        {...props}
      />
    )
  }
)
EmailInput.displayName = "EmailInput"

// Username Input
const UsernameInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', status, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        leftIcon={<User />}
        placeholder="coolusername"
        variant={variant}
        status={status}
        className={className}
        {...props}
      />
    )
  }
)
UsernameInput.displayName = "UsernameInput"

// Message Input
const MessageInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        leftIcon={<MessageCircle />}
        placeholder="Type your message..."
        variant={variant}
        size="lg"
        className={cn("pr-4", className)}
        {...props}
      />
    )
  }
)
MessageInput.displayName = "MessageInput"

// Premium Input
const PremiumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        variant="premium"
        leftIcon={<Sparkles />}
        placeholder="Premium feature..."
        className={className}
        {...props}
      />
    )
  }
)
PremiumInput.displayName = "PremiumInput"

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  helperText?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'md',
    label,
    helperText,
    containerClassName,
    leftIcon,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const getVariantStyles = () => {
      switch (variant) {
        case 'success':
          return {
            input: 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/50 text-green-900 placeholder-green-700/60',
            label: 'text-green-700',
            helper: 'text-green-600'
          }
        case 'error':
          return {
            input: 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50 text-red-900 placeholder-red-700/60',
            label: 'text-red-700',
            helper: 'text-red-600'
          }
        case 'warning':
          return {
            input: 'border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-yellow-50/50 text-yellow-900 placeholder-yellow-700/60',
            label: 'text-yellow-700',
            helper: 'text-yellow-600'
          }
        case 'premium':
          return {
            input: 'border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 text-amber-900 placeholder-amber-700/60',
            label: 'text-amber-700',
            helper: 'text-amber-600'
          }
        default:
          return {
            input: 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/80 text-gray-900 placeholder-gray-500',
            label: 'text-gray-700',
            helper: 'text-gray-600'
          }
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            input: 'min-h-[80px] px-3 py-2 text-sm rounded-lg',
            label: 'text-sm',
            helper: 'text-xs'
          }
        case 'lg':
          return {
            input: 'min-h-[120px] px-4 py-3 text-base rounded-xl',
            label: 'text-base',
            helper: 'text-sm'
          }
        case 'xl':
          return {
            input: 'min-h-[160px] px-4 py-3 text-lg rounded-xl',
            label: 'text-lg',
            helper: 'text-base'
          }
        default:
          return {
            input: 'min-h-[100px] px-4 py-3 text-sm rounded-xl',
            label: 'text-sm',
            helper: 'text-xs'
          }
      }
    }

    const variantStyles = getVariantStyles()
    const sizeStyles = getSizeStyles()

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className={cn("block font-medium", variantStyles.label, sizeStyles.label)}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-3 transition-colors duration-200",
              isFocused ? "text-purple-500" : "text-gray-400"
            )}>
              {leftIcon}
            </div>
          )}
          
          <textarea
            className={cn(
              "flex w-full border-2 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm font-medium resize-none",
              variantStyles.input,
              sizeStyles.input,
              leftIcon && "pl-10",
              isFocused && "transform scale-[1.02]",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Focus ring animation */}
          {isFocused && (
            <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-purple-200 animate-pulse" />
          )}
        </div>

        {helperText && (
          <p className={cn("font-medium", variantStyles.helper, sizeStyles.helper)}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Message Textarea
const MessageTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        variant={variant}
        leftIcon={<MessageCircle className="w-4 h-4" />}
        placeholder="Type your anonymous message... ✨"
        size="lg"
        className={className}
        {...props}
      />
    )
  }
)
MessageTextarea.displayName = "MessageTextarea"

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  EmailInput, 
  UsernameInput, 
  MessageInput,
  PremiumInput,
  Textarea,
  MessageTextarea 
}