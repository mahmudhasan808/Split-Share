import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { SERVICE_PRESETS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Input';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import {
  Users,
  Calendar,
  CreditCard,
  ShieldCheck,
  Star,
  Lock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($id: ID!) {
    team(id: $id) {
      id
      name
      subscriptionName
      description
      rules
      billingCycle
      totalCost
      maxMembers
      paymentMethod
      paymentNumber
      renewalDate
      ownerId
      owner {
        name
        avatar
      }
      members {
        role
        paymentStatus
        joinedAt
        user {
          id
          name
          avatar
        }
      }
    }
  }
`;

const REQUEST_TO_JOIN = gql`
  mutation RequestToJoin($teamId: ID!, $message: String) {
    requestToJoinTeam(teamId: $teamId, message: $message) {
      id
      status
    }
  }
`;

export const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  const { data: rawData, loading, error } = useQuery(GET_TEAM_DETAILS, {
    variables: { id: teamId },
    fetchPolicy: 'cache-and-network',
    skip: !teamId
  });

  const [requestToJoin, { loading: requesting }] = useMutation(REQUEST_TO_JOIN, {
    onCompleted: () => {
      alert("Request sent successfully!");
      setIsModalOpen(false);
      setRequestMessage('');
    },
    onError: (e) => alert(e.message)
  });

  const data: any = rawData;
  const team = useMemo(() => {
    if (!data?.team) return null;
    const t = data.team;
    const preset = SERVICE_PRESETS.find(p => p.name === t.subscriptionName);
    return {
      ...t,
      category: preset?.category || 'Custom',
      serviceLogo: preset?.logo || '✨',
      serviceName: t.subscriptionName,
      currentMembersCount: t.members?.length || 1,
      costPerMemberBDT: Math.round(t.totalCost / (t.maxMembers || 1)),
      nextRenewalDate: t.renewalDate,
      ownerName: t.owner?.name || 'Host',
      ownerAvatar: t.owner?.avatar,
      rules: t.rules ? t.rules.split('\n').filter(Boolean) : []
    };
  }, [data]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading team details...</div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-rose-500">Error loading team.</div>;

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The subscription team you are looking for does not exist or was removed.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/browse')}>
          Back to Browse Teams
        </Button>
      </div>
    );
  }

  const isOwner = currentUser?.id === team.ownerId;
  const isMember = team.members.some((m: any) => m.user.id === currentUser?.id);
  const availableSlots = team.maxMembers - team.currentMembersCount;
  const isFull = availableSlots <= 0;

  const handleSendRequest = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    requestToJoin({ variables: { teamId: team.id, message: requestMessage || 'Hi! I would like to join your team.' } });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full">
      <Breadcrumbs items={[{ label: 'Browse Teams', href: '/browse' }, { label: team.name }]} />

      {/* Main Header Banner */}
      <Card className="p-6 sm:p-8 gradient-bg text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shrink-0">
              {team.serviceLogo}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                  {team.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                  {team.billingCycle.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{team.name}</h1>
              <p className="text-indigo-100 text-xs sm:text-sm mt-1">{team.serviceName}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center min-w-[180px]">
            <span className="text-xs text-indigo-200 font-medium">Your Monthly Split</span>
            <h2 className="text-3xl font-extrabold text-white mt-0.5">৳{team.costPerMemberBDT}</h2>
            <p className="text-[10px] text-indigo-200 mt-1">Total: ৳{team.totalCost} / {team.maxMembers} members</p>
          </div>
        </div>
      </Card>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Details & Rules */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Subscription Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {team.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Next Renewal</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {new Date(team.nextRenewalDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Payment Method</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  {team.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Available Slots</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  {team.currentMembersCount} / {team.maxMembers}
                </span>
              </div>
            </div>
          </Card>

          {/* Team Rules */}
          {team.rules.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Host Guidelines & Rules</h3>
              <ul className="flex flex-col gap-2.5">
                {team.rules.map((rule: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Current Members Roster */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Current Members ({team.members.length} / {team.maxMembers})
            </h3>
            <div className="flex flex-col gap-3">
              {team.members.map((member: any) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img src={member.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={member.user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{member.user.name}</span>
                        {member.user.id === team.ownerId && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 rounded font-semibold">
                            Host
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500">Joined {new Date(Number(member.joinedAt)).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={member.paymentStatus === 'PAID' ? 'paid' : 'pending'} size="sm">
                    {member.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Host Info & Join Action */}
        <div className="flex flex-col gap-6">
          {/* Action Box */}
          <Card className="p-6 flex flex-col gap-4 border-2 border-indigo-500/30">
            <div>
              <Badge variant={isFull ? 'full' : 'active'} size="md">
                {isFull ? 'Team Full' : `${availableSlots} Slot${availableSlots > 1 ? 's' : ''} Available`}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Ready to Join?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Send a join request to host {team.ownerName}. Upon approval, submit ৳{team.costPerMemberBDT} via {team.paymentMethod} to reveal credentials!
              </p>
            </div>

            {isOwner ? (
              <Button variant="primary" onClick={() => navigate(`/manage/${team.id}`)}>
                Manage My Team →
              </Button>
            ) : isMember ? (
              <Button variant="success" onClick={() => navigate(`/workspace/${team.id}`)}>
                Enter Team Workspace →
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={isFull || requesting}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              >
                {requesting ? 'Sending...' : isFull ? 'Team Full' : 'Request to Join Team'}
              </Button>
            )}

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Credentials unlocked instantly after bKash verification</span>
            </div>
          </Card>

          {/* Host Profile Card */}
          <Card className="p-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Team Host</span>
            <div className="flex items-center gap-3">
              <img src={team.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={team.ownerName} className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>{team.ownerName}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                </h4>
                <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">4.9</span>
                  <span className="text-slate-400 text-[10px]">(Verified Organizer)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
                <span>bKash/Nagad: {team.paymentNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Bangladeshi User</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Request to Join Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Request to Join ${team.name}`}
        subtitle={`Send a quick message to host ${team.ownerName}`}
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
            <p className="font-semibold">Split Cost: ৳{team.costPerMemberBDT} / month</p>
            <p className="mt-0.5 text-indigo-700 dark:text-indigo-300">Payment via {team.paymentMethod} after approval.</p>
          </div>

          <Textarea
            label="Introductory Message"
            rows={3}
            placeholder="Hi! I would love to join your 4K Netflix profile. Ready to send payment via bKash immediately."
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendRequest} disabled={requesting}>
              {requesting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
