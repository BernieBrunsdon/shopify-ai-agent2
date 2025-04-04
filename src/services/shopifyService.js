export class ShopifyService {
    config;
    apiVersion;
    maxRetries;
    retryDelay;

    constructor(config) {
        this.config = config;
        this.apiVersion = config.apiVersion || '2024-04';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    async searchProducts(query) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const url = `${apiUrl}/api/products?query=${encodeURIComponent(query)}`;
                
                console.log(`Attempt ${attempt}: Fetching products from ${url}`);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
                }
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
                lastError = error;
                
                if (attempt < this.maxRetries) {
                    console.log(`Retrying in ${this.retryDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        }
        
        throw new Error(`Failed to fetch products after ${this.maxRetries} attempts. Last error: ${lastError?.message}`);
    }
}
