'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
      } else {
        setError(data.message || 'Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/categories');
      } else {
        setError(data.message || 'Error creating category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Error creating category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600 mt-2">Create a new product category</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Wires & Cables"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe this category..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            
            {formData.image ? (
              <div className="flex items-center space-x-4">
                <img 
                  src={formData.image} 
                  alt="Category preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {imageUploading ? 'Uploading...' : 'Click to upload an image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            )}
            
            {imageUploading && (
              <div className="flex items-center space-x-2 mt-2">
                <Loader className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Uploading image...</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <Link href="/dashboard/categories">
              <Button type="button" >
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Creating Category...
                </>
              ) : (
                'Create Category'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}