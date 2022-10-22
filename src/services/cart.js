import { BASE_URL } from "@/config/api";

const headers = {
  "Content-Type": "application/json",
};

export function addProductToCart({ cartId, productId }) {
  return {
    url: BASE_URL + "/cart/add",
    method: "POST",
    headers,
    body: JSON.stringify({ cartId, productId }),
  };
}

export function getCartSummary({ cartId }) {
  return {
    url: BASE_URL + `/cart/summary?cartId=${cartId}`,
    method: "GET",
  };
}

export function applyCoupon({ cartId, coupon }) {
  return {
    url: BASE_URL + `/cart/applyCoupon`,
    method: "POST",
    headers,
    body: JSON.stringify({ cartId, coupon }),
  };
}
