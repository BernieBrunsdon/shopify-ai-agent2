// src/lib/shopify.ts
export interface ShopifyConfig {
  shopDomain: string;
  clientId: string;
  clientSecret: string;
  apiVersion?: string;
}

export interface Shop {
  id: number;
  name: string;
  domain: string;
}

export interface Product {
  id: number;
  title: string;
  variants: Variant[];
}

interface Variant {
  id: number;
  price: string;
}

export class ShopifyService {
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  constructor(private config: ShopifyConfig) {
    this.apiVersion = config.apiVersion || '2024-04';
    this.baseUrl = `https://${config.shopDomain}/admin/api/${this.apiVersion}`;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.shopDomain || !this.config.clientId || !this.config.clientSecret) {
      throw new Error('Missing required Shopify configuration');
    }
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      headers: {
        'X-Shopify-Access-Token': this.config.clientSecret,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`Shopify API error: ${response.statusText}`);
    return response.json();
  }

  public async getShop(): Promise<Shop> {
    const { shop } = await this.request<{ shop: Shop }>('shop.json');
    return shop;
  }

  public async getProducts(): Promise<Product[]> {
    const { products } = await this.request<{ products: Product[] }>('products.json');
    return products;
  }
}