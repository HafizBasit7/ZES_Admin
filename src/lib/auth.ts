import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('ADMIN_JWT_SECRET environment variable is not set');
}

export interface AdminPayload {
  id: string;
  username: string;
  email: string;
  role: 'super-admin' | 'admin';
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies(); // Add await here
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies(); // Add await here
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies(); // Add await here
  cookieStore.delete('admin-token');
}