import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg mt-2" />
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="py-4 px-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
    </tr>
  );
};
