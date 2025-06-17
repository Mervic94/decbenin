
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AnimatedFormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const AnimatedFormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className
}: AnimatedFormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHasValue(newValue.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputClasses = cn(
    "transition-all duration-300 border-2 rounded-lg px-4 py-3",
    "focus:border-primary focus:ring-2 focus:ring-primary/20",
    "hover:border-gray-400",
    error ? "border-red-500 focus:border-red-500" : "border-gray-300",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const labelClasses = cn(
    "absolute left-4 transition-all duration-300 pointer-events-none",
    "text-gray-500",
    (isFocused || hasValue || value) 
      ? "top-0 text-xs bg-white px-2 -translate-y-1/2 text-primary" 
      : "top-1/2 -translate-y-1/2 text-base"
  );

  return (
    <div className="relative mb-6">
      <div className="relative">
        {type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={inputClasses}
            placeholder=" "
            rows={4}
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={inputClasses}
            placeholder=" "
          />
        )}
        <Label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
