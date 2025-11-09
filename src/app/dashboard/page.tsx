'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from APIs
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products')
      ]);

      const categoriesData = await categoriesResponse.json();
      const productsData = await productsResponse.json();

      // Calculate low stock products
      const lowStockProducts = (productsData.products || [])
        .filter((product: any) => product.stock > 0 && product.stock <= 10)
        .slice(0, 3);

      // Mock orders data (you can replace with real orders API later)
      const recentOrders = [
        { id: '1', customer: 'John Doe', amount: 245.99, status: 'completed' },
        { id: '2', customer: 'Jane Smith', amount: 189.50, status: 'processing' },
        { id: '3', customer: 'Bob Johnson', amount: 567.25, status: 'completed' },
      ];

      const realStats: DashboardStats = {
        totalProducts: productsData.pagination?.total || 0,
        totalCategories: categoriesData.categories?.length || 0,
        totalOrders: recentOrders.length, // Replace with real data when available
        totalRevenue: 24567.89, // Replace with real data when available
        recentOrders,
        lowStockProducts
      };
      
      setStats(realStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      change: '+12%',
      changeType: 'increase' as const,
      href: '/dashboard/products'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      change: '+2',
      changeType: 'increase' as const,
      href: '/dashboard/categories'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: '+8%',
      changeType: 'increase' as const,
      href: '/dashboard/orders'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+15%',
      changeType: 'increase' as const,
      href: '/dashboard/orders'
    }
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.changeType === 'increase' ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{card.change} from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <card.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders">
              <Button size="sm" >View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.amount}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <Link href="/dashboard/products">
              <Button  size="sm">Manage Products</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-red-600">Only {product.stock} left in stock</p>
                  </div>
                  <Link href={`/dashboard/products/${product._id}/edit`}>
                    <Button 
                     size="sm">Restock</Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">All products are well stocked! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/products/new">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-500">Create a new product listing</p>
            </div>
          </Link>
          <Link href="/dashboard/categories/new">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer text-center">
              <Tag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Add Category</p>
              <p className="text-sm text-gray-500">Create a new product category</p>
            </div>
          </Link>
          <Link href="/dashboard/orders">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer text-center">
              <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Manage customer orders</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}