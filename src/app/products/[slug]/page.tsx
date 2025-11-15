import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getProductBySlug, getProducts } from '../../actions';
import { AddToCart } from '@/components/cart/AddToCart';
import { Shield, Truck, Clock, Award, ZoomIn } from 'lucide-react';
import { ImageGallery } from '@/components/products/ImageGallery';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Format currency to PKR
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params promise
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = await getProducts({ 
    category: product.category?.slug,
    limit: '4'
  });

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-blue-600">Products</a>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <a href={`/categories/${product.category.slug}`} className="hover:text-blue-600">
                  {product.category.name}
                </a>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Gallery */}
            <div>
              <ImageGallery 
                images={product.images || []} 
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Brand & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                  {product.category && (
                    <span className="text-sm text-gray-500">
                      in <a href={`/categories/${product.category.slug}`} className="text-blue-600 hover:underline">{product.category.name}</a>
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(Math.floor(product.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                  </div>
                  <span className="text-gray-600 ml-2 text-lg">
                    ({product.reviewCount || 0} reviews)
                  </span>
                  <span className="mx-3 text-gray-300">•</span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium text-lg">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium text-lg">Out of Stock</span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-2xl text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-lg font-semibold">
                          -{discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-green-600 font-medium">
                      You save {formatPrice(product.originalPrice - product.price)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-black mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-xl mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="border-t pt-6">
                  <AddToCart product={product} />
                </div>

                {/* Trust Badges - Updated for Pakistan */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Fast Shipping</p>
                      {/* <p className="text-xs text-gray-500">On orders over ₨5,000</p> */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <div>
                      {/* <p className="text-xs text-gray-500">1-Year Warranty</p> */}
                      <p className="text-xs text-gray-500">Quality guaranteed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-orange-500" />
                    <div>
                      {/* <p className="font-semibold text-sm">Expert Support</p> */}
                      <p className="text-xs text-gray-500">24/7 assistance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-6 w-6 text-purple-500" />
                    <div>
                      {/* <p className="font-semibold text-sm">Quality Certified</p> */}
                      <p className="text-xs text-gray-500">Premium materials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">{key}:</span>
                  <span className="font-medium text-gray-900 text-right">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <ProductGrid initialProducts={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}