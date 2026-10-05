import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: string;
  accentColor?: 'primary' | 'secondary' | 'tertiary' | 'error';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  isPositive = true,
  subtitle,
  icon,
  accentColor = 'primary',
  className = '',
}) => {
  const accentGlow = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    tertiary: 'bg-tertiary/10',
    error: 'bg-error/10',
  }[accentColor];

  const iconColor = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    error: 'text-error',
  }[accentColor];

  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-xl ghost-border relative overflow-hidden flex flex-col justify-between h-44 shadow-level-1 hover:shadow-level-2 transition-all duration-300 group ${className}`}
    >
      {/* Blurred Glowing Ambient Orb */}
      <div
        className={`absolute -right-6 -top-6 w-28 h-28 ${accentGlow} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`}
      />

      {/* Top Header with Title and Icon */}
      <div className="flex justify-between items-start z-10">
        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-surface-container-low ${iconColor} group-hover:scale-110 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>

      {/* Main Value Display */}
      <div className="z-10 mt-1">
        <div className="text-3xl lg:text-4xl font-headline font-bold text-on-background tracking-tight">
          {value}
        </div>

        {/* Footer Trend & Context */}
        <div className="flex items-center gap-2 mt-2 font-body text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'text-secondary bg-secondary-fixed/50'
                  : 'text-error bg-error-container/50'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isPositive ? 'trending_up' : 'trending_down'}
              </span>
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-on-surface-variant/80 truncate">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};
