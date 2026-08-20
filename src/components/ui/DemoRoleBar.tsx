import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { UserCheck, Shield, Crown, User, Sun, Moon } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'guest', label: 'Guest (Sam)', icon: <User className="w-3.5 h-3.5" />, color: 'hover:bg-slate-700' },
    { role: 'member', label: 'Member (John)', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'hover:bg-emerald-700' },
    { role: 'owner', label: 'Owner (Alex)', icon: <Crown className="w-3.5 h-3.5" />, color: 'hover:bg-indigo-700' },
    { role: 'admin', label: 'Admin (Sarah)', icon: <Shield className="w-3.5 h-3.5" />, color: 'hover:bg-purple-700' }
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800 shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50">
          Demo Switcher
        </span>
        <span className="hidden sm:inline text-slate-400">Switch user context:</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {roles.map(r => {
          const isActive = currentUser?.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={`Switch active context to ${r.label}`}
            >
              {r.icon}
              <span className="truncate max-w-[100px]">{r.label}</span>
            </button>
          );
        })}

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <button
          onClick={toggleTheme}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-indigo-300" />}
          <span className="capitalize hidden md:inline">{theme} Mode</span>
        </button>
      </div>
    </div>
  );
};
