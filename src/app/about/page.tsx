import { CheckCircle, Users, Target, Award, Clock, Shield, Globe, Building } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Clock className="h-4 w-4" />
              <span>Trusted Since 1986</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Zahid Electric Store</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              For over four decades, ZES has been the cornerstone of electrical excellence in Pakistan. 
              From our humble beginnings in 1986 to becoming a trusted name nationwide, we've been powering 
              progress with quality, reliability, and unwavering commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Legacy & Experience */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">40 Years of Electrical Excellence</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 1986 by Mr. Zahid Ullah Khan, our journey began with a small shop and a big vision. 
              Today, we stand as a testament to four decades of trust, quality, and customer satisfaction 
              in the electrical industry.
            </p>
            <div className="space-y-4">
              {legacyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {legacyStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* CEO Image */}
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6">
                <div className="aspect-[4/5] bg-white rounded-xl shadow-lg overflow-hidden">
                  <Image
                    src="/images/shop/ceo.jpg"
                    alt="Mr. Zahid Ullah Khan - Founder & CEO of Zahid Electric Store"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-400 rounded-full opacity-20"></div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-4">
                <Users className="h-4 w-4" />
                <span>Leadership</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Founder & CEO</h2>
              <h3 className="text-xl text-blue-600 font-semibold mb-4">Mr. Zahid Ullah Khan</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With over 40 years of hands-on experience in the electrical industry, Mr. Zahid Ullah Khan 
                has built ZES from the ground up. His vision of providing quality electrical solutions 
                with integrity has been the driving force behind our four-decade-long success story.
              </p>
              <div className="space-y-3">
                {ceoQualities.map((quality, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{quality}</span>
                  </div>
                ))}
              </div>
              
              {/* CEO Signature */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Z</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Founder's Signature</p>
                    <p className="text-lg font-semibold text-gray-900">Zahid Ullah Khan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To continue our legacy of providing premium electrical products and expert solutions 
              that empower homes, businesses, and industries across Pakistan with safety, reliability, 
              and innovation.
            </p>
            <div className="space-y-3">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To be Pakistan's most trusted and innovative electrical solutions provider, 
              bridging traditional values with modern technology while maintaining our 
              commitment to quality and customer satisfaction.
            </p>
            <div className="space-y-3">
              {visionPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Four Decades of Trust</h2>
            <p className="text-blue-100 text-xl">Building electrical excellence since 1986</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-4">
            <Shield className="h-4 w-4" />
            <span>Our Foundation</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Values That Guide Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that have been the bedrock of our success for over 40 years
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl mx-4 lg:mx-auto max-w-7xl p-8 lg:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Experience the ZES Difference
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have trusted us for their electrical needs since 1986
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/products" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Shop Our Products
          </a>
          <a 
            href="/contact" 
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Visit Our Store
          </a>
        </div>
      </section>
    </div>
  );
}

const legacyPoints = [
  'Started in 1986 with a vision for quality electrical solutions',
  'Grown from a small local shop to a nationwide trusted brand',
  'Three generations of electrical expertise and knowledge',
  'Adapted to technological changes while maintaining core values',
  'Built lasting relationships with customers and suppliers'
];

const legacyStats = [
  { value: '40+', label: 'Years Experience' },
  { value: '3', label: 'Generations' },
  { value: '50,000+', label: 'Customers Served' },
  { value: '1986', label: 'Established' }
];

const ceoQualities = [
  '40+ years of electrical industry expertise',
  'Hands-on approach to business and customer service',
  'Commitment to quality and customer satisfaction',
  'Visionary leadership with traditional values',
  'Mentor to the next generation of electrical professionals'
];

const missionPoints = [
  'Maintain our legacy of quality and trust',
  'Provide expert guidance and technical support',
  'Offer comprehensive electrical solutions for all needs',
  'Ensure customer satisfaction in every interaction',
  'Promote electrical safety and best practices'
];

const visionPoints = [
  'Expand our reach while maintaining quality standards',
  'Integrate modern e-commerce with traditional values',
  'Train the next generation of electrical experts',
  'Continue innovation in electrical solutions',
  'Strengthen our position as industry leaders'
];

const stats = [
  { icon: Clock, value: '40+', label: 'Years in Business' },
  { icon: Users, value: '50K+', label: 'Customers Served' },
  { icon: Building, value: '3', label: 'Generations' },
  { icon: Award, value: '100%', label: 'Quality Guarantee' }
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Reliability',
    description: 'Built over 40 years of consistent quality and dependable service that customers can rely on.'
  },
  {
    icon: CheckCircle,
    title: 'Quality First',
    description: 'Never compromising on quality. Every product meets the highest standards of safety and performance.'
  },
  {
    icon: Users,
    title: 'Customer Legacy',
    description: 'Serving multiple generations of families and businesses with personalized attention and care.'
  },
  {
    icon: Building,
    title: 'Traditional Values',
    description: 'Combining time-tested business ethics with modern electrical solutions and technology.'
  }
];