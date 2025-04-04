import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is running',
        environment: {
            shopDomain: process.env.VITE_SHOPIFY_STORE,
            accessTokenPresent: !!process.env.VITE_SHOPIFY_CLIENT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

// Products endpoint
app.get('/api/products', async (req, res) => {
    try {
        const query = req.query.query || '';
        const shopDomain = process.env.VITE_SHOPIFY_STORE;
        const accessToken = process.env.VITE_SHOPIFY_CLIENT_SECRET;
        const apiVersion = '2024-04';

        console.log('Environment variables check:');
        console.log('- Shop Domain:', shopDomain ? `Set (${shopDomain})` : 'Missing');
        console.log('- Access Token:', accessToken ? 'Set (starts with: ' + accessToken.substring(0, 4) + '...)' : 'Missing');
        console.log('- NODE_ENV:', process.env.NODE_ENV);

        if (!shopDomain || !accessToken) {
            throw new Error('Shopify credentials are not properly configured');
        }

        // Ensure the shop domain is properly formatted
        const formattedShopDomain = shopDomain.includes('https://') 
            ? shopDomain.replace('https://', '') 
            : shopDomain;

        const url = `https://${formattedShopDomain}/admin/api/${apiVersion}/products.json?title=${encodeURIComponent(query)}`;
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
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            environmentCheck: {
                shopDomain: process.env.VITE_SHOPIFY_STORE,
                accessTokenPresent: !!process.env.VITE_SHOPIFY_CLIENT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);
}); 