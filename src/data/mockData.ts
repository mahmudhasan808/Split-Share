import { User, ServicePreset, Team, Payment, JoinRequest, Notification, PlatformStats, PaymentReport } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_owner_1',
    name: 'Alex Rivera',
    email: 'alex@splitshare.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'owner',
    verified: true,
    phone: '+880 1711 998877',
    bio: 'Tech lead & subscription organizer. Managing Netflix, Spotify & ChatGPT teams.',
    reputation: 4.9,
    joinedDate: '2025-01-15',
    ownedTeamsCount: 3,
    joinedTeamsCount: 1,
    status: 'active'
  },
  {
    id: 'usr_member_1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'member',
    verified: true,
    phone: '+880 1812 345678',
    bio: 'Fullstack designer looking to save on software tools and streaming services.',
    reputation: 4.8,
    joinedDate: '2025-02-01',
    ownedTeamsCount: 0,
    joinedTeamsCount: 2,
    status: 'active'
  },
  {
    id: 'usr_admin_1',
    name: 'Sarah Connor',
    email: 'admin@splitshare.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    role: 'admin',
    verified: true,
    phone: '+880 1919 000111',
    bio: 'Platform administrator keeping SplitShare safe and smooth.',
    reputation: 5.0,
    joinedDate: '2024-11-10',
    ownedTeamsCount: 1,
    joinedTeamsCount: 3,
    status: 'active'
  },
  {
    id: 'usr_guest_1',
    name: 'Sam Wilson',
    email: 'sam@guest.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'guest',
    verified: false,
    phone: '+880 1611 223344',
    bio: 'New user exploring available teams.',
    reputation: 4.5,
    joinedDate: '2026-03-01',
    ownedTeamsCount: 0,
    joinedTeamsCount: 0,
    status: 'active'
  }
];

export const SERVICE_PRESETS: ServicePreset[] = [
  {
    id: 'srv_netflix',
    name: 'Netflix Premium 4K',
    category: 'Entertainment',
    logo: '🍿',
    defaultPriceBDT: 1400,
    defaultMaxMembers: 4,
    color: 'from-red-500 to-rose-700'
  },
  {
    id: 'srv_spotify',
    name: 'Spotify Family',
    category: 'Music',
    logo: '🎧',
    defaultPriceBDT: 990,
    defaultMaxMembers: 6,
    color: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'srv_chatgpt',
    name: 'ChatGPT Plus Team',
    category: 'AI & Tech',
    logo: '🤖',
    defaultPriceBDT: 2400,
    defaultMaxMembers: 3,
    color: 'from-emerald-600 to-cyan-800'
  },
  {
    id: 'srv_canva',
    name: 'Canva Pro Teams',
    category: 'Design',
    logo: '🎨',
    defaultPriceBDT: 1500,
    defaultMaxMembers: 5,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'srv_youtube',
    name: 'YouTube Premium Family',
    category: 'Entertainment',
    logo: '▶️',
    defaultPriceBDT: 1150,
    defaultMaxMembers: 5,
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'srv_adobe',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    logo: '✒️',
    defaultPriceBDT: 6500,
    defaultMaxMembers: 4,
    color: 'from-red-700 to-purple-800'
  },
  {
    id: 'srv_ms365',
    name: 'Microsoft 365 Family',
    category: 'Productivity',
    logo: '📊',
    defaultPriceBDT: 1200,
    defaultMaxMembers: 6,
    color: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'srv_disney',
    name: 'Disney+ Premium',
    category: 'Entertainment',
    logo: '🏰',
    defaultPriceBDT: 1300,
    defaultMaxMembers: 4,
    color: 'from-blue-700 to-sky-900'
  },
  {
    id: 'srv_prime',
    name: 'Amazon Prime Video',
    category: 'Entertainment',
    logo: '🎬',
    defaultPriceBDT: 950,
    defaultMaxMembers: 3,
    color: 'from-sky-500 to-blue-800'
  },
  {
    id: 'srv_crunchyroll',
    name: 'Crunchyroll Fan Mega',
    category: 'Entertainment',
    logo: '🍥',
    defaultPriceBDT: 850,
    defaultMaxMembers: 4,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'srv_custom',
    name: 'Custom Service',
    category: 'Custom',
    logo: '⚡',
    defaultPriceBDT: 1000,
    defaultMaxMembers: 4,
    color: 'from-purple-500 to-indigo-600'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_netflix_4k',
    name: 'Cinephiles 4K Ultra HD',
    serviceName: 'Netflix Premium 4K',
    category: 'Entertainment',
    serviceLogo: '🍿',
    description: 'Shared 4K UHD Profile slot. 1 person per profile. Auto-renews on the 1st of every month via bKash.',
    rules: ['Only log in on 1 designated screen', 'Do not alter profile names or PINs', 'Pay before the 28th of every month'],
    totalCostBDT: 1400,
    costPerMemberBDT: 350,
    billingCycle: 'monthly',
    maxMembers: 4,
    currentMembersCount: 3,
    ownerId: 'usr_owner_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    ownerPhone: '01711998877',
    paymentMethod: 'bKash',
    paymentNumber: '01711998877',
    nextRenewalDate: '2026-09-01',
    visibility: 'public',
    status: 'active',
    members: [
      { userId: 'usr_owner_1', name: 'Alex Rivera', email: 'alex@splitshare.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-01-15', paymentStatus: 'paid' },
      { userId: 'usr_member_1', name: 'John Doe', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-02-01', paymentStatus: 'paid', lastPaymentTxId: 'BK9928172X', lastPaymentDate: '2026-08-01' },
      { userId: 'usr_admin_1', name: 'Sarah Connor', email: 'admin@splitshare.io', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-02-10', paymentStatus: 'paid' }
    ],
    credentials: {
      id: 'cred_1',
      teamId: 'team_netflix_4k',
      emailOrUsername: 'cinephile.shares@gmail.com',
      passwordEncrypted: 'SharedFlix#2026!',
      notes: 'Profile 3 (John), Profile 4 (Sarah). Do not edit PINs!',
      lastUpdated: '2026-08-01'
    },
    createdAt: '2025-01-15'
  },
  {
    id: 'team_chatgpt_plus',
    name: 'AI Developers & Creators',
    serviceName: 'ChatGPT Plus Team',
    category: 'AI & Tech',
    serviceLogo: '🤖',
    description: 'Shared GPT-4o & o1 access for power prompts, coders, and research. 3 slots total.',
    rules: ['Keep chat logs clean or use private temporary chats', 'No automated bot spamming'],
    totalCostBDT: 2400,
    costPerMemberBDT: 800,
    billingCycle: 'monthly',
    maxMembers: 3,
    currentMembersCount: 2,
    ownerId: 'usr_owner_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    ownerPhone: '01711998877',
    paymentMethod: 'Nagad',
    paymentNumber: '01711998877',
    nextRenewalDate: '2026-09-05',
    visibility: 'public',
    status: 'active',
    members: [
      { userId: 'usr_owner_1', name: 'Alex Rivera', email: 'alex@splitshare.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-03-01', paymentStatus: 'paid' },
      { userId: 'usr_member_1', name: 'John Doe', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-03-10', paymentStatus: 'pending' }
    ],
    credentials: {
      id: 'cred_2',
      teamId: 'team_chatgpt_plus',
      emailOrUsername: 'ai.devs.split@gmail.com',
      passwordEncrypted: 'GPTPlus#Super2026',
      notes: 'Use 2FA code from Alex if prompt occurs.',
      lastUpdated: '2026-08-05'
    },
    createdAt: '2025-03-01'
  },
  {
    id: 'team_canva_pro',
    name: 'Design Studio Squad',
    serviceName: 'Canva Pro Teams',
    category: 'Design',
    serviceLogo: '🎨',
    description: 'Unlimited Canva Pro assets, brand kits, and background removers.',
    rules: ['Use your own workspace folder inside Canva', 'Do not delete global brand kits'],
    totalCostBDT: 1500,
    costPerMemberBDT: 300,
    billingCycle: 'monthly',
    maxMembers: 5,
    currentMembersCount: 5,
    ownerId: 'usr_admin_1',
    ownerName: 'Sarah Connor',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    ownerPhone: '01919000111',
    paymentMethod: 'bKash',
    paymentNumber: '01919000111',
    nextRenewalDate: '2026-08-30',
    visibility: 'public',
    status: 'full',
    members: [
      { userId: 'usr_admin_1', name: 'Sarah Connor', email: 'admin@splitshare.io', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-01-10', paymentStatus: 'paid' },
      { userId: 'usr_owner_1', name: 'Alex Rivera', email: 'alex@splitshare.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-01-12', paymentStatus: 'paid' }
    ],
    createdAt: '2025-01-10'
  },
  {
    id: 'team_spotify_family',
    name: 'Acoustic Vibers Family',
    serviceName: 'Spotify Family',
    category: 'Music',
    serviceLogo: '🎧',
    description: 'Ad-free high fidelity music streaming on your personal Spotify account via invitation link.',
    rules: ['Must set address to match host address provided upon join'],
    totalCostBDT: 990,
    costPerMemberBDT: 165,
    billingCycle: 'monthly',
    maxMembers: 6,
    currentMembersCount: 4,
    ownerId: 'usr_owner_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    ownerPhone: '01711998877',
    paymentMethod: 'bKash',
    paymentNumber: '01711998877',
    nextRenewalDate: '2026-09-12',
    visibility: 'public',
    status: 'active',
    members: [
      { userId: 'usr_owner_1', name: 'Alex Rivera', email: 'alex@splitshare.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', joinedAt: '2025-02-15', paymentStatus: 'paid' }
    ],
    createdAt: '2025-02-15'
  }
];

export const INITIAL_JOIN_REQUESTS: JoinRequest[] = [
  {
    id: 'req_101',
    teamId: 'team_netflix_4k',
    teamName: 'Cinephiles 4K Ultra HD',
    userId: 'usr_guest_1',
    userName: 'Sam Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    userEmail: 'sam@guest.com',
    message: 'Hey Alex! I would love to join your 4K Netflix profile. Ready to send payment via bKash immediately.',
    createdAt: '2026-08-16 10:30 AM',
    status: 'pending'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_8801',
    teamId: 'team_netflix_4k',
    teamName: 'Cinephiles 4K Ultra HD',
    serviceName: 'Netflix Premium 4K',
    userId: 'usr_member_1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    amountBDT: 350,
    paymentMethod: 'bKash',
    transactionId: 'BK9928172X',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    status: 'verified',
    submittedAt: '2026-08-01 11:15 AM',
    verifiedAt: '2026-08-01 12:00 PM'
  },
  {
    id: 'pay_8802',
    teamId: 'team_chatgpt_plus',
    teamName: 'AI Developers & Creators',
    serviceName: 'ChatGPT Plus Team',
    userId: 'usr_member_1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    amountBDT: 800,
    paymentMethod: 'Nagad',
    transactionId: 'NG7739011Z',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    submittedAt: '2026-08-16 09:20 AM'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_owner_1',
    title: 'New Join Request',
    message: 'Sam Wilson requested to join Cinephiles 4K Ultra HD.',
    type: 'join_request',
    read: false,
    createdAt: '10 mins ago',
    link: '/manage/team_netflix_4k'
  },
  {
    id: 'notif_2',
    userId: 'usr_owner_1',
    title: 'Payment Proof Submitted',
    message: 'John Doe submitted Nagad TxID (NG7739011Z) for ChatGPT Plus Team.',
    type: 'payment_reminder',
    read: false,
    createdAt: '1 hour ago',
    link: '/manage/team_chatgpt_plus'
  },
  {
    id: 'notif_3',
    userId: 'usr_member_1',
    title: 'Payment Verified 🎉',
    message: 'Your payment of 350 BDT for Netflix Premium 4K has been verified by Alex.',
    type: 'payment_verified',
    read: true,
    createdAt: 'Yesterday',
    link: '/workspace/team_netflix_4k'
  }
];

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalUsers: 1420,
  totalActiveTeams: 385,
  totalVolumeBDT: 485000,
  monthlyRevenueBDT: 24250,
  pendingJoinRequests: 14,
  pendingPaymentsCount: 8
};

export const INITIAL_PAYMENT_REPORTS: PaymentReport[] = [
  {
    id: 'rep_1',
    reporterId: 'usr_member_1',
    reporterName: 'John Doe',
    teamId: 'team_canva_pro',
    teamName: 'Design Studio Squad',
    reason: 'Delayed Credential Update',
    details: 'Owner took 48 hours to update password after cycle start.',
    status: 'resolved',
    createdAt: '2026-08-05'
  }
];
