interface ShopifyConfig {
    shopDomain: string
    clientId: string
    clientSecret: string
    apiVersion?: string
  }
  
  export class ShopifyService {
    private readonly apiVersion: string
  
    constructor(private config: ShopifyConfig) {
      this.apiVersion = config.apiVersion || '2024-04'
    }
  
    async searchProducts(query: string): Promise<any> {
      const url = `https://${this.config.shopDomain}/admin/api/${this.apiVersion}/products.json?title=${encodeURIComponent(query)}`
      
      const response = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': this.config.clientSecret,
          'Content-Type': 'application/json'
        }
      })
  
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
  
      return response.json()
    }
  }