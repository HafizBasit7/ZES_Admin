import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking auth status...');
    const admin = await getCurrentAdmin();
    
    console.log('👤 Current admin:', admin ? 'Authenticated' : 'Not authenticated');
    
    if (!admin) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ 
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      }
    });
  } catch (error) {
    console.error('❌ Error fetching admin data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}