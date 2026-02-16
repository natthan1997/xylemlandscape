import Stripe from 'stripe';
import { requireEnv } from './env';

export function getStripe() {
  const key = requireEnv('STRIPE_SECRET_KEY');
  return new Stripe(key, {
    // Keep API version stable across deployments
    apiVersion: '2025-02-24.acacia',
  });
}
