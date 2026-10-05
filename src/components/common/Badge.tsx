import React from 'react';

export type StatusType = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Active' | 'VIP' | 'Inactive' | 'Online' | 'Delivering' | 'Offline' | 'Paid' | 'Refunded';

interface BadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  let badgeStyle = 'bg-surface-container text-on-surface-variant border border-transparent';

  switch (status) {
    case 'Pending':
      badgeStyle = 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20';
      break;
    case 'Preparing':
      badgeStyle = 'bg-surface-container-high text-on-surface-variant border-outline-variant/30';
      break;
    case 'Out for Delivery':
      badgeStyle = 'bg-primary-container text-on-primary font-bold shadow-sm';
      break;
    case 'Delivered':
    case 'Paid':
    case 'Active':
    case 'Online':
      badgeStyle = 'bg-secondary-fixed text-secondary-on-container font-semibold border border-secondary/30';
      break;
    case 'Cancelled':
    case 'Refunded':
      badgeStyle = 'bg-error-container text-error font-semibold';
      break;
    case 'VIP':
      badgeStyle = 'bg-gradient-to-r from-tertiary-fixed to-primary-fixed text-primary font-bold shadow-sm';
      break;
    case 'Delivering':
      badgeStyle = 'bg-primary-fixed text-primary font-semibold border border-primary/20';
      break;
    case 'Offline':
    case 'Inactive':
      badgeStyle = 'bg-surface-container-low text-outline';
      break;
    default:
      badgeStyle = 'bg-surface-container text-on-surface-variant';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-label tracking-wide',
    md: 'text-xs px-2.5 py-1 rounded-full font-label font-medium tracking-wide',
    lg: 'text-sm px-3 py-1.5 rounded-full font-label font-semibold',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} ${badgeStyle} ${className}`}>
      {status === 'Delivering' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
      {status === 'Out for Delivery' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {status === 'Active' || status === 'Online' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
      ) : null}
      {status}
    </span>
  );
};

export const DietaryTag: React.FC<{ isVeg: boolean; className?: string }> = ({ isVeg, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-[2px] border ${
        isVeg ? 'border-secondary' : 'border-error'
      } bg-white shrink-0 ${className}`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-secondary' : 'bg-error'}`} />
    </span>
  );
};
