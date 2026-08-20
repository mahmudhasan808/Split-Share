import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-2">
      <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {item.href ? (
            <Link to={item.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
