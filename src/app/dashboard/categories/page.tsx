'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EditCategoryModal } from '@/components/categories/edit-category-modal';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Loader,
  Package,
  MoreVertical,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

interface Product {
  _id: string;
  category: string | { _id: string };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both categories and products in parallel
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products?limit=1000') // Get all products to count properly
      ]);

      if (!categoriesResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesResponse.json();
      const productsData = await productsResponse.json();

      const categoriesList = categoriesData.categories || categoriesData.data || [];
      const productsList = productsData.products || productsData.data || [];

      setProducts(productsList);

      // Calculate product counts for each category
     const categoriesWithCounts = categoriesList.map((category: Category) => {
  const productCount = productsList.filter((product: Product) => {
    if (!product?.category) return false;

    const categoryId =
      typeof product.category === "string"
        ? product.category
        : product.category._id;

    return categoryId === category._id;
  }).length;

  return {
    ...category,
    productCount
  };
});


      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

const handleSaveCategory = async (updatedCategory: Category) => {
  try {
    const url = `/api/admin/categories/${updatedCategory._id}`;
    console.log('Making PUT request to:', url);
    console.log('Data being sent:', updatedCategory);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCategory),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok && data.success) {
      setCategories(categories.map(cat =>
        cat._id === updatedCategory._id ? { ...cat, ...data.category } : cat
      ));
    } else {
      alert(data.message || 'Error updating category');
    }
  } catch (error) {
    console.error('Error updating category:', error);
    alert('Error updating category');
  }
};

  const handleDelete = async (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    
    if (category && category.productCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.productCount} products. Please move or delete the products first.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(categoryId);
    
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(categories.filter(cat => cat._id !== categoryId));
      } else {
        alert(data.message || 'Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    } finally {
      setIsDeleting(null);
    }
  };

 const handleStatusToggle = async (categoryId: string, currentStatus: boolean) => {
  try {
    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isActive: !currentStatus
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setCategories(categories.map(cat =>
        cat._id === categoryId
          ? { ...cat, isActive: !currentStatus }
          : cat
      ));
    } else {
      alert(data.message || 'Error updating category status');
    }
  } catch (error) {
    console.error('Error updating category status:', error);
  }
};

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(category =>
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? category.isActive :
      !category.isActive
    );

  // Calculate statistics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalProducts = categories.reduce((sum, category) => sum + category.productCount, 0);
  const averageProductsPerCategory = totalCategories > 0 ? (totalProducts / totalCategories).toFixed(1) : '0';
  const emptyCategories = categories.filter(cat => cat.productCount === 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage your product categories and organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={fetchData} 
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
          <Link href="/dashboard/categories/new">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
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
                <p className="text-sm font-medium text-blue-800">Total Categories</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{totalCategories}</p>
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
                <p className="text-sm font-medium text-green-800">Active Categories</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{activeCategories}</p>
                <p className="text-xs text-green-700 mt-1">
                  {totalCategories > 0 ? Math.round((activeCategories / totalCategories) * 100) : 0}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Total Products</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Avg. Products</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{averageProductsPerCategory}</p>
                <p className="text-xs text-orange-700 mt-1">
                  per category
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ø</span>
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
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button  className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200 shadow-lg">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-medium text-gray-900">
            Categories ({filteredCategories.length})
          </CardTitle>
          {emptyCategories > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {emptyCategories} empty categories
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Get started by creating your first product category to organize your inventory.'
                }
              </p>
              <Link href="/dashboard/categories/new">
                <Button>Create Category</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <div key={category._id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="text-blue-700 font-bold text-lg">
                            {category.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {category.name}
                          </h3>
                          <Badge 
                            variant={category.isActive ? "default" : "secondary"}
                            className={category.isActive 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {category.productCount === 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Empty
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span className={category.productCount === 0 ? "text-orange-600 font-medium" : ""}>
                              {category.productCount} products
                            </span>
                          </div>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            /{category.slug}
                          </span>
                          <span className="text-xs">
                            Updated {new Date(category.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(category._id, category.isActive)}
                        className={category.isActive 
                          ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }
                      >
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      {/* <Link href={`/dashboard/categories/${category._id}/edit`}> */}
                       <Button 

  size="sm"
  onClick={() => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  }}
>
  <Edit className="h-4 w-4 mr-2" />
  Edit
</Button>


                      {/* </Link> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/categories/${category.slug}`} target="_blank">
                              View Live
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 focus:text-red-600"
                            disabled={category.productCount > 0}
                          >
                            {isDeleting === category._id ? (
                              <Loader className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete Category
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
      <EditCategoryModal
  isOpen={isEditModalOpen}
  onClose={() => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  }}
  category={editingCategory}
  onSave={handleSaveCategory}
/>
    </div>
  );
}