import React from 'react';
import ProductCard from '../ProductCard';
import { useTranslation } from 'react-i18next';

export default function Products({ products }) {
    const { t } = useTranslation();

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-4">{t('header.products')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
