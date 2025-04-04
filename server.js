import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://shopify-ai-agent-frontend.onrender.com',
    process.env.VITE_FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for Shopify products
app.get('/api/products', async (req, res) => {
    try {
        const query = req.query.query || '';
        const shopDomain = process.env.VITE_SHOPIFY_STORE;
        const accessToken = process.env.VITE_SHOPIFY_CLIENT_SECRET;
        const apiVersion = '2024-04';

        if (!shopDomain || !accessToken) {
            throw new Error('Shopify credentials are not properly configured');
        }

        console.log(`Fetching products from ${shopDomain} with query: ${query}`);

        const response = await fetch(
            `https://${shopDomain}/admin/api/${apiVersion}/products.json?title=${encodeURIComponent(query)}`,
            {
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Shopify API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Allowed origins:', allowedOrigins);
}); 