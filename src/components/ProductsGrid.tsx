'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductsGridProps {
  initialProducts: any[];
  searchParams?: any;
}

export default function ProductsGrid({ initialProducts, searchParams }: ProductsGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}