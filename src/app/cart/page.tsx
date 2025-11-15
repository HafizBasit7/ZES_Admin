'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link href="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>  
                
                <div className="flex-1">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600">Rs{item.price}</p>
                </div>

                <div className="text-black flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-lg font-semibold min-w-[80px] text-right">
                    Rs{(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
            <h2 className="text-black font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="text-black flex justify-between">
                <span>Subtotal</span>
                <span>Rs{getCartTotal().toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div> */}
              <div className="text-black flex justify-between">
                <span>Shipping</span>
                <span>Rs{(getCartTotal() + 500).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="text-black flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>Rs{(getCartTotal() + 500).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
              Proceed to Checkout
            </Button>

            <div className="mt-4 text-center">
              <Link href="/products" className="text-blue-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}