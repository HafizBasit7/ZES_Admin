import Link from 'next/link';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import { getCategories, getProducts } from '../actions';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
      page: searchParams.page || '1',
      limit: '24'
    })
  ]);

  const activeCategories = categories.filter((cat: any) => cat.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-2">Discover our complete range of electrical solutions</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <div className="flex border border-gray-300 rounded-lg">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none border-l border-gray-300">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors ${
                !searchParams.category 
                  ? 'bg-blue-50 border-blue-500 text-blue-600' 
                  : 'border-gray-300'
              }`}
            >
              All Products
            </Link>
            {activeCategories.map((category: any) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className={`px-4 py-2 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors ${
                  searchParams.category === category.slug 
                    ? 'bg-blue-50 border-blue-500 text-blue-600' 
                    : 'border-gray-300'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
              {searchParams.category && (
                <span> in {activeCategories.find((c: any) => c.slug === searchParams.category)?.name}</span>
              )}
            </p>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {products.length > 0 ? (
            <ProductGrid initialProducts={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
              <Link href="/products">
                <Button className="mt-4">View All Products</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}