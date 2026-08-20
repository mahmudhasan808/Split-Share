import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, Star, Calendar, Crown, Users, Mail, Phone } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { teams } = useData();

  const ownedCount = teams.filter(t => t.ownerId === currentUser?.id).length;
  const joinedCount = teams.filter(t => t.members.some(m => m.userId === currentUser?.id && m.userId !== t.ownerId)).length;

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'User Profile' }]} />

        {/* Header Profile Card */}
        <Card className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentUser?.name}</span>
                {currentUser?.verified && <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />}
              </h1>
              <Badge variant="purple" size="sm">
                {currentUser?.role?.toUpperCase()}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mt-1 leading-relaxed">
              {currentUser?.bio || 'No bio specified.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>{currentUser?.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentUser?.phone || '+880 1711 000000'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>Joined {currentUser?.joinedDate}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reputation</span>
            <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser?.reputation || 5.0}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Verified Host</span>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Teams Hosted</span>
              <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{ownedCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Active subscription groups created</p>
            </div>
            <Crown className="w-10 h-10 text-indigo-500/20" />
          </Card>

          <Card className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Teams Joined</span>
              <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{joinedCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Shared subscription slots</p>
            </div>
            <Users className="w-10 h-10 text-purple-500/20" />
          </Card>
        </div>
      </main>
    </div>
  );
};
