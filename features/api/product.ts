// import fetcher from "./fetcher";
import axiosInstance from "./axiosConfig";
import { Product } from "@/features/redux/types/product";

export const getCategories = async (): Promise<string[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data
};


export const getProductsByTag = async (
  tag: string,
  limit = 10
): Promise<Product[]> => {
  const response = await axiosInstance.get("/products-by-tag", {
    params: { tag, limit },
  });
  return response.data
};

export const getProductBySlug = async (slug: string) : Promise<Product> => {
  const response = await axiosInstance.get(`/product/${slug}`);
  return response.data
};

export const getRelatedProductsByCategory = async (
  category: string,
  productId: string,
  limit = 9,
  page = 1
) => {
  const response = await axiosInstance.get(`/products/related`, {
    params: {
      category,
      productId,
      limit,
      page,
    },
  });
  return response.data
};
