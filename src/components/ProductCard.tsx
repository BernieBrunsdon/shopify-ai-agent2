// src/components/ProductCard.tsx
import { Product } from '../lib/shopify';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>From: {product.variants[0]?.price}</p>
    </div>
  );
}