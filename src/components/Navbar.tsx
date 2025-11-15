'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [categories, setCategories] = useState([]);

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
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            YourStore
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-blue-600">
              All Products
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2">
                  {categories.map((category: any) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Link */}
            <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}