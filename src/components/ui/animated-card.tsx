
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardProps } from '@/components/ui/card';

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'hover';
  delay?: number;
}

export const AnimatedCard = ({ 
  children, 
  className, 
  animation = 'fadeIn',
  delay = 0,
  ...props 
}: AnimatedCardProps) => {
  const animationClasses = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scale: 'animate-scale-in',
    hover: 'transition-all duration-300 hover:scale-105 hover:shadow-lg'
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300",
        animationClasses[animation],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Card>
  );
};
