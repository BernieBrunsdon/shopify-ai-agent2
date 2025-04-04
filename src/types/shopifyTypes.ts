export interface Product {
    id: number
    title: string
    variants: Array<{
      id: number
      price: string
    }>
  }
  
  export interface ShopifyError {
    errors?: string | Record<string, string[]>
  }
  
  export interface ShopifyConfig {
    shopDomain: string
    clientId: string
    clientSecret: string
    apiVersion?: string
  }