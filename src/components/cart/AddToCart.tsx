'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';

interface AddToCartProps {
  product: any;
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

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: quantity,
      stock: product.stock,
      slug: product.slug
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-4 py-3 text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="px-6 py-3 text-lg font-semibold min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="px-4 py-3 text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {product.stock} available
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          size="lg"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-gray-400"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-gray-400"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          {/* <span className="text-blue-700 font-medium">SKU: {product.sku}</span> */}
          <span className="text-blue-700">
            🚚 Fast shipping
          </span>
        </div>
      </div>
    </div>
  );
}