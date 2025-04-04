import OpenAI from 'openai';
export class AIService {
    openai;
    config;
    maxRetries = 3;
    constructor(apiKey, config = {}) {
        if (!apiKey)
            throw new Error('OpenAI API key is required');
        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: process.env.NODE_ENV === 'development'
        });
        this.config = {
            model: config.model || 'gpt-4-turbo-preview',
            maxTokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.7
        };
    }
    // Core Methods
    async generateResponse(messages, context) {
        return this._retryableRequest(async () => {
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant for ${context.name}. ${context.policies ? `Policies: ${context.policies}` : ''} ${context.shippingInfo ? `Shipping Info: ${context.shippingInfo}` : ''}`
                    },
                    ...messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature
            });
            return {
                content: completion.choices[0]?.message?.content || 'No response generated'
            };
        });
    }
    // Product Comparison Features
    async extractProductNames(query) {
        return this._retryableRequest(async () => {
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Extract product names from this query. Return JSON format: { "products": string[] }'
                    },
                    { role: 'user', content: query }
                ],
                response_format: { type: 'json_object' }
            });
            const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
            return result.products || [];
        });
    }
    async compareProducts(products) {
        return this._retryableRequest(async () => {
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Create a detailed comparison table in markdown format'
                    },
                    {
                        role: 'user',
                        content: `Compare these products: ${JSON.stringify(products)}`
                    }
                ]
            });
            return completion.choices[0]?.message?.content || 'Comparison unavailable';
        });
    }
    // Bundle Suggestions
    async suggestBundles(productNames) {
        return this._retryableRequest(async () => {
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Suggest product bundles in JSON format: { "bundles": Array<{name: string, price: string}> }'
                    },
                    {
                        role: 'user',
                        content: `Suggest bundles for: ${productNames.join(', ')}`
                    }
                ],
                response_format: { type: 'json_object' }
            });
            const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
            return result.bundles || [];
        });
    }
    // Human Escalation
    async shouldEscalateToHuman(query) {
        return this._retryableRequest(async () => {
            const completion = await this.openai.chat.completions.create({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Determine if this query needs human support. Respond only with "true" or "false".'
                    },
                    { role: 'user', content: query }
                ]
            });
            return completion.choices[0]?.message?.content?.toLowerCase() === 'true';
        });
    }
    // Utility
    async _retryableRequest(fn) {
        let lastError;
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        throw lastError;
    }
}
