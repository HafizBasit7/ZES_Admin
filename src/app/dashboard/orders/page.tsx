'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Loader,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    product: any;
    quantity: number;
    price: number;
    name: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/orders?limit=50');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: OrdersResponse = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      'pending': 'outline',
      'confirmed': 'secondary',
      'processing': 'secondary',
      'shipped': 'default',
      'delivered': 'default',
      'cancelled': 'destructive'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      'confirmed': 'text-blue-600 bg-blue-100 border-blue-200',
      'processing': 'text-purple-600 bg-purple-100 border-purple-200',
      'shipped': 'text-indigo-600 bg-indigo-100 border-indigo-200',
      'delivered': 'text-green-600 bg-green-100 border-green-200',
      'cancelled': 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getPaymentStatusVariant = (status: string) => {
    const variants = {
      'paid': 'default',
      'pending': 'outline',
      'failed': 'destructive',
      'refunded': 'secondary'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const StatusFilterButton = ({ status, count, label }: { status: string; count: number; label: string }) => (
    <button
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        statusFilter === status
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label} <span className="ml-1">({count})</span>
    </button>
  );

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all customer orders in one place.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline"
              className="border-gray-300 hover:border-gray-400"
            >
              {isRefreshing ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-purple-600">{statusCounts.processing}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                <StatusFilterButton status="all" count={statusCounts.all} label="All" />
                <StatusFilterButton status="pending" count={statusCounts.pending} label="Pending" />
                <StatusFilterButton status="processing" count={statusCounts.processing} label="Processing" />
                <StatusFilterButton status="shipped" count={statusCounts.shipped} label="Shipped" />
                <StatusFilterButton status="delivered" count={statusCounts.delivered} label="Delivered" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border border-gray-200/70 bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl font-bold">All Orders</CardTitle>
              <CardDescription>
                {filteredOrders.length} orders found
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                      <TableHead className="font-semibold">Order</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.customer.name}</p>
                            <p className="text-sm text-gray-500">{order.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(order.status)}
                            className={`capitalize border ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getPaymentStatusVariant(order.paymentStatus)}
                            className="capitalize"
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Link href={`/dashboard/orders/${order._id}`}>
                              <Button variant="outline" size="sm" className="border-gray-300">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="border-gray-300">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {orders.length === 0 ? 'No orders yet' : 'No orders found'}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {orders.length === 0 
                    ? 'Orders will appear here once customers start placing orders.'
                    : 'Try adjusting your search or filter to find what you\'re looking for.'
                  }
                </p>
                {orders.length === 0 && (
                  <Link href="/dashboard/products">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Products
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton Loading Component
const OrdersSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-20 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);