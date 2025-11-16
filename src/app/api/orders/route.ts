import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

function generateOrderNumber(): string {
  return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting order creation process...');
    
    await connectToDatabase();
    console.log('✅ Database connected');

    const orderData = await request.json();
    console.log('📦 Order data received');
    
    // Validate required fields
    const { customer, shippingAddress, items, totalAmount, shippingFee, paymentMethod } = orderData;
    
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      console.log('❌ Missing customer information');
      return NextResponse.json(
        { success: false, message: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zipCode) {
      console.log('❌ Missing shipping address');
      return NextResponse.json(
        { success: false, message: 'Missing required shipping address' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      console.log('❌ No items in order');
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }

    console.log('📝 Creating order document...');

    // Generate unique order number
    const orderNumber = generateOrderNumber();
    console.log('🔢 Generated order number:', orderNumber);

    // Create order with explicit orderNumber
    const order = new Order({
      orderNumber: orderNumber, // Explicitly set order number
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'Pakistan',
      },
      items: items.map((item: any) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      shippingFee: shippingFee || 0,
      paymentMethod,
      notes: orderData.notes || '',
      status: 'pending',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
    });

    console.log('💾 Saving order to database...');
    await order.save();
    console.log('✅ Order saved successfully:', order.orderNumber);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    
    // More detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: validationErrors
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      console.error('Duplicate order number:', error.keyValue);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Duplicate order detected. Please try again.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error creating order: ' + error.message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}