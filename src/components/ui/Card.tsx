import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel border-white/40 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-sm'
      } ${
        hoverEffect
          ? 'hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
