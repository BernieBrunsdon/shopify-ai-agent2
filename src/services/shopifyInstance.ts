// src/services/shopifyInstance.ts
import { ShopifyService } from '../lib/shopify';

export const shopify = new ShopifyService({
  shopDomain: import.meta.env.VITE_SHOPIFY_STORE,
  clientId: import.meta.env.VITE_SHOPIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SHOPIFY_CLIENT_SECRET
});