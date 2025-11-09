'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Loader, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}

export function EditCategoryModal({ isOpen, onClose, category, onSave }: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isActive: category.isActive
      });
    }
    setError(''); // Clear error when modal opens
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsLoading(true);
    setError('');
    
    try {
      await onSave({ ...category, ...formData });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Error saving category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
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
      setIsUploading(false);
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category Image
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center group">
              {formData.image ? (
                <>
                  <img 
                    src={formData.image} 
                    alt="Category"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              {/* File Input - Make sure it's properly connected */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
              />
              
              {/* Upload Button - Properly connected to file input */}
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className="flex items-center space-x-2"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {isUploading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>
                  {isUploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image'}
                </span>
              </Button>
                
              {isUploading && (
                <div className="flex items-center space-x-2 mt-2">
                  <Loader className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Uploading image...</span>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                Recommended: 400x400px, JPG, PNG or WebP (max 5MB)
              </p>
              
              {formData.image && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Image uploaded successfully
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <Input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="category-slug"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be used in the URL: /categories/{formData.slug}
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe this category..."
            rows={4}
          />
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active Category</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Inactive categories won't be visible on the website
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.name || !formData.slug}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}