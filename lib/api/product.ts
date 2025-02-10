import fetcher from './fetcher';

export const getProductBySlug = async (slug: string, useLocal = false) => {
  return fetcher(`/product/${slug}`, useLocal);
};

export const getRelatedProductsByCategory = async (
  category: string,
  productId: string,
  limit = 9,
  page = 1,
  useLocal = false
) => {
  const queryParams = new URLSearchParams({
    category,
    productId,
    limit: limit.toString(),
    page: page.toString(),
  });
  return fetcher(`/products/related?${queryParams}`, useLocal);
};