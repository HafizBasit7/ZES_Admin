'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Package,
  Loader,
  RefreshCw,
  Star,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  stock: number;
  sku: string;
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/products?limit=1000');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || data.data || []);
      } else {
        console.error('Error fetching products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(productId);
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        alert(data.message || 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFeaturedToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured: !currentStatus
        }),
      });

      if (response.ok) {
        setProducts(products.map(product =>
          product._id === productId
            ? { ...product, isFeatured: !currentStatus }
            : product
        ));
      }
    } catch (error) {
      console.error('Error updating product featured status:', error);
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product =>
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? product.isActive :
      !product.isActive
    )
    .filter(product => {
      if (stockFilter === 'all') return true;
      if (stockFilter === 'inStock') return product.stock > 10;
      if (stockFilter === 'lowStock') return product.stock > 0 && product.stock <= 10;
      if (stockFilter === 'outOfStock') return product.stock === 0;
      return true;
    });

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const inStockProducts = products.filter(p => p.stock > 10).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory and listings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={fetchProducts} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </Button>
          <Link href="/dashboard/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Products</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{totalProducts}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {activeProducts} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">In Stock</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{inStockProducts}</p>
                <p className="text-xs text-green-700 mt-1">
                  {lowStockProducts} low stock
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Featured</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{featuredProducts}</p>
                <p className="text-xs text-purple-700 mt-1">
                  {Math.round((featuredProducts / totalProducts) * 100)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Stock Value</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  Rs.{totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Total inventory value
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products by name, description, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Stock: {stockFilter === 'all' ? 'All' : stockFilter}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStockFilter('all')}>
                    All Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('inStock')}>
                    In Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('lowStock')}>
                    Low Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('outOfStock')}>
                    Out of Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">
            Products ({filteredProducts.length})
          </CardTitle>
          {lowStockProducts > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {lowStockProducts} low stock items
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Get started by adding your first product to your inventory.'
                }
              </p>
              <Link href="/dashboard/products/new">
                <Button>Add Product</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product._id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <Badge 
                            variant={product.isActive ? "default" : "secondary"}
                            className={product.isActive 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              {product.category.name}
                            </Badge>
                          </div>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            SKU: {product.sku}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800'
                              : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Stock: {product.stock}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            Rs.{product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeaturedToggle(product._id, product.isFeatured)}
                        className={product.isFeatured 
                          ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                          : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        }
                      >
                        <Star className={`h-4 w-4 mr-2 ${product.isFeatured ? 'fill-current' : ''}`} />
                        {product.isFeatured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Link href={`/dashboard/products/${product._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`} target="_blank">
                              View Live
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            {isDeleting === product._id ? (
                              <Loader className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}