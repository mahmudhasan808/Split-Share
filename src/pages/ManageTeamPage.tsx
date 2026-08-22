import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { SERVICE_PRESETS } from '../data/mockData';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Users,
  CreditCard,
  Lock,
  Settings,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  Key,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const GET_MANAGE_TEAM = gql`
  query GetManageTeam($id: ID!) {
    team(id: $id) {
      id
      name
      subscriptionName
      billingCycle
      totalCost
      maxMembers
      paymentMethod
      paymentNumber
      renewalDate
      ownerId
      members {
        role
        paymentStatus
        joinedAt
        user {
          id
          name
          avatar
          email
        }
      }
      joinRequests {
        id
        status
        message
        createdAt
        user {
          id
          name
          avatar
          email
        }
      }
      payments {
        id
        amount
        method
        transactionId
        status
        createdAt
        user {
          id
          name
          avatar
        }
      }
    }
    teamCredentials(teamId: $id) {
      emailOrUsername
      passwordEncrypted
      notes
    }
  }
`;

const APPROVE_JOIN = gql`mutation ApproveJoin($id: ID!) { approveJoinRequest(requestId: $id) }`;
const REJECT_JOIN = gql`mutation RejectJoin($id: ID!) { rejectJoinRequest(requestId: $id) }`;
const VERIFY_PAYMENT = gql`mutation VerifyPayment($id: ID!) { verifyPayment(paymentId: $id) }`;
const REJECT_PAYMENT = gql`mutation RejectPayment($id: ID!) { rejectPayment(paymentId: $id) }`;
const REMOVE_MEMBER = gql`mutation RemoveMember($teamId: ID!, $userId: ID!) { removeMember(teamId: $teamId, userId: $userId) }`;
const DELETE_TEAM = gql`mutation DeleteTeam($id: ID!) { deleteTeam(id: $id) }`;
const UPDATE_CREDENTIALS = gql`
  mutation UpdateCredentials($teamId: ID!, $emailOrUsername: String!, $passwordEncrypted: String!, $notes: String) {
    updateCredentials(teamId: $teamId, emailOrUsername: $emailOrUsername, passwordEncrypted: $passwordEncrypted, notes: $notes) {
      id
    }
  }
`;

export const ManageTeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'requests' | 'billing' | 'credentials' | 'settings'>('overview');

  const { data: rawData, loading, error, refetch } = useQuery(GET_MANAGE_TEAM, {
    variables: { id: teamId },
    fetchPolicy: 'network-only',
    skip: !teamId
  });
  const data: any = rawData;

  const [approveJoin] = useMutation(APPROVE_JOIN, { onCompleted: () => refetch() });
  const [rejectJoin] = useMutation(REJECT_JOIN, { onCompleted: () => refetch() });
  const [verifyPaymentReq] = useMutation(VERIFY_PAYMENT, { onCompleted: () => refetch() });
  const [rejectPaymentReq] = useMutation(REJECT_PAYMENT, { onCompleted: () => refetch() });
  const [removeMember] = useMutation(REMOVE_MEMBER, { onCompleted: () => refetch() });
  const [deleteTeamReq] = useMutation(DELETE_TEAM, { onCompleted: () => navigate('/my-teams') });
  const [updateCreds] = useMutation(UPDATE_CREDENTIALS, { onCompleted: () => { alert('Credentials saved!'); refetch(); } });

  // Form states for credentials editing
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credNotes, setCredNotes] = useState('');

  // Set form defaults once data loads
  React.useEffect(() => {
    if (data?.teamCredentials) {
      setCredUsername(data.teamCredentials.emailOrUsername || '');
      setCredPassword(data.teamCredentials.passwordEncrypted || '');
      setCredNotes(data.teamCredentials.notes || '');
    }
  }, [data?.teamCredentials]);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const team = useMemo(() => {
    if (!data?.team) return null;
    const t = data.team;
    const preset = SERVICE_PRESETS.find(p => p.name === t.subscriptionName);
    return {
      ...t,
      serviceLogo: preset?.logo || '✨',
      serviceName: t.subscriptionName,
      currentMembersCount: t.members?.length || 1,
      costPerMemberBDT: Math.round(t.totalCost / (t.maxMembers || 1)),
      nextRenewalDate: t.renewalDate
    };
  }, [data]);

  if (loading) return <div className="p-10 text-center">Loading management dashboard...</div>;
  if (error) return <div className="p-10 text-center text-rose-500">Error: {error.message}</div>;

  if (!team) {
    return (
      <div className="flex max-w-7xl mx-auto w-full px-4 py-16">
        <Sidebar />
        <main className="flex-1 text-center py-12">
          <h2 className="text-xl font-bold">Team not found</h2>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/my-teams')}>
            Back to My Teams
          </Button>
        </main>
      </div>
    );
  }

  const isOwner = currentUser?.id === team.ownerId || currentUser?.role === 'ADMIN';
  if (!isOwner) {
    return (
      <div className="flex max-w-7xl mx-auto w-full px-4 py-16">
        <Sidebar />
        <main className="flex-1 text-center py-12">
          <h2 className="text-xl font-bold text-rose-600">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-1">Only the team owner can access the owner management control panel.</p>
        </main>
      </div>
    );
  }

  const teamJoinReqs = (team.joinRequests || []).filter((r: any) => r.status === 'PENDING');
  const teamPayments = (team.payments || []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreds({ variables: { teamId: team.id, emailOrUsername: credUsername, passwordEncrypted: credPassword, notes: credNotes } });
  };

  const handleDeleteTeamConfirm = () => {
    deleteTeamReq({ variables: { id: team.id } });
    setShowDeleteModal(false);
  };

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'My Teams', href: '/my-teams' }, { label: `Manage: ${team.name}` }]} />

        {/* Header Summary Card */}
        <Card className="p-6 gradient-bg text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl p-3 bg-white/10 rounded-2xl backdrop-blur">{team.serviceLogo}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase">
                    Owner Control Panel
                  </span>
                  <Badge variant={team.currentMembersCount >= team.maxMembers ? 'full' : 'active'} size="sm">
                    {team.currentMembersCount} / {team.maxMembers} Members
                  </Badge>
                </div>
                <h1 className="text-2xl font-extrabold mt-1">{team.name}</h1>
                <p className="text-xs text-indigo-200">{team.serviceName} • ৳{team.costPerMemberBDT} per slot</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => navigate(`/team/${team.id}`)}>
              Public Preview →
            </Button>
          </div>
        </Card>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Members ({team.members.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap relative ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Join Requests
            {teamJoinReqs.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {teamJoinReqs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Billing History
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Shared Credentials 🔑
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Settings & Delete
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Team Performance Summary</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Total Subscription Cost</span>
                  <span className="font-bold">৳{team.totalCost} / month</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Host Collected Revenue</span>
                  <span className="font-bold text-emerald-600">৳{team.costPerMemberBDT * team.members.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Next Renewal Date</span>
                  <span className="font-bold">{new Date(team.nextRenewalDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Payment Collection Number</span>
                  <span className="font-bold">{team.paymentMethod}: {team.paymentNumber}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('requests')}>
                  Review Pending Join Requests ({teamJoinReqs.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('billing')}>
                  Audit bKash TxIDs
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('credentials')}>
                  Update Shared Login Password
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Members Roster */}
        {activeTab === 'members' && (
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Member Roster</h3>
            <div className="flex flex-col gap-3">
              {team.members.map((member: any) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img src={member.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={member.user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{member.user.name}</span>
                        {member.user.id === team.ownerId && <Badge variant="purple" size="sm">Host</Badge>}
                      </h4>
                      <p className="text-[10px] text-slate-500">{member.user.email} • Joined {new Date(Number(member.joinedAt)).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={member.paymentStatus === 'PAID' ? 'paid' : 'pending'} size="sm">
                      {member.paymentStatus.toUpperCase()}
                    </Badge>
                    {member.user.id !== team.ownerId && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeMember({ variables: { teamId: team.id, userId: member.user.id } })}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 3: Join Requests */}
        {activeTab === 'requests' && (
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Join Requests</h3>
            {teamJoinReqs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No pending join requests for this team.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {teamJoinReqs.map((req: any) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img src={req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={req.user.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{req.user.name}</h4>
                        <p className="text-[10px] text-slate-500">{req.user.email} • Sent {new Date(Number(req.createdAt)).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 italic">
                          "{req.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button size="sm" variant="outline" onClick={() => rejectJoin({ variables: { id: req.id } })}>
                        Decline
                      </Button>
                      <Button size="sm" variant="success" onClick={() => approveJoin({ variables: { id: req.id } })}>
                        Approve & Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Tab 4: Billing Verification */}
        {activeTab === 'billing' && (
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated SSLCommerz Payments</h3>
            <div className="flex flex-col gap-4">
              {teamPayments.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No submitted payment proofs yet.</p>
              ) : (
                teamPayments.map((pay: any) => (
                  <div
                    key={pay.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img src={pay.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={pay.user.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{pay.user.name}</h4>
                          <Badge variant={pay.status === 'VERIFIED' ? 'verified' : pay.status === 'REJECTED' ? 'rejected' : 'pending'} size="sm">
                            {pay.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {pay.method} TxID: <span className="font-mono">{pay.transactionId}</span> (৳{pay.amount})
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Submitted {new Date(Number(pay.createdAt)).toLocaleDateString()}</p>
                      </div>
                    </div>

                    }>
                          Reject
                        </Button>
                        <Button size="sm" variant="success" onClick={() => verifyPaymentReq({ variables: { id: pay.id } })}>
                          Verify & Grant Credentials
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Tab 5: Shared Credentials Manager */}
        {activeTab === 'credentials' && (
          <Card className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                <span>Shared Subscription Credentials Vault</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter login credentials for Netflix/Spotify/ChatGPT. Revealed strictly to verified paying members.
              </p>
            </div>

            <form onSubmit={handleSaveCredentials} className="flex flex-col gap-4 max-w-lg">
              <Input
                label="Account Email / Username"
                value={credUsername}
                onChange={e => setCredUsername(e.target.value)}
                placeholder="shared.account@gmail.com"
                required
              />

              <Input
                label="Account Password"
                type="text"
                value={credPassword}
                onChange={e => setCredPassword(e.target.value)}
                placeholder="SharedPassword123!"
                required
              />

              <Textarea
                label="Additional Login Notes / Screen Instructions"
                rows={3}
                value={credNotes}
                onChange={e => setCredNotes(e.target.value)}
                placeholder="Profile 2 is assigned to John. Profile 3 is assigned to Sarah. Please do not change PINs!"
              />

              <Button type="submit" variant="primary" className="w-fit">
                Save & Update Credentials
              </Button>
            </form>
          </Card>
        )}

        {/* Tab 6: Settings & Delete */}
        {activeTab === 'settings' && (
          <Card className="p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">Danger Zone: Delete Team</h3>
              <p className="text-xs text-slate-500 mt-1">
                Permanently delete this subscription team and remove all member slots.
              </p>
            </div>

            <Button variant="danger" className="w-fit" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Team Permanently
            </Button>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Team Confirmation"
        subtitle="This action cannot be undone."
      >
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to delete <span className="font-bold">{team.name}</span>? All members will be removed and open requests canceled.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteTeamConfirm}>
            Yes, Delete Team
          </Button>
        </div>
      </Modal>
    </div>
  );
};
