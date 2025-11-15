'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Zap,
  Store
} from 'lucide-react';
import { AdminPayload } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Categories', href: '/dashboard/categories', icon: Tag },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  admin: AdminPayload;
}

export function DashboardClientLayout({ children, admin }: DashboardClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Force a full page reload to clear any client-side state
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if there's an error
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 flex z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-lg font-bold text-gray-900">ZES</span>
                  <p className="text-xs text-gray-500 -mt-1">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="mt-8 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-4 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Mobile User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {admin.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{admin.username}</p>
                <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Desktop Header */}
            <div className="flex items-center px-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">ZES</span>
                <p className="text-sm text-gray-500 -mt-1">Admin Panel</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Desktop User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {admin.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{admin.username}</p>
                <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="flex-shrink-0 flex border-b border-gray-200 bg-white lg:border-none">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 py-4">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-3 bg-blue-50 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {admin.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{admin.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-8">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}