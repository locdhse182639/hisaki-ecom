import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/features/api/axiosConfig";

export const fetchBrowsingHistoryProducts = createAsyncThunk(
  "browsingHistory/fetchProducts",
  async (params: {
    type: "history" | "related";
    categories: string[];
    ids: string[];
  }) => {
    const { type, categories, ids } = params;
    if (!categories.length || !ids.length) return []; 

    const queryParams = new URLSearchParams({
      type,
      categories: categories.join(","),
      ids: ids.join(","),
    });

    try {
      const response = await axiosInstance.get(
        `/products/browsing-history?${queryParams}`
      );
      return response.data || response; 
    } catch (error) {
      console.error("Error in fetchBrowsingHistoryProducts:", error);
      throw error;
    }
  }
);
