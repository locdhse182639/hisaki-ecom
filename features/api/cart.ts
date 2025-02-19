import axiosInstance from "./axiosConfig";

// Fetch cart details
export const getCart = async () => {
  const response = await axiosInstance.get("/cart");
  return response.data;
};

// Add item to cart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToCart = async (item: any) => {
  const response = await axiosInstance.post("/cart/add", item);
  return response.data;
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  const response = await axiosInstance.patch(`/cart/update/${userId}/${itemId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (itemId: string) => {
  const response = await axiosInstance.delete(`/cart/remove/${itemId}`);
  return response.data;
};

export const clearCart = async (userId: string) => {
  await axiosInstance.delete(`/cart/clear/${userId}`)
  return [];
}