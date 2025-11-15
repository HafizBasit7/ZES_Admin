'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Play, Pause, Store } from 'lucide-react';
import Image from 'next/image';

export function AnimatedHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Replace these with your actual shop images
  const backgroundImages = [
    {
      url: "/images/shop/interior-1.jpg", // Your shop front image
      title: "Zahid Electric Store",
      subtitle: "Your Trusted Electrical Partner",
      description: "Visit our well-stocked physical store for expert advice and quality products"
    },
    {
      url: "/images/shop/shop.jpg", // Your shop interior
      title: "Wide Product Range",
      subtitle: "Everything You Need",
      description: "Comprehensive inventory of electrical components and tools"
    },
    {
      url: "/images/shop/homage.jpg", // Your product display
      title: "Premium Quality",
      subtitle: "Genuine Brands",
      description: "Authentic Inverters from leading electrical manufacturers"
    },
    {
      url: "/images/shop/service.jpg", // Your team/customer service
      title: "Expert Staff",
      subtitle: "Professional Guidance",
      description: "Knowledgeable team ready to assist with your electrical projects"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, backgroundImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Fallback background color */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
            
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0">
        {/* Animated Circuit Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-lg animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-2 border-white rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-white animate-pulse delay-700"></div>
          <div className="absolute bottom-20 right-32 w-20 h-20 border-2 border-white rounded-lg animate-pulse delay-500"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Zap className="h-8 w-8 text-yellow-300" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
          <Store className="h-8 w-8 text-white opacity-70" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float delay-500">
          <div className="w-6 h-6 bg-yellow-300 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <Store className="h-4 w-4 text-yellow-300" />
                <span>Zahid Electric Store - Since 1986</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block">{backgroundImages[currentSlide].title}</span>
                <span className="block text-yellow-300 mt-2">{backgroundImages[currentSlide].subtitle}</span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                {backgroundImages[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8 py-3 group">
                    Shop Online
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                    Visit Store
                  </Button>
                </Link>
              </div>

              {/* ZES Stats */}
              <div className="flex gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">40+</div>
                  <div className="text-blue-100 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">5000+</div>
                  <div className="text-blue-100 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">50+</div>
                  <div className="text-blue-100 text-sm">Cities Served</div>
                </div>
              </div>
            </div>

            {/* ZES Brand Visual */}
            {/* <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-2xl p-8 aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-gray-900">ZES</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Zahid Electric Store</h3>
                    <p className="text-blue-100">Trusted Since 1986</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* Slide Dots */}
          <div className="flex gap-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-yellow-300 w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}