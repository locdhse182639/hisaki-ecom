// import fetcher from "./fetcher";
import axiosInstance from "./axiosConfig";
import { Product } from "@/features/store/types/product";

export const getCategories = async (): Promise<string[]> => {
  return axiosInstance.get("/categories");
};


export const getProductsByTag = async (
  tag: string,
  limit = 10
): Promise<Product[]> => {
  return axiosInstance.get("/products-by-tag", {
    params: { tag, limit },
  });
};

export const getProductBySlug = async (slug: string) : Promise<Product> => {
  return axiosInstance.get(`/product/${slug}`);
};

export const getRelatedProductsByCategory = async (
  category: string,
  productId: string,
  limit = 9,
  page = 1
) => {
  return axiosInstance.get(`/products/related`, {
    params: {
      category,
      productId,
      limit,
      page,
    },
  });
};
