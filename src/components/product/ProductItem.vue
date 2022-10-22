<script setup>
import { setNumberOfItems } from "@/store";
import { addProductToCart } from "@/services/cart";
import { useApi } from "@/composables/api";
import { store } from "../../store";

const props = defineProps({
  item: Object,
});

async function addToCart() {
  const productId = props.item.id;
  const addToCartApi = useApi(
    () => addProductToCart({ cartId: store.cartId, productId }),
    (r) => r.json()
  );
  await addToCartApi.execute();
  if (addToCartApi.result.value !== null) {
    setNumberOfItems(addToCartApi.result.value.numberOfItems);
  }
}
</script>

<template>
  <div class="group relative" data-cy="product-item">
    <div
      class="pw-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none"
    >
      <img
        data-cy="product-item--image"
        :src="props.item.imageUrl"
        :alt="props.item.name"
        class="w-full h-full object-center object-cover lg:w-full lg:h-full"
      />
    </div>
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-sm text-gray-700">
          <span data-cy="product-item--name" aria-hidden="true">{{
            props.item.name
          }}</span>
        </h3>
      </div>
      <p
        data-cy="product-item--price"
        class="text-sm font-medium text-gray-900"
      >
        ${{ props.item.price }}
      </p>
    </div>
    <div class="flex space-x-2 justify-center mt-2">
      <button
        data-cy="product-item--add-to-cart"
        @click="addToCart()"
        class="add-to-cart-button px-6 py-1 transition ease-in duration-200 w-full rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
      >
        Add to cart
      </button>
    </div>
  </div>
</template>
