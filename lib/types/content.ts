export interface ContentMedia {
  id: string;
  type: 'video' | 'audio';
  title: string;
  description?: string;
  url: string;
  duration?: number;
  thumbnailUrl?: string;
  subscriptionLevel: 'free' | 'premium';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  tierId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  stripePaymentId?: string;
  createdAt: string;
}