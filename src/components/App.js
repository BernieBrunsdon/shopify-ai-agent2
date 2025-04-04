import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ShopifyService } from '@/services/shopifyService';
const App = () => {
    const [error, setError] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const shopify = new ShopifyService({
                    shopDomain: import.meta.env.VITE_SHOPIFY_STORE || '',
                    clientId: import.meta.env.VITE_SHOPIFY_CLIENT_ID || '',
                    clientSecret: import.meta.env.VITE_SHOPIFY_CLIENT_SECRET || ''
                });
                const data = await shopify.searchProducts('');
                setProducts(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };
        fetchData();
    }, []);
    if (error) {
        return _jsx(ErrorDisplay, { error: error, onRetry: () => window.location.reload() });
    }
    return (_jsx("div", { className: "app-container", children: _jsx("h1", { children: "Shopify App" }) }));
};
_jsx("h1", { className: "text-3xl font-bold text-blue-500", children: "Tailwind CSS is working!" });
export default App;
