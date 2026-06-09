'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorStyles: Record<string, string> = {
  gold: 'bg-gradient-gold',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const trackColors: Record<string, string> = {
  gold: 'bg-gold/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'gold',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-textSecondary">Progress</span>
          <span className="text-xs font-semibold text-textPrimary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full ${trackColors[color]} ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${Math.round(percentage)}% complete`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full ${colorStyles[color]}`}
        />
      </div>
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };
