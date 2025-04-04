import * as React from 'react'

interface BundleSuggestionProps {
  products: Array<{
    id: string
    title: string
    variants: Array<{ price: string }>
  }>
}

const BundleSuggestion: React.FC<BundleSuggestionProps> = ({ products }) => {
  if (!products.length) return null

  return (
    <section className="bundle-section">
      <h2>Recommended Bundle</h2>
      <ul className="product-list">
        {products.slice(0, 3).map(product => (
          <li key={product.id} className="product-item">
            <h3>{product.title}</h3>
            <p>${product.variants[0]?.price || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BundleSuggestion