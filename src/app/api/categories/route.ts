import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const includeProductsCount = searchParams.get('includeProductsCount') === 'true';
    
    // Get active categories
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    
    let categoriesWithData = categories;
    
    // Include products count if requested (optimized single query)
    if (includeProductsCount) {
      const categoryIds = categories.map(cat => cat._id);
      
      // Single aggregation query for all counts
      const productsCounts = await Product.aggregate([
        {
          $match: {
            category: { $in: categoryIds },
            isActive: true
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Create a map for quick lookup
      const countMap = new Map(
        productsCounts.map(item => [item._id.toString(), item.count])
      );
      
      categoriesWithData = categories.map(category => ({
        ...category,
        _id: category._id.toString(),
        productsCount: countMap.get(category._id.toString()) || 0
      }));
    } else {
      categoriesWithData = categories.map(category => ({
        ...category,
        _id: category._id.toString(),
        productsCount: 0
      }));
    }
    
    return NextResponse.json({ 
      categories: categoriesWithData 
    });
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}