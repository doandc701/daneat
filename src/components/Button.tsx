import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  labelClassName = '',
}) => {
  const baseStyles = "flex-row items-center justify-center rounded-2xl";
  
  const variantStyles = {
    primary: "bg-indigo-600 shadow-lg shadow-indigo-200",
    secondary: "bg-slate-900 shadow-lg shadow-slate-200",
    outline: "bg-transparent border border-slate-200",
    ghost: "bg-transparent",
    danger: "bg-red-500 shadow-lg shadow-red-200",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-5",
  };

  const labelBaseStyles = "font-bold text-center";
  
  const labelVariantStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-slate-800",
    ghost: "text-indigo-600",
    danger: "text-white",
  };

  const labelSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${isDisabled ? 'opacity-50' : ''} 
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#4f46e5' : '#ffffff'} />
      ) : (
        <Text className={`
          ${labelBaseStyles} 
          ${labelVariantStyles[variant]} 
          ${labelSizeStyles[size]} 
          ${labelClassName}
        `}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
