import * as React from 'react'

interface ComparisonTableProps {
  products: Array<{
    id: string
    title: string
    variants: Array<{ price: string }>
  }>
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ products }) => {
  if (!products.length) return null

  return (
    <section className="comparison-section">
      <h2>Product Comparison</h2>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>${product.variants[0]?.price || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ComparisonTable