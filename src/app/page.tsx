import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Shield, Truck, Clock, Award, Zap, Sparkles, Battery, Cpu, Store } from 'lucide-react';
import { getCategories, getProducts } from './actions';
import { AnimatedHero } from '@/components/home/AnimatedHero';
import { FeatureCard } from '@/components/home/FeatureCard';

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 })
  ]);

  const activeCategories = categories.filter((cat: any) => cat.isActive);

  return (
    <div className="space-y-16">
      {/* Modern Animated Hero Section */}
      <AnimatedHero />

      {/* Trust Bar */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white text-sm font-medium">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              <span>Zahid Electric Store - Since 1986</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>ISO Certified Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>Warranty Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Why Choose ZES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white-900 mb-4">
            Trusted Electrical Solutions Across <span className="text-blue-600">Pakistan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            For over a decade, Zahid Electric Store has been providing premium electrical products with unmatched service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Store className="h-8 w-8" />}
            title="Physical Store"
            description="Visit our well-stocked store in the heart of the city with expert staff"
            color="blue"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Premium Quality"
            description="Genuine products from top brands with quality guarantees"
            color="green"
          />
          <FeatureCard
            icon={<Truck className="h-8 w-8" />}
            title="Nationwide Delivery"
            description="Fast shipping across Pakistan with reliable courier partners"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Expert Support"
            description="Technical guidance from experienced electrical professionals"
            color="orange"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              ZES Featured Products
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best-Selling Electrical Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of quality electrical components trusted by professionals
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <ProductGrid initialProducts={featuredProducts} />
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                <Cpu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Products</h3>
                <p className="text-gray-600">Check back soon for our featured collection</p>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                View All Products
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Design */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Battery className="h-4 w-4" />
              ZES Product Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Electrical Inventory
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for residential, commercial, and industrial electrical projects
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {activeCategories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-blue-100">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm">
                    <CategoryIcon category={category} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.productsCount || 0} products
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse All Categories
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About ZES Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Store className="h-4 w-4" />
                About Our Store
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-blue-600">Zahid Electric Store</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                For over a decade, Zahid Electric Store has been the trusted name in electrical supplies across Pakistan. 
                We combine traditional business values with modern e-commerce convenience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Family-owned business since 2010</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Physical store with online shopping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Expert staff with technical knowledge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Genuine products with warranty</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Visit Our Store</h3>
                    <p className="text-gray-600">Experience our wide range of products in person</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl mx-4 lg:mx-auto max-w-7xl p-8 lg:p-12 text-white">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the ZES Difference
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Zahid Electric Store for all their electrical needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Shop Online Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                Visit Our Store
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ... (keep the same CategoryIcon and other icon components from previous code)

// Category Icon Component
function CategoryIcon({ category }: { category: any }) {
  const iconProps = { className: "h-8 w-8 text-blue-600" };
  
  // Map category names to icons
  const categoryIcons: { [key: string]: JSX.Element } = {
    'wires': <CableIcon {...iconProps} />,
    'cables': <CableIcon {...iconProps} />,
    'switches': <SwitchIcon {...iconProps} />,
    'sockets': <SwitchIcon {...iconProps} />,
    'lighting': <LightIcon {...iconProps} />,
    'lights': <LightIcon {...iconProps} />,
    'bulbs': <LightIcon {...iconProps} />,
    'breakers': <CircuitIcon {...iconProps} />,
    'circuit': <CircuitIcon {...iconProps} />,
    'protection': <CircuitIcon {...iconProps} />,
    'tools': <ToolIcon {...iconProps} />,
    'equipment': <ToolIcon {...iconProps} />,
    'safety': <SafetyIcon {...iconProps} />,
    'gear': <SafetyIcon {...iconProps} />,
    'default': <CableIcon {...iconProps} />
  };

  const categoryName = category.name.toLowerCase();
  const matchedIcon = Object.keys(categoryIcons).find(key => categoryName.includes(key));
  
  return matchedIcon ? categoryIcons[matchedIcon] : categoryIcons.default;
}

// Icon components
function CableIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SwitchIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LightIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function CircuitIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
}

function ToolIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SafetyIcon(props: any) { 
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
    </svg>
  );
}