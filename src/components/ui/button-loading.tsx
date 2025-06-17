
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const ButtonLoading = ({
  children,
  loading = false,
  loadingText,
  icon,
  disabled,
  className,
  ...props
}: ButtonLoadingProps) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        'btn-smooth relative overflow-hidden',
        loading && 'cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-inherit flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      )}
      <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {icon && <span>{icon}</span>}
        {children}
      </div>
    </Button>
  );
};
