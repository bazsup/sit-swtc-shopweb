import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

export const store = reactive({
  numberOfItems: 0,
  cartId: "",
});

export function setNumberOfItems(amount) {
  store.numberOfItems = amount;
  sessionStorage.setItem("numberOfItems", store.numberOfItems);
}

export function addNumberOfItems(amount) {
  store.numberOfItems += amount;
  sessionStorage.setItem("numberOfItems", store.numberOfItems);
}

export function initCart() {
  store.cartId = sessionStorage.getItem("cartId") ?? "";
  setNumberOfItems(Number(sessionStorage.getItem("numberOfItems") ?? 0));
  if (store.cartId === "") {
    store.cartId = uuidv4();
    sessionStorage.setItem("cartId", store.cartId);
  }
}
