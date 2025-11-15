import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getCategoryBySlug, getProducts } from '../../actions';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params promise
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ category: slug })
  ]);

  if (!category || !category.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-2">{category.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {products.length > 0 ? (
          <ProductGrid initialProducts={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}