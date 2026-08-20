import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'full'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'paid'
  | 'overdue'
  | 'info'
  | 'neutral'
  | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, size = 'md', icon }) => {
  const styles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    verified: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    full: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    purple: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  };

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizeClasses}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
