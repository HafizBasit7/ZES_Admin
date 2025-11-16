import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zahid Electric Store',
  description: 'Your trusted partner for quality electrical products, supplies, and expert solutions. Fast delivery and professional support.',
  keywords: 'electrical supplies, wires, switches, bulbs, lighting, electrical tools',
};

// Enhanced dashboard detection
function isDashboardRoute(children: React.ReactNode): boolean {
  try {
    // Log for debugging
    console.log('🔍 Checking dashboard route...');
    
    // Method 1: Check segment
    // @ts-ignore
    const segment = children?.props?.childProp?.segment || '';
    console.log('📁 Segment:', segment);
    
    // Method 2: Check child segment
    // @ts-ignore
    const childSegment = children?.props?.child?.segment || '';
    console.log('👶 Child Segment:', childSegment);
    
    // Method 3: Check layout segments
    // @ts-ignore
    const layoutSegments = children?.props?.layoutSegments || [];
    console.log('🏗️ Layout Segments:', layoutSegments);
    
    // Method 4: Check if any segment contains 'dashboard'
    // @ts-ignore
    const allSegments = JSON.stringify(children?.props || {});
    console.log('📋 All props:', allSegments.substring(0, 200));
    
    const isDashboard = segment === 'dashboard' || 
                       childSegment === 'dashboard' || 
                       layoutSegments[0] === 'dashboard' ||
                       allSegments.includes('dashboard');
    
    console.log('🎯 Final isDashboard:', isDashboard);
    return isDashboard;
    
  } catch (error) {
    console.log('❌ Error in dashboard detection:', error);
    return false;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDashboard = isDashboardRoute(children);

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {isDashboard ? (
            // Dashboard routes - no header/footer, only dashboard layout
            <div className="min-h-screen">
              {children}
            </div>
          ) : (
            // Public routes - with header/footer
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          )}
        </CartProvider>
      </body>
    </html>
  );
}