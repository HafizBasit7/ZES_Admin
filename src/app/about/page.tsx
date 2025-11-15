import { CheckCircle, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About VoltWise</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Your trusted partner in electrical solutions since 2010. We're committed to providing 
              quality products, expert advice, and reliable service to power your world safely and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To provide high-quality electrical products and solutions that empower our customers 
              to build, maintain, and upgrade their electrical systems with confidence and safety.
            </p>
            <div className="space-y-4">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To be the leading electrical solutions provider, recognized for our innovation, 
              quality, and commitment to customer satisfaction across the region.
            </p>
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose VoltWise?</h3>
              <div className="space-y-3">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at VoltWise
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const missionPoints = [
  'Provide 100% genuine and certified electrical products',
  'Ensure competitive pricing without compromising quality',
  'Offer expert technical support and guidance',
  'Maintain comprehensive inventory for quick delivery',
  'Promote electrical safety awareness and best practices'
];

const whyChooseUs = [
  '14 years of industry experience',
  'ISO 9001 certified quality management',
  '24/7 customer support',
  'Same-day delivery available',
  'Technical expertise and guidance',
  'Wide product range from trusted brands'
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Customers' },
  { icon: Award, value: '14+', label: 'Years Experience' },
  { icon: Target, value: '500+', label: 'Products Available' },
  { icon: CheckCircle, value: '98%', label: 'Customer Satisfaction' }
];

const values = [
  {
    icon: CheckCircle,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product is tested and certified to meet international standards.'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Our customers are at the heart of everything we do. We listen, understand, and deliver beyond expectations.'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously evolve with technology to bring you the latest and most efficient electrical solutions.'
  }
];