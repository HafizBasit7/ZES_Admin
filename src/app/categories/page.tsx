import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCategories } from '../actions';

export default async function CategoriesPage() {
  const categories = await getCategories();
  const activeCategories = categories.filter((cat: any) => cat.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need from our comprehensive range of electrical products
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCategories.map((category: any) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <CategoryIcon category={category} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{category.productsCount || 0} products</span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Category Icon Component
function CategoryIcon({ category }: { category: any }) {
  const iconProps = { className: "h-16 w-16 text-white" };
  
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