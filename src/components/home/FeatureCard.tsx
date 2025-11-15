interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
  green: 'from-green-50 to-green-100 border-green-200 text-green-600',
  purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
  orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600'
};

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="group">
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full`}>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}