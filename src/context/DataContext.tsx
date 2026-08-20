import React, { createContext, useContext, useState } from 'react';
import { Team, JoinRequest, Payment, Notification, User, PlatformStats, CredentialItem } from '../types';
import {
  INITIAL_TEAMS,
  INITIAL_JOIN_REQUESTS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_PLATFORM_STATS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface DataContextType {
  teams: Team[];
  joinRequests: JoinRequest[];
  payments: Payment[];
  notifications: Notification[];
  users: User[];
  stats: PlatformStats;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'currentMembersCount' | 'status' | 'members'>) => Team;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  deleteTeam: (teamId: string) => void;
  requestToJoinTeam: (teamId: string, user: User, message: string) => void;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  submitPaymentProof: (teamId: string, user: User, amountBDT: number, method: 'bKash' | 'Nagad' | 'Bank' | 'SSLCommerz', txId: string, proofUrl?: string) => void;
  verifyPayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, reason: string) => void;
  updateCredentials: (teamId: string, emailOrUsername: string, passwordEncrypted: string, notes?: string) => void;
  removeTeamMember: (teamId: string, userId: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  clearNotifications: () => void;
  suspendUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(INITIAL_JOIN_REQUESTS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [stats, setStats] = useState<PlatformStats>(INITIAL_PLATFORM_STATS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'currentMembersCount' | 'status' | 'members'>): Team => {
    const newId = `team_${Date.now()}`;
    const newTeam: Team = {
      ...teamData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      currentMembersCount: 1,
      status: 'active',
      members: [
        {
          userId: teamData.ownerId,
          name: teamData.ownerName,
          email: `${teamData.ownerName.toLowerCase().replace(/\s+/g, '')}@splitshare.io`,
          avatar: teamData.ownerAvatar,
          joinedAt: new Date().toISOString().split('T')[0],
          paymentStatus: 'paid'
        }
      ]
    };

    setTeams(prev => [newTeam, ...prev]);
    setStats(prev => ({ ...prev, totalActiveTeams: prev.totalActiveTeams + 1 }));
    addToast('success', 'Team Created 🎉', `Your team "${newTeam.name}" is now live!`);
    return newTeam;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, ...updates } : t)));
    addToast('info', 'Team Updated', 'Team settings have been saved successfully.');
  };

  const deleteTeam = (teamId: string) => {
    const target = teams.find(t => t.id === teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setStats(prev => ({ ...prev, totalActiveTeams: Math.max(0, prev.totalActiveTeams - 1) }));
    addToast('error', 'Team Deleted', `Team "${target?.name || ''}" has been removed.`);
  };

  const requestToJoinTeam = (teamId: string, user: User, message: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    // Check existing request
    const existing = joinRequests.find(r => r.teamId === teamId && r.userId === user.id && r.status === 'pending');
    if (existing) {
      addToast('info', 'Already Requested', 'Your request to join this team is currently pending approval.');
      return;
    }

    const newRequest: JoinRequest = {
      id: `req_${Date.now()}`,
      teamId,
      teamName: team.name,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userEmail: user.email,
      message,
      createdAt: new Date().toLocaleString(),
      status: 'pending'
    };

    setJoinRequests(prev => [newRequest, ...prev]);

    // Send notification to team owner
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: team.ownerId,
      title: 'New Join Request',
      message: `${user.name} requested to join ${team.name}.`,
      type: 'join_request',
      read: false,
      createdAt: 'Just now',
      link: `/manage/${teamId}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast('success', 'Request Sent! 📩', `Your request to join ${team.name} was sent to ${team.ownerName}.`);
  };

  const approveJoinRequest = (requestId: string) => {
    const req = joinRequests.find(r => r.id === requestId);
    if (!req) return;

    const team = teams.find(t => t.id === req.teamId);
    if (!team) return;

    // Add user to team members
    const newMember = {
      userId: req.userId,
      name: req.userName,
      email: req.userEmail,
      avatar: req.userAvatar,
      joinedAt: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending' as const
    };

    setTeams(prev =>
      prev.map(t => {
        if (t.id === req.teamId) {
          const count = t.members.length + 1;
          return {
            ...t,
            currentMembersCount: count,
            status: count >= t.maxMembers ? 'full' : t.status,
            members: [...t.members, newMember]
          };
        }
        return t;
      })
    );

    // Update request status
    setJoinRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'approved' } : r)));

    // Notify requesting user
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: req.userId,
      title: 'Request Approved! 🚀',
      message: `Your request to join ${team.name} was approved! Submit your payment to unlock credentials.`,
      type: 'join_request',
      read: false,
      createdAt: 'Just now',
      link: `/workspace/${team.id}`
    };
    setNotifications(prev => [notif, ...prev]);

    addToast('success', 'Member Approved! Welcome', `${req.userName} has been added to ${team.name}.`);
  };

  const rejectJoinRequest = (requestId: string) => {
    setJoinRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' } : r)));
    addToast('info', 'Request Declined', 'Join request was declined.');
  };

  const submitPaymentProof = (
    teamId: string,
    user: User,
    amountBDT: number,
    method: 'bKash' | 'Nagad' | 'Bank' | 'SSLCommerz',
    txId: string,
    proofUrl?: string
  ) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      teamId,
      teamName: team.name,
      serviceName: team.serviceName,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      amountBDT,
      paymentMethod: method,
      transactionId: txId,
      proofImageUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
      status: 'pending',
      submittedAt: new Date().toLocaleString()
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update member payment status in team
    setTeams(prev =>
      prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            members: t.members.map(m => (m.userId === user.id ? { ...m, paymentStatus: 'pending', lastPaymentTxId: txId } : m))
          };
        }
        return t;
      })
    );

    // Notify owner
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: team.ownerId,
        title: 'New Payment Verification Request',
        message: `${user.name} submitted ${method} TxID (${txId}) for ${team.name}.`,
        type: 'payment_reminder',
        read: false,
        createdAt: 'Just now',
        link: `/manage/${teamId}`
      },
      ...prev
    ]);

    addToast('success', 'Payment Submitted 💳', `Transaction ID ${txId} submitted for review!`);
  };

  const verifyPayment = (paymentId: string) => {
    const targetPay = payments.find(p => p.id === paymentId);
    if (!targetPay) return;

    setPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, status: 'verified', verifiedAt: new Date().toLocaleString() } : p))
    );

    // Update team member status to paid
    setTeams(prev =>
      prev.map(t => {
        if (t.id === targetPay.teamId) {
          return {
            ...t,
            members: t.members.map(m =>
              m.userId === targetPay.userId
                ? { ...m, paymentStatus: 'paid', lastPaymentTxId: targetPay.transactionId, lastPaymentDate: new Date().toISOString().split('T')[0] }
                : m
            )
          };
        }
        return t;
      })
    );

    // Notify member
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: targetPay.userId,
        title: 'Payment Verified! ✅',
        message: `Your payment of ${targetPay.amountBDT} BDT for ${targetPay.teamName} was verified. Credentials are unlocked!`,
        type: 'payment_verified',
        read: false,
        createdAt: 'Just now',
        link: `/workspace/${targetPay.teamId}`
      },
      ...prev
    ]);

    addToast('success', 'Payment Verified!', `Marked payment of ${targetPay.userName} as verified.`);
  };

  const rejectPayment = (paymentId: string, reason: string) => {
    const targetPay = payments.find(p => p.id === paymentId);
    if (!targetPay) return;

    setPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    );

    addToast('error', 'Payment Rejected', `Payment for ${targetPay.userName} rejected.`);
  };

  const updateCredentials = (teamId: string, emailOrUsername: string, passwordEncrypted: string, notes?: string) => {
    const newCred: CredentialItem = {
      id: `cred_${Date.now()}`,
      teamId,
      emailOrUsername,
      passwordEncrypted,
      notes,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, credentials: newCred } : t))
    );

    // Notify members
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.members.forEach(m => {
        if (m.userId !== team.ownerId) {
          setNotifications(prev => [
            {
              id: `notif_${Date.now()}_${m.userId}`,
              userId: m.userId,
              title: 'Subscription Credentials Updated 🔑',
              message: `Shared account credentials for ${team.name} have been updated by the owner.`,
              type: 'credential_update',
              read: false,
              createdAt: 'Just now',
              link: `/workspace/${teamId}`
            },
            ...prev
          ]);
        }
      });
    }

    addToast('success', 'Credentials Saved 🔑', 'Shared account credentials updated successfully.');
  };

  const removeTeamMember = (teamId: string, userId: string) => {
    setTeams(prev =>
      prev.map(t => {
        if (t.id === teamId) {
          const updatedMembers = t.members.filter(m => m.userId !== userId);
          return {
            ...t,
            members: updatedMembers,
            currentMembersCount: updatedMembers.length,
            status: updatedMembers.length < t.maxMembers ? 'active' : t.status
          };
        }
        return t;
      })
    );
    addToast('info', 'Member Removed', 'User has been removed from the team.');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const suspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: 'suspended' } : u)));
    addToast('error', 'User Suspended', 'User status set to suspended.');
  };

  const unbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: 'active' } : u)));
    addToast('success', 'User Reactivated', 'User status set to active.');
  };

  return (
    <DataContext.Provider
      value={{
        teams,
        joinRequests,
        payments,
        notifications,
        users,
        stats,
        toasts,
        addToast,
        removeToast,
        createTeam,
        updateTeam,
        deleteTeam,
        requestToJoinTeam,
        approveJoinRequest,
        rejectJoinRequest,
        submitPaymentProof,
        verifyPayment,
        rejectPayment,
        updateCredentials,
        removeTeamMember,
        markNotificationAsRead,
        clearNotifications,
        suspendUser,
        unbanUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
