import api from "./api";

// USER CARTS
export const getMyCarts = async () => {
  const response = await api.get("/carts/my");
  return response.data;
};

export const createCart = async (cartData) => {
  const response = await api.post("/carts", cartData);
  return response.data;
};

export const addItemToCart = async (cartId, itemData) => {
  const response = await api.post(`/carts/${cartId}/items`, itemData);
  return response.data;
};

export const submitCart = async (cartId) => {
  const response = await api.put(`/carts/${cartId}/submit`);
  return response.data;
};

// LEADERSHIP
export const getLeadershipCarts = async () => {
  const response = await api.get("/carts"); // 🔥 THIS IS IMPORTANT
  return response.data;
};

export const updateCartStatus = async (cartId, status) => {
  const response = await api.put(`/carts/${cartId}/status`, { status });
  return response.data;
};

// CART ITEM MANAGEMENT
export const updateCartItem = async (cartId, itemId, quantity) => {
  const response = await api.put(`/carts/${cartId}/items/${itemId}`, {
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (cartId, itemId) => {
  const response = await api.delete(`/carts/${cartId}/items/${itemId}`);
  return response.data;
};