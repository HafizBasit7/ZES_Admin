'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Tag, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Users,
  AlertTriangle,
  Loader,
  RefreshCw,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentOrders: any[];
  lowStockProducts: any[];
  topSellingProducts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from APIs
      const [categoriesResponse, productsResponse, ordersResponse] = await Promise.allSettled([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products?limit=1000'),
        fetch('/api/admin/orders?limit=10')
      ]);

      // Extract data with error handling
      const categoriesData = categoriesResponse.status === 'fulfilled' && categoriesResponse.value.ok 
        ? await categoriesResponse.value.json() 
        : { categories: [] };
      
      const productsData = productsResponse.status === 'fulfilled' && productsResponse.value.ok 
        ? await productsResponse.value.json() 
        : { products: [] };
      
      const ordersData = ordersResponse.status === 'fulfilled' && ordersResponse.value.ok 
        ? await ordersResponse.value.json() 
        : { orders: [] };

      const products = productsData.products || [];
      const categories = categoriesData.categories || [];
      const orders = ordersData.orders || [];

      // Calculate real statistics
      const totalProducts = products.length;
      const totalCategories = categories.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      // Get low stock products (only if stock field exists)
      const lowStockProducts = products
        .filter((product: any) => product.stock !== undefined && product.stock > 0 && product.stock <= 10)
        .slice(0, 5);

      const realStats: DashboardStats = {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        monthlyGrowth: 0, // Will be calculated when we have historical data
        recentOrders: orders.slice(0, 5),
        lowStockProducts,
        topSellingProducts: [] // Empty until we have sales data
      };
      
      setStats(realStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty state data
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        recentOrders: [],
        lowStockProducts: [],
        topSellingProducts: []
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const getStatusVariant = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'completed': 'default',
      'processing': 'secondary',
      'pending': 'outline',
      'cancelled': 'destructive',
      'shipped': 'default'
    };
    return variants[status] || 'outline';
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    href,
    trend 
  }: { 
    title: string;
    value: string;
    description: string;
    icon: any;
    href: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Link href={href}>
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200/70 bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">{description}</p>
                {trend && (
                  <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    action 
  }: { 
    icon: any;
    title: string;
    description: string;
    action?: React.ReactNode;
  }) => (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load data</h3>
            <p className="text-gray-600 mb-6">There was an error loading dashboard statistics</p>
            <Button onClick={fetchDashboardData} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="border-gray-300 hover:border-gray-400 transition-colors"
          >
            {isRefreshing ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            description="Active products"
            icon={Package}
            href="/dashboard/products"
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories.toLocaleString()}
            description="Product categories"
            icon={Tag}
            href="/dashboard/categories"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            description="All-time orders"
            icon={ShoppingCart}
            href="/dashboard/orders"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            description="Revenue generated"
            icon={DollarSign}
            href="/dashboard/orders"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Recent Orders */}
            <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div 
                        key={order._id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.customer?.name || 'Customer'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-gray-500">#{order.orderNumber}</p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                          </p>
                          <Badge 
                            variant={getStatusVariant(order.status)}
                            className="mt-1 capitalize"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ShoppingCart}
                    title="No orders yet"
                    description="Orders will appear here once customers start purchasing from your store."
                    action={
                      <Link href="/dashboard/products">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Products
                        </Button>
                      </Link>
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold">Sales Analytics</CardTitle>
                  <CardDescription>Product performance insights</CardDescription>
                </div>
                <Link href="/dashboard/products">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={TrendingUp}
                  title="No sales data available"
                  description="Sales analytics will appear here once you start receiving orders and tracking product performance."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Low Stock Alert */}
            <Card className="border border-orange-200/70 bg-orange-50/30 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Stock Management
                </CardTitle>
                <CardDescription>Products needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {stats.lowStockProducts.map((product) => (
                      <div 
                        key={product._id} 
                        className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-orange-600 font-medium">
                              {product.stock} units left
                            </p>
                          </div>
                        </div>
                        <Link href={`/dashboard/products/${product._id}/edit`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            Restock
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-gray-600">All products are well stocked!</p>
                    <p className="text-sm text-gray-500 mt-1">Good inventory management</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                <CardDescription>Manage your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/products/new">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Add Product</p>
                        <p className="text-sm text-gray-500">Create new product listing</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/categories/new">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Tag className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Add Category</p>
                        <p className="text-sm text-gray-500">Organize your products</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/orders">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <ShoppingCart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">View Orders</p>
                        <p className="text-sm text-gray-500">Manage customer orders</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Store Summary */}
            <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Store Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Active Products</span>
                  <Badge variant="outline" className="font-semibold">
                    {stats.totalProducts}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Categories</span>
                  <Badge variant="outline" className="font-semibold">
                    {stats.totalCategories}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Orders Today</span>
                  <Badge variant="outline" className="font-semibold">
                    0
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}