import ProductCard from './ProductCard';

interface ProductGridProps {
  initialProducts?: any[];
  categorySlug?: string;
  searchQuery?: string;
}

export async function ProductGrid({ initialProducts = [], categorySlug, searchQuery }: ProductGridProps) {
  // If no products provided, this will be handled by the parent component
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {initialProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}