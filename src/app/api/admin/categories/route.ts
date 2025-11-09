import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import { getCurrentAdmin } from '@/lib/auth';

// GET all categories
export async function GET() {
  try {
    await connectToDatabase();
    
    const categories = await Category.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// CREATE new category
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new category...');
    
    const admin = await getCurrentAdmin();
    if (!admin) {
      console.log('❌ Unauthorized category creation attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    console.log('✅ Database connected');

    const { name, description, image } = await request.json();
    console.log('📦 Category data:', { name, description, image: image ? 'Image provided' : 'No image' });

    if (!name || !description) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    console.log('🔗 Generated slug:', slug);

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug }]
    });

    if (existingCategory) {
      console.log('❌ Category already exists:', existingCategory.name);
      return NextResponse.json(
        { message: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    console.log('🆕 Creating new category...');
    const category = new Category({
      name,
      slug,
      description,
      image: image || '',
    });

    await category.save();
    console.log('✅ Category created successfully:', category.name);

    return NextResponse.json(
      { 
        message: 'Category created successfully',
        category 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error creating category:', error);
    
    // More specific error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Category with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Validation error', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error creating category: ' + error.message },
      { status: 500 }
    );
  }
}