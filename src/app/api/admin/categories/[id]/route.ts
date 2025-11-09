import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params promise
    const { id } = await params;
    const body = await request.json();
    
    const { name, slug, description, image, isActive } = body;

    console.log('Updating category:', { id, name, slug });

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists for other categories
    const existingCategory = await Category.findOne({
      slug: slug.trim().toLowerCase(),
      _id: { $ne: id }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim(),
        image,
        isActive: Boolean(isActive),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('Update result:', updatedCategory);

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating category' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params promise
    const { id } = await params;
    const body = await request.json();

    console.log('Patching category:', { id, body });

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params promise
    const { id } = await params;

    // Check if category has products
    const { default: Product } = await import('@/models/Product');
    const productCount = await Product.countDocuments({ category: id });

    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete category. It has ${productCount} product(s) associated.` 
        },
        { status: 400 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting category' },
      { status: 500 }
    );
  }
}