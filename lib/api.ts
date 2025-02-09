export const fetchCategories = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  };
  
  export const fetchProductsByTag = async (tag: string, limit = 4) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?tag=${tag}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  };
  