import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  CreditCard,
  Bell,
  User,
  Settings,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
    { label: 'My Teams', icon: <Users className="w-4 h-4" />, href: '/my-teams' },
    { label: 'Create Team', icon: <PlusCircle className="w-4 h-4" />, href: '/create-team' },
    { label: 'Payment History', icon: <CreditCard className="w-4 h-4" />, href: '/payments' },
    { label: 'Notifications', icon: <Bell className="w-4 h-4" />, href: '/notifications' },
    { label: 'Profile', icon: <User className="w-4 h-4" />, href: '/profile' },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/settings' }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-6">
        {/* User Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
              <span>{currentUser?.name}</span>
              {currentUser?.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUser?.role} Account</p>
          </div>
        </div>

        {/* Workspace Menu */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1">
            Workspace
          </span>
          {links.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider px-3 mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Center</span>
            </span>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === '/admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Overview</span>
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === '/admin/users'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer info widget */}
      <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
        <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200">bKash / Nagad Ready</p>
        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">Verified local payment split</p>
      </div>
    </aside>
  );
};
