import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getCurrentAdmin } from '@/lib/auth';

// GET all products
export async function GET(request: NextRequest) {
  try {
    console.log('📦 GET products request');
    await connectToDatabase();
    
    const products = await Product.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      products,
      count: products.length
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// CREATE new product
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new product...');
    
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const productData = await request.json();
    console.log('📦 Product data:', productData);

    const { name, description, price, category, images, specifications, features, stock, brand } = productData;

    // Validate required fields
    if (!name || !description || !price || !category || !brand) {
      return NextResponse.json(
        { message: 'Name, description, price, category, and brand are required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return NextResponse.json(
        { message: 'Invalid category' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Generate unique SKU
    const sku = `VW${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    console.log('🔗 Generated slug:', slug);
    console.log('🏷️ Generated SKU:', sku);

    // Check if product with same name or slug already exists
    const existingProduct = await Product.findOne({ 
      $or: [{ name }, { slug }] 
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: 'Product with this name already exists' },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      slug,
      description,
      price: parseFloat(price),
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
      category,
      images: images || [],
      specifications: specifications || {},
      features: features || [],
      stock: parseInt(stock) || 0,
      sku,
      brand,
      isFeatured: productData.isFeatured || false,
    });

    await product.save();
    console.log('✅ Product created successfully:', product.name);
    
    // Populate category for response
    await product.populate('category', 'name slug');

    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error creating product:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Product with this name or SKU already exists' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      console.error('❌ Validation errors:', errors);
      return NextResponse.json(
        { message: 'Validation error', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error creating product: ' + error.message },
      { status: 500 }
    );
  }
}