
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'scale';
}

export const AnimatedPage = ({ 
  children, 
  className,
  animation = 'fadeIn'
}: AnimatedPageProps) => {
  const animationClasses = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scale: 'animate-scale-in'
  };

  return (
    <div className={cn(
      "min-h-screen w-full",
      animationClasses[animation],
      className
    )}>
      {children}
    </div>
  );
};
