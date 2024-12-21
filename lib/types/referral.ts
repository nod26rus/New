export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  status: 'pending' | 'rewarded' | 'expired';
  rewardType: string;
  rewardAmount: number;
  createdAt: string;
}

export interface PartnerLink {
  id: string;
  userId: string;
  code: string;
  description?: string;
  rewardConfig: {
    signupReward: number;
    conversionReward: number;
    revenueShare: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerStats {
  id: string;
  partnerLinkId: string;
  clicks: number;
  signups: number;
  conversions: number;
  revenue: number;
  date: string;
}