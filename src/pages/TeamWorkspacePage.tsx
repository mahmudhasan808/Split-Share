import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { SERVICE_PRESETS } from '../data/mockData';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Send,
  Upload
} from 'lucide-react';

const GET_WORKSPACE_TEAM = gql`
  query GetWorkspaceTeam($id: ID!) {
    team(id: $id) {
      id
      name
      subscriptionName
      rules
      totalCost
      maxMembers
      paymentMethod
      paymentNumber
      ownerId
      createdAt
      owner {
        name
      }
      members {
        paymentStatus
        joinedAt
        user {
          id
          name
          avatar
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

const SUBMIT_PAYMENT = gql`
  mutation SubmitPayment($teamId: ID!, $amount: Float!, $method: String!, $transactionId: String) {
    submitPaymentProof(teamId: $teamId, amount: $amount, method: $method, transactionId: $transactionId) {
      id
      status
    }
  }
`;

export const TeamWorkspacePage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'members' | 'credentials' | 'activity'>('overview');
  const [showPassword, setShowPassword] = useState(false);

  // Billing form state
  const [txIdInput, setTxIdInput] = useState('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const { data: rawData, loading, error, refetch } = useQuery(GET_WORKSPACE_TEAM, {
    variables: { id: teamId },
    fetchPolicy: 'network-only',
    skip: !teamId
  });
  const data: any = rawData;

  const [submitPayment] = useMutation(SUBMIT_PAYMENT, { onCompleted: () => { alert("Payment proof submitted!"); refetch(); }});

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
      ownerName: t.owner?.name || 'Host',
      rules: t.rules ? t.rules.split('\n').filter(Boolean) : [],
      credentials: data.teamCredentials
    };
  }, [data]);

  if (loading) return <div className="p-10 text-center">Loading workspace...</div>;
  if (error) return <div className="p-10 text-center text-rose-500">Error: {error.message}</div>;

  if (!team) {
    return (
      <div className="flex max-w-7xl mx-auto w-full px-4 py-16">
        <Sidebar />
        <main className="flex-1 text-center py-12">
          <h2 className="text-xl font-bold">Team not found</h2>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/browse')}>
            Browse Available Teams
          </Button>
        </main>
      </div>
    );
  }

  const myMemberInfo = team.members.find((m: any) => m.user.id === currentUser?.id);
  
  if (!myMemberInfo && currentUser?.id !== team.ownerId) {
    return (
      <div className="flex max-w-7xl mx-auto w-full px-4 py-16">
        <Sidebar />
        <main className="flex-1 text-center py-12">
          <h2 className="text-xl font-bold text-rose-600">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-2">You are not a member of this team.</p>
        </main>
      </div>
    );
  }

  const isPaid = myMemberInfo?.paymentStatus === 'PAID' || currentUser?.id === team.ownerId;
  const myPayments = (team.payments || []).filter((p: any) => p.user.id === currentUser?.id);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };


  const handleSSLCommerzInit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/payments/sslcommerz/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('splitshare_token')}`
        },
        body: JSON.stringify({ teamId: team.id, amount: team.costPerMemberBDT })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initialize SSLCommerz payment');
      }
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'My Teams', href: '/my-teams' }, { label: `Workspace: ${team.name}` }]} />

        {/* Header Summary */}
        <Card className="p-6 gradient-bg text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl p-3 bg-white/10 rounded-2xl backdrop-blur">{team.serviceLogo}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase">
                    Member Workspace
                  </span>
                  {currentUser?.id !== team.ownerId && (
                    <Badge variant={isPaid ? 'paid' : 'pending'} size="sm">
                      {isPaid ? 'Payment Verified' : 'Payment Due'}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold mt-1">{team.name}</h1>
                <p className="text-xs text-indigo-200">{team.serviceName} • Host: {team.ownerName}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold block">Monthly Due</span>
              <span className="text-2xl font-extrabold">৳{team.costPerMemberBDT}</span>
            </div>
          </div>
        </Card>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Credentials Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Member Roster ({team.members.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {team.rules.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Team Guidelines & Rules</h3>
                <ul className="flex flex-col gap-2">
                  {team.rules.map((rule: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {!isPaid && (
              <Card className="p-6 bg-amber-500/10 border-amber-500/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Credentials Locked</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                      Submit your ৳{team.costPerMemberBDT} payment to unlock the shared subscription credentials.
                    </p>
                    <Button size="sm" variant="primary" className="mt-3" onClick={() => setActiveTab('billing')}>
                      Submit TxID Now →
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tab 2: Billing & Payment Proof Submission */}
        {activeTab === 'billing' && (
          <div className="flex flex-col gap-6">
            <Card className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800">
               <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-indigo-500" /> Automatic Payment (SSLCommerz Sandbox)
               </h3>
               <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mb-4 max-w-lg">
                 Pay securely using Credit Card, bKash, or Mobile Banking via the SSLCommerz dummy gateway. Your credentials will unlock instantly upon success.
               </p>
               <Button variant="primary" onClick={handleSSLCommerzInit} leftIcon={<CreditCard className="w-4 h-4" />}>
                 Pay ?{team.costPerMemberBDT} via SSLCommerz
               </Button>
            </Card>
            
            

            {/* My Submissions History */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">My Payment History</h3>
              <div className="flex flex-col gap-2">
                {myPayments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No payments submitted yet.</p>
                ) : (
                  myPayments.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{p.transactionId}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(Number(p.createdAt)).toLocaleString()}</span>
                      </div>
                      <Badge variant={p.status === 'VERIFIED' ? 'verified' : p.status === 'REJECTED' ? 'rejected' : 'pending'} size="sm">
                        {p.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Credentials Vault (Revealed when verified) */}
        {activeTab === 'credentials' && (
          <Card className="p-6">
            {!isPaid ? (
              <div className="text-center py-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Credentials Locked</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                  Shared account login details are strictly hidden until host {team.ownerName} verifies your {team.paymentMethod} payment.
                </p>
                <Button size="sm" variant="primary" onClick={() => setActiveTab('billing')}>
                  Submit Payment Proof →
                </Button>
              </div>
            ) : !team.credentials ? (
              <p className="text-xs text-slate-500 py-6 text-center">Host has not uploaded login details yet.</p>
            ) : (
              <div className="flex flex-col gap-4 max-w-md">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Payment Verified — Credentials Unlocked</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Email / Username</label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 mt-1">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {team.credentials.emailOrUsername}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(team.credentials?.emailOrUsername || '', 'Email')}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 mt-1">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {showPassword ? team.credentials.passwordEncrypted : '••••••••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(team.credentials?.passwordEncrypted || '', 'Password')}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {team.credentials.notes && (
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                      <span className="font-bold block mb-0.5">Host Notes:</span>
                      <span>{team.credentials.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tab 4: Members Roster */}
        {activeTab === 'members' && (
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Team Roster</h3>
            <div className="flex flex-col gap-3">
              {team.members.map((m: any) => (
                <div key={m.user.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={m.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={m.user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{m.user.name}</span>
                        {m.user.id === team.ownerId && <Badge variant="purple" size="sm">Host</Badge>}
                      </h4>
                      <p className="text-[10px] text-slate-500">Joined {new Date(Number(m.joinedAt)).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={m.paymentStatus === 'PAID' ? 'paid' : 'pending'} size="sm">
                    {m.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 5: Activity Audit Log */}
        {activeTab === 'activity' && (
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Team Audit Log</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex justify-between">
                <span>Team created by host {team.ownerName}</span>
                <span className="text-slate-400">{new Date(Number(team.createdAt)).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
