import React from 'react';
import ProductCard from '../ProductCard';

export default function Products({ products }) {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">منتجاتنا</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
