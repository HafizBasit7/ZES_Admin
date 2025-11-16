export const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  isDevelopment: process.env.NODE_ENV === 'development',
  cacheDuration: {
    categories: 5 * 60 * 1000, // 5 minutes
    products: 2 * 60 * 1000,   // 2 minutes
  },
  pagination: {
    defaultLimit: 24,
    maxLimit: 50,
  },
} as const;