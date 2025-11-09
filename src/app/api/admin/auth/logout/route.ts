import { NextResponse } from 'next/server';
import { clearAuthToken } from '@/lib/auth';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the cookie
    response.cookies.delete('admin-token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}