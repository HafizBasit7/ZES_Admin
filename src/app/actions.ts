'use server';

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

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?${searchParams}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      return [];
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return [];
    }

    const text = await response.text();
    
    // Check if text is valid JSON
    if (!text.trim()) {
      console.error('Empty response');
      return [];
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response text:', text);
      return [];
    }

    const products = data.products || [];
    
    // Filter active products only for user side and ensure they have required fields
    return products
      .filter((product: any) => product.isActive)
      .map((product: any) => ({
        ...product,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        stock: product.stock || 0,
        images: product.images || [],
        features: product.features || [],
        specifications: product.specifications || {},
        // Ensure category is properly structured
        category: product.category ? {
          _id: product.category._id,
          name: product.category.name,
          slug: product.category.slug
        } : null
      }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

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

export async function getCategories() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Categories API response not OK:', response.status);
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Categories response is not JSON');
      return [];
    }

    const data = await response.json();
    const categories = data.categories || [];
    
    // Get products count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category: any) => {
        const products = await getProducts({ category: category.slug });
        return {
          ...category,
          productsCount: products.length
        };
      })
    );
    
    return categoriesWithCounts;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
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