import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { SERVICE_PRESETS } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import {
  Users,
  CreditCard,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Crown
} from 'lucide-react';

const GET_MY_TEAMS_DASHBOARD = gql`
  query GetMyTeamsDashboard {
    myTeams {
      id
      name
      subscriptionName
      totalCost
      maxMembers
      ownerId
      renewalDate
      members {
        user {
          id
        }
      }
    }
  }
`;

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: rawData, loading, error } = useQuery(GET_MY_TEAMS_DASHBOARD, {
    fetchPolicy: 'cache-and-network'
  });

  const data: any = rawData;
  const teams = useMemo(() => {
    if (!data?.myTeams) return [];
    return data.myTeams.map((t: any) => {
      const preset = SERVICE_PRESETS.find(p => p.name === t.subscriptionName);
      return {
        ...t,
        category: preset?.category || 'Custom',
        serviceLogo: preset?.logo || '✨',
        serviceName: t.subscriptionName,
        currentMembersCount: t.members?.length || 1,
        costPerMemberBDT: Math.round(t.totalCost / (t.maxMembers || 1)),
        nextRenewalDate: t.renewalDate
      };
    });
  }, [data]);

  // Compute User Specific Stats
  const ownedTeams = teams.filter((t: any) => t.ownerId === currentUser?.id);
  const joinedTeams = teams.filter((t: any) => t.members.some((m: any) => m.user.id === currentUser?.id && t.ownerId !== currentUser?.id));

  const totalMonthlySavings = joinedTeams.reduce((sum: number, t: any) => sum + (t.totalCost - t.costPerMemberBDT), 0);

  // Stub for now since backend doesn't export these top level queries yet
  const pendingPaymentAlerts: any[] = [];
  const pendingOwnerJoinRequests: any[] = [];

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />

        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Welcome back, {currentUser?.name}!</span>
                <Badge variant="purple" size="sm">
                  {currentUser?.role?.toUpperCase()}
                </Badge>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser?.role === 'ADMIN'
                  ? 'Manage your active subscription teams & verify bKash payments.'
                  : 'Track your shared subscription slots & renewal deadlines.'}
              </p>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={() => navigate('/create-team')}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Team
          </Button>
        </div>

        {/* Pending Alerts Banner (If Action Needed) */}
        {(pendingPaymentAlerts.length > 0 || pendingOwnerJoinRequests.length > 0) && (
          <Card className="p-4 bg-amber-500/10 border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300">Action Required: </span>
                <span className="text-amber-800 dark:text-amber-400">
                  {pendingPaymentAlerts.length} payment verification(s) and {pendingOwnerJoinRequests.length} join request(s) waiting!
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (ownedTeams.length > 0) navigate(`/manage/${ownedTeams[0].id}`);
                else navigate('/my-teams');
              }}
            >
              Review Now →
            </Button>
          </Card>
        )}

        {/* Quick Personal Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Owned Teams</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{loading ? '-' : ownedTeams.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Hosted by you</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined Teams</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{loading ? '-' : joinedTeams.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Active member slots</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Savings</span>
              <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {loading ? '-' : `৳${totalMonthlySavings}`}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Saved vs full price</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Upcoming Renewals Feed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Renewals</h3>
              <p className="text-xs text-slate-500">Subscriptions renewing this month</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/my-teams')}>
              View All
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Loading upcoming renewals...</p>
            ) : [...ownedTeams, ...joinedTeams].length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">You have not joined or created any teams yet.</p>
            ) : (
              [...ownedTeams, ...joinedTeams].map((team: any) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{team.serviceLogo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{team.name}</h4>
                      <p className="text-[10px] text-slate-500">{team.serviceName} • ৳{team.costPerMemberBDT}/mo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Renewal Date</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                        {new Date(team.nextRenewalDate).toLocaleDateString()}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (team.ownerId === currentUser?.id) navigate(`/manage/${team.id}`);
                        else navigate(`/workspace/${team.id}`);
                      }}
                    >
                      {team.ownerId === currentUser?.id ? 'Manage' : 'Workspace'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            hoverEffect
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/browse')}
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Browse Open Teams</h4>
              <p className="text-xs text-slate-500 mt-0.5">Find available slots for Netflix, ChatGPT & Spotify</p>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-500" />
          </Card>

          <Card
            hoverEffect
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/payments')}
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Payment Audit Logs</h4>
              <p className="text-xs text-slate-500 mt-0.5">View transaction IDs, receipts & CSV downloads</p>
            </div>
            <CreditCard className="w-5 h-5 text-emerald-500" />
          </Card>
        </div>
      </main>
    </div>
  );
};
