import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Shield, Users, Layers, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { stats, users, teams, payments } = useData();
  const navigate = useNavigate();

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin Panel' }]} />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Administration</h1>
            </div>
            <p className="text-xs text-slate-500">System-wide performance, revenue metrics & moderation</p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/users')}>
              Manage Users ({users.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/teams')}>
              Audit Teams ({teams.length})
            </Button>
          </div>
        </div>

        {/* System Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Platform Users</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalUsers}</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% this month
            </span>
          </Card>

          <Card className="p-5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Teams</span>
            <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.totalActiveTeams}</h3>
            <span className="text-[10px] text-slate-500">Across 11 categories</span>
          </Card>

          <Card className="p-5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Volume (BDT)</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">৳{stats.totalVolumeBDT}</h3>
            <span className="text-[10px] text-slate-500">Processed via bKash/Nagad</span>
          </Card>

          <Card className="p-5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Monthly MRR</span>
            <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">৳{stats.monthlyRevenueBDT}</h3>
            <span className="text-[10px] text-slate-500">Platform fee earnings</span>
          </Card>
        </div>

        {/* Visual Analytics Chart Simulation Bar */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">User Signups & Activity Growth</h3>
          <div className="h-40 flex items-end gap-3 pt-6 border-b border-slate-100 dark:border-slate-800">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, idx) => {
              const heights = [45, 60, 55, 75, 90, 85, 95, 100];
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    style={{ height: `${heights[idx]}%` }}
                    className="w-full rounded-t-lg bg-indigo-600 hover:bg-indigo-500 transition-all opacity-90"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold">{month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Admin Audit Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Registered Users</h3>
              <Link to="/admin/users" className="text-xs text-indigo-600 hover:underline">
                View All →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {users.slice(0, 3).map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{u.name}</h4>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant={u.status === 'active' ? 'active' : 'rejected'} size="sm">
                    {u.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Flagged Transactions</h3>
              <Link to="/admin/payments" className="text-xs text-indigo-600 hover:underline">
                View Audit →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {payments.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div>
                    <span className="font-mono font-bold">{p.transactionId}</span>
                    <span className="text-[10px] text-slate-500 block">{p.userName} • ৳{p.amountBDT}</span>
                  </div>
                  <Badge variant={p.status === 'verified' ? 'verified' : 'pending'} size="sm">
                    {p.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
