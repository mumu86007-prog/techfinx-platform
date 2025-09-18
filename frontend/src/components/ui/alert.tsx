import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const baseClasses = 'rounded-md p-4';
  
  const variantClasses = {
    default: 'bg-gray-50 text-gray-900 border border-gray-200',
    destructive: 'bg-red-50 text-red-900 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border border-yellow-200',
    info: 'bg-blue-50 text-blue-900 border border-blue-200',
    success: 'bg-green-50 text-green-900 border border-green-200',
  };

  const iconClasses = {
    default: 'text-gray-400',
    destructive: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400',
  };

  const icons = {
    default: InformationCircleIcon,
    destructive: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', iconClasses[variant])} />
        </div>
        <div className="ml-3">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn('text-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
};
