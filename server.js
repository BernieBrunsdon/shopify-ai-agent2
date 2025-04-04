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

        console.log('Environment variables check:');
        console.log('- Shop Domain:', shopDomain ? 'Set' : 'Missing');
        console.log('- Access Token:', accessToken ? 'Set' : 'Missing');
        console.log('- NODE_ENV:', process.env.NODE_ENV);

        if (!shopDomain || !accessToken) {
            throw new Error('Shopify credentials are not properly configured');
        }

        const url = `https://${shopDomain}/admin/api/${apiVersion}/products.json?title=${encodeURIComponent(query)}`;
        console.log('Attempting to fetch from URL:', url);

        const response = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Shopify API Response Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Shopify API Error Response:', errorData);
            throw new Error(`Shopify API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Successfully fetched products. Count:', data.products?.length || 0);
        res.json(data);
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Allowed origins:', allowedOrigins);
}); 