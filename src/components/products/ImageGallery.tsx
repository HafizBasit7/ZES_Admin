'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If no images, use placeholder
  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
          <Image
            src={displayImages[selectedImageIndex]}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            width={600}
            height={600}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={openFullscreen}
            priority
          />
          
          {/* Zoom Button */}
          <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Gallery with Scroll */}
        {displayImages.length > 1 && (
          <div className="relative">
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 aspect-square w-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex 
                      ? 'border-blue-500 scale-105' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Fullscreen Image */}
            <div className="relative">
              <Image
                src={displayImages[selectedImageIndex]}
                alt={`${productName} - Fullscreen view`}
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip in Fullscreen */}
            {displayImages.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 bg-gray-800 rounded overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white' 
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productName} - Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="text-white text-center mt-4">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}