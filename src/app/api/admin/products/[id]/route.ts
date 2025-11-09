import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const body = await request.json();
    
    console.log('Update product request:', { id, body });

    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      sku,
      brand,
      isFeatured,
      isActive
    } = body;

    // Validate required fields according to your schema
    if (!name || !description || !price || !category || !brand) {
      console.log('Missing required fields:', { name, description, price, category, brand });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, description, price, category, and brand are required' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists for other products
    if (slug) {
      const existingSlug = await Product.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (existingSlug) {
        return NextResponse.json(
          { success: false, message: 'Product slug already exists' },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists for other products
    if (sku) {
      const existingSKU = await Product.findOne({
        sku: sku.trim().toUpperCase(),
        _id: { $ne: id }
      });

      if (existingSKU) {
        return NextResponse.json(
          { success: false, message: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        slug: slug?.trim().toLowerCase(),
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: images || [],
        category,
        stock: Number(stock) || 0,
        sku: sku?.trim().toUpperCase(),
        brand: brand.trim(),
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, message: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error updating product' },
      { status: 500 }
    );
  }
}