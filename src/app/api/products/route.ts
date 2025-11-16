import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 50); // Limit max to 50
    const featured = searchParams.get('featured') === 'true';
    
    // Build query for active products only
    let query: any = { isActive: true };
    
    // Filter by category
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category, isActive: true });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // Return empty if category doesn't exist or is inactive
        return NextResponse.json({ 
          products: [],
          pagination: { page, limit, total: 0, pages: 0 }
        });
      }
    }
    
    // Search in name, description, or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter featured products
    if (featured) {
      query.isFeatured = true;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get products with population and sorting
    const products = await Product.find(query)
      .populate('category', 'name slug _id')
      .sort({ 
        isFeatured: -1,
        createdAt: -1 
      })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean for better performance
    
    const total = await Product.countDocuments(query);
    
    // Transform products for client
    const transformedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      category: product.category ? {
        _id: product.category._id.toString(),
        name: product.category.name,
        slug: product.category.slug
      } : null,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock || 0,
      images: product.images || [],
      features: product.features || [],
      specifications: product.specifications || {}
    }));
    
    return NextResponse.json({ 
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}