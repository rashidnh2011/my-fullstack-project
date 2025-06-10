import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'bordered';
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  children, 
  variant = 'default',
  hover = false,
  ...props 
}) => (
  <div
    className={cn(
      "rounded-xl bg-card text-card-foreground transition-all duration-200",
      {
        "border shadow-soft": variant === 'default',
        "card-gradient border-0 shadow-medium": variant === 'gradient',
        "glass": variant === 'glass',
        "border-2 border-primary/20 shadow-medium": variant === 'bordered',
        "hover-lift cursor-pointer": hover,
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-2 p-6", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ 
  className, 
  children, 
  size = 'md',
  ...props 
}) => (
  <h3
    className={cn(
      "font-semibold leading-none tracking-tight text-foreground",
      {
        "text-lg": size === 'sm',
        "text-xl": size === 'md',
        "text-2xl": size === 'lg',
      },
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
    {children}
  </div>
);