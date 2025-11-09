'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Loader, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [] as string[],
    specifications: [] as { key: string; value: string }[],
    features: [] as string[],
    stock: '',
    brand: '',
    isFeatured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select valid image files only');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size must be less than 5MB');
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, data.imageUrl] 
          }));
        } else {
          setError(data.message || 'Error uploading image');
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Error uploading images');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert specifications array to object
      const specificationsObj: Record<string, string> = {};
      formData.specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specificationsObj[spec.key] = spec.value;
        }
      });

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock) || 0,
        specifications: specificationsObj,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/products');
      } else {
        setError(data.message || 'Error creating product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Error creating product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product listing</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Copper Electrical Wire 2.5mm"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
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
                placeholder="Describe the product features and benefits..."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., VoltWise, Havells, etc."
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"  placeholder="0.00"
                />
              </div>

              {/* Original Price */}
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (Rs)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"  placeholder="0"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Feature this product
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer block">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {imageUploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB each
                </p>
              </label>
            </div>
            
            {imageUploading && (
              <div className="flex items-center space-x-2 mt-2">
                <Loader className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Uploading images...</span>
              </div>
            )}

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <input
                  type="text"
                  placeholder="Specification name"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"  />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"  />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <Button
              type="button"
             
              onClick={addSpecification}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Specification
            </Button>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Add a feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="button"
                
                onClick={addFeature}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <Link href="/dashboard/products">
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
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}