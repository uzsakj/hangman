import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'default';

type ButtonProps<T extends ElementType = 'button'> = {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const sizeClasses = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'min-w-[min(220px,85vw)] px-4 py-[18px] text-sm',
  lg: 'min-w-[min(220px,85vw)] px-4 py-[22px] text-base',
};

export function Button<T extends ElementType = 'button'>({
  variant = 'default',
  size = 'md',
  selected = false,
  as,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps<T>) {
  const Component = (as ?? 'button') as ElementType;

  const isPrimary = variant === 'primary' || (variant === 'default' && selected);
  const isOutline = variant === 'outline' && !selected;

  const variantClasses = disabled
    ? 'bg-[var(--muted-bg)] text-[var(--text-secondary)] border-[var(--border)] cursor-not-allowed'
    : isPrimary
      ? 'bg-[var(--primary)] text-white border-[var(--primary)] cursor-pointer'
      : isOutline
        ? 'bg-[var(--surface)] text-[var(--primary)] border-[var(--primary)] cursor-pointer'
        : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] cursor-pointer';

  const roundedClass = size === 'sm' ? 'rounded' : 'rounded-md';

  const buttonOnlyProps =
    Component === 'button'
      ? { type: 'button' as const, disabled }
      : {};

  return (
    <Component
      className={`border-2 font-semibold ${roundedClass} ${sizeClasses[size]} ${variantClasses} ${className}`.trim()}
      {...buttonOnlyProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
