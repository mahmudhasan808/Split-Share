import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { SERVICE_PRESETS } from '../data/mockData';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Crown, Users, PlusCircle } from 'lucide-react';

const GET_MY_TEAMS = gql`
  query GetMyTeams {
    myTeams {
      id
      name
      subscriptionName
      description
      totalCost
      maxMembers
      ownerId
      renewalDate
      members {
        role
        paymentStatus
        user {
          id
        }
      }
    }
  }
`;

export const MyTeamsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: rawData, loading, error } = useQuery(GET_MY_TEAMS, {
    fetchPolicy: 'cache-and-network'
  });

  const [activeTab, setActiveTab] = useState<'owned' | 'joined'>('owned');

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

  const ownedTeams = teams.filter((t: any) => t.ownerId === currentUser?.id);
  const joinedTeams = teams.filter((t: any) => t.members.some((m: any) => m.user.id === currentUser?.id && t.ownerId !== currentUser?.id));

  const displayTeams = activeTab === 'owned' ? ownedTeams : joinedTeams;

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Teams' }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Teams</h1>
            <p className="text-xs text-slate-500">Manage subscriptions you host or participate in</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/create-team')}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Team
          </Button>
        </div>

        {/* Tab Control */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit text-xs font-semibold">
          <button
            onClick={() => setActiveTab('owned')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'owned'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Owned Teams ({ownedTeams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'joined'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-500" />
            <span>Joined Teams ({joinedTeams.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading your teams...</div>
        ) : error ? (
          <div className="p-10 text-center text-rose-500">Failed to load teams.</div>
        ) : (
          <>
            {/* Teams List */}
            {displayTeams.length === 0 ? (
              <EmptyState
                title={activeTab === 'owned' ? 'No Owned Teams Yet' : 'No Joined Teams Yet'}
                description={
                  activeTab === 'owned'
                    ? 'Create a team to share your Netflix, Spotify, or Canva subscription with others.'
                    : 'Browse available teams on SplitShare and request to join a slot.'
                }
                actionLabel={activeTab === 'owned' ? 'Host a Team' : 'Browse Open Teams'}
                onAction={() => navigate(activeTab === 'owned' ? '/create-team' : '/browse')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayTeams.map((team: any) => {
                  const isOwner = team.ownerId === currentUser?.id;
                  const myMember = team.members.find((m: any) => m.user.id === currentUser?.id);
                  const myMemberStatus = myMember?.paymentStatus || 'PENDING';

                  return (
                    <Card key={team.id} className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{team.serviceLogo}</span>
                            <Badge variant="purple" size="sm">
                              {team.category}
                            </Badge>
                          </div>
                          <Badge variant={team.currentMembersCount >= team.maxMembers ? 'full' : 'active'} size="sm">
                            {team.currentMembersCount} / {team.maxMembers} Members
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{team.name}</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{team.serviceName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {team.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Split</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            ৳{team.costPerMemberBDT}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isOwner && (
                            <Badge variant={myMemberStatus === 'PAID' ? 'paid' : 'pending'} size="sm">
                              {myMemberStatus === 'PAID' ? 'Paid' : 'Payment Due'}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              if (isOwner) navigate(`/manage/${team.id}`);
                              else navigate(`/workspace/${team.id}`);
                            }}
                          >
                            {isOwner ? 'Manage Owner Hub' : 'Open Workspace'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
