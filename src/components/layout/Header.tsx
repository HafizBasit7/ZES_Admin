'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories.filter((cat: any) => cat.isActive));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
       
<Link href="/" className="flex items-center space-x-2">
  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
    <span className="text-gray-900 font-bold text-lg">ZES</span>
  </div>
  <div className="flex flex-col">
    <span className="text-xl font-bold text-gray-900">Zahid Electric</span>
    <span className="text-xs text-gray-500 -mt-1">Store</span>
  </div>
</Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search electrical products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-3=00 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button> */}
  
<Link href="/cart">
  <Button  size="icon" className="relative">
    <ShoppingCart className="h-5 w-5" />
    {getCartItemsCount() > 0 && (
      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {getCartItemsCount()}
      </span>
    )}
  </Button>
</Link>
            
            {/* Admin Link */}
            {/* <Link href="/admin">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Admin
              </Button>
            </Link> */}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
                Cart ({getCartItemsCount()})
              </Link>
              {/* <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                Admin Panel
              </Link> */}
              
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}