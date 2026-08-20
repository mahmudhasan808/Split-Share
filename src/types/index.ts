export type UserRole = 'guest' | 'member' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  verified: boolean;
  phone?: string;
  bio?: string;
  reputation: number; // 0 to 5 rating
  joinedDate: string;
  ownedTeamsCount: number;
  joinedTeamsCount: number;
  status: 'active' | 'suspended';
}

export type SubscriptionCategory = 'Entertainment' | 'Productivity' | 'Design' | 'AI & Tech' | 'Music' | 'Custom';

export interface ServicePreset {
  id: string;
  name: string;
  category: SubscriptionCategory;
  logo: string;
  defaultPriceBDT: number;
  defaultMaxMembers: number;
  color: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentTxId?: string;
  lastPaymentDate?: string;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CredentialItem {
  id: string;
  teamId: string;
  emailOrUsername: string;
  passwordEncrypted: string;
  notes?: string;
  lastUpdated: string;
}

export interface Team {
  id: string;
  name: string;
  serviceName: string;
  category: SubscriptionCategory;
  serviceLogo: string;
  description: string;
  rules: string[];
  totalCostBDT: number; // e.g. 1400 BDT
  costPerMemberBDT: number; // totalCostBDT / maxMembers
  billingCycle: 'monthly' | 'yearly';
  maxMembers: number;
  currentMembersCount: number;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'SSLCommerz';
  paymentNumber: string; // bKash or Nagad number
  nextRenewalDate: string;
  visibility: 'public' | 'private';
  status: 'active' | 'full' | 'paused';
  members: TeamMember[];
  credentials?: CredentialItem;
  createdAt: string;
}

export interface Payment {
  id: string;
  teamId: string;
  teamName: string;
  serviceName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amountBDT: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'SSLCommerz';
  transactionId: string;
  proofImageUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'join_request' | 'payment_reminder' | 'payment_verified' | 'credential_update' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalActiveTeams: number;
  totalVolumeBDT: number;
  monthlyRevenueBDT: number;
  pendingJoinRequests: number;
  pendingPaymentsCount: number;
}

export interface PaymentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  teamId: string;
  teamName: string;
  reason: string;
  details: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}
