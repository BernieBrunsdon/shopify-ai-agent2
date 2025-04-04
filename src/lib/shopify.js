export class ShopifyService {
    config;
    apiVersion;
    constructor(config) {
        this.config = config;
        this.apiVersion = config.apiVersion || '2024-04';
        this.validateConfig();
    }
    validateConfig() {
        if (!this.config.shopDomain || !this.config.clientSecret) {
            throw new Error('Invalid Shopify configuration');
        }
    }
    async shopifyRequest(endpoint) {
        const url = `https://${this.config.shopDomain}/admin/api/${this.apiVersion}/${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': this.config.clientSecret,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(typeof errorData.errors === 'string'
                ? errorData.errors
                : JSON.stringify(errorData.errors));
        }
        return response.json();
    }
    async getShop() {
        const response = await this.shopifyRequest('shop.json');
        return response.shop;
    }
    async getPolicies() {
        const response = await this.shopifyRequest('policies.json');
        return response.policies;
    }
    async getShippingZones() {
        const response = await this.shopifyRequest('shipping_zones.json');
        return response.shipping_zones;
    }
    async searchProducts(query) {
        const response = await this.shopifyRequest(`products.json?title=${encodeURIComponent(query)}`);
        return response.products;
    }
}
