import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login attempt started...');
    await connectToDatabase();
    console.log('✅ Database connected');

    const { email, password } = await request.json();
    console.log('📧 Login attempt for email:', email);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    console.log('👤 Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = signToken({
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    console.log('✅ Login successful for:', admin.email);
    console.log('🔑 Token created:', token ? 'Yes' : 'No');

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('🍪 Cookie set in response');

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}