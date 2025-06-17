
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce';
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1 justify-center items-center", className)}>
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses.sm)} style={{animationDelay: '0s'}} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses.sm)} style={{animationDelay: '0.1s'}} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses.sm)} style={{animationDelay: '0.2s'}} />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("bg-primary rounded-full animate-pulse", sizeClasses[size], className)} />
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size], className)} />
    );
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)} />
  );
};
