interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'info' | 'outline' | 'destructive';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-light text-textSecondary',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  outline: 'border border-white/10 text-textSecondary',
  destructive: 'bg-gold/10 text-gold border-gold/20',
};

const dotColors: Record<string, string> = {
  default: 'bg-textSecondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  gold: 'bg-gold',
  info: 'bg-blue-400',
  outline: 'bg-textSecondary',
  destructive: 'bg-gold',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
