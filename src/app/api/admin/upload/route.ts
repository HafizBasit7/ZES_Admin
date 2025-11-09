import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImage(file);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Error uploading image' },
      { status: 500 }
    );
  }
}