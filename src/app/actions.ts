'use server';

export async function getCategories() {
  try {
    // Use the correct port - your app is running on 3000
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/categories?includeProductsCount=true`;
    
    console.log('🔄 Fetching categories from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Categories API Response status:', response.status);

    if (!response.ok) {
      console.error('❌ Categories API response not OK:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('✅ Categories API success, found:', data.categories?.length, 'categories');
    
    return data.categories || [];
    
  } catch (error) {
    console.error('💥 Error fetching categories:', error);
    return [];
  }
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  page?: string;
  limit?: string;
  featured?: boolean;
}) {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page);
    if (params?.limit) searchParams.append('limit', params.limit || '24');
    if (params?.featured) searchParams.append('featured', 'true');

    // Use the correct port - your app is running on 3000
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/products?${searchParams}`;
    
    console.log('🔄 Fetching products from:', apiUrl);

    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Products API Response status:', response.status);

    if (!response.ok) {
      console.error('❌ Products API response not OK:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('✅ Products API success, found:', data.products?.length, 'products');
    
    return data.products || [];
    
  } catch (error) {
    console.error('💥 Error fetching products:', error);
    return [];
  }
}

// Keep other functions the same...
export async function getProductBySlug(slug: string) {
  try {
    const products = await getProducts();
    const product = products.find((p: any) => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const categories = await getCategories();
    const category = categories.find((c: any) => c.slug === slug);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}