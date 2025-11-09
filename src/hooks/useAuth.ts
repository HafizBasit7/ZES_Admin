'use client';

import { useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super-admin' | 'admin';
}

export function useAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const response = await fetch('/api/admin/auth/me', {
        credentials: 'include', // Important for cookies
      });
      
      console.log('🔑 Auth check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User authenticated:', data.admin.username);
        setAdmin(data.admin);
      } else {
        console.log('❌ User not authenticated');
        setAdmin(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      setAdmin(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    admin,
    isLoading,
    logout,
    checkAuth,
  };
}