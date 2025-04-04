// src/components/App.tsx
import { useEffect, useState } from 'react';
import { shopify } from '../services/shopifyInstance';
import { Shop, Product } from '../lib/shopify';
import { ProductList } from './ProductList';

function App() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopData, productsData] = await Promise.all([
          shopify.getShop(),
          shopify.getProducts()
        ]);
        setShop(shopData);
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>{shop?.name}</h1>
      <ProductList products={products} />
    </div>
  );
}

export default App;