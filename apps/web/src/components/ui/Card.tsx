'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'gold' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface border border-white/[0.06]',
  glass: 'glass-panel',
  gold: 'glass-panel border-gold/30 shadow-[0_8px_32px_rgba(234,179,8,0.15)]',
  elevated: 'bg-surface shadow-card border border-white/[0.06]',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? { y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }
          : undefined
      }
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'cursor-pointer transition-shadow duration-300 hover:shadow-card-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Card };
export type { CardProps };
