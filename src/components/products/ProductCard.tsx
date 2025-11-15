import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md font-semibold">
              -{discountPercentage}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg bg-gray-800 px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-400 mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {'★'.repeat(Math.floor(product.rating || 0))}
            {'☆'.repeat(5 - Math.floor(product.rating || 0))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviewCount || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              Rs{product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                Rs{product.originalPrice}
              </span>
            )}
          </div>
          <Button 
            size="sm"
            className={`${
              product.stock > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white transition-colors`}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}