import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'default';

type ButtonProps<T extends ElementType = 'button'> = {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  selected?: boolean;
  as?: T;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export function Button<T extends ElementType = 'button'>({
  variant = 'default',
  size = 'md',
  selected = false,
  as,
  children,
  className,
  style,
  disabled,
  ...rest
}: ButtonProps<T>) {
  const Component = (as ?? 'button') as ElementType;

  const isPrimary = variant === 'primary' || (variant === 'default' && selected);
  const isOutline = variant === 'outline' && !selected;

  const baseStyle: React.CSSProperties = {
    borderRadius: size === 'sm' ? 4 : 6,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '2px solid',
  };

  const sizeStyle: React.CSSProperties =
    size === 'sm'
      ? { padding: '10px 16px', fontSize: 14 }
      : { minWidth: 'min(220px, 85vw)', padding: '18px 16px', fontSize: 14 };

  const variantStyle: React.CSSProperties = disabled
    ? {
      backgroundColor: 'var(--muted-bg)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border)',
    }
    : isPrimary
      ? {
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        borderColor: 'var(--primary)',
      }
      : isOutline
        ? {
          backgroundColor: 'var(--surface)',
          color: 'var(--primary)',
          borderColor: 'var(--primary)',
        }
        : {
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border)',
        };

  const combinedStyle = { ...baseStyle, ...sizeStyle, ...variantStyle, ...style };

  const buttonOnlyProps =
    Component === 'button'
      ? { type: 'button' as const, disabled }
      : {};

  return (
    <Component
      className={className}
      style={combinedStyle}
      {...buttonOnlyProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
