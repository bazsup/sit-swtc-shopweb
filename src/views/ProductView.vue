<script setup>
import { onMounted } from "vue";
import ProductItem from "@/components/product/ProductItem.vue";
import { useApi } from "@/composables/api";
import { getProductList } from "@/services/product";

const productList = useApi(
  () => getProductList(),
  (r) => r.json()
);
onMounted(() => {
  productList.execute();
});
</script>

<template>
  <h1 class="font-bold text-2xl md:ml-4 mt-6 mb-4">Products</h1>
  <div v-if="productList.error.value" class="text-center mt-6">
    Could not load content, please try again
  </div>
  <div
    v-else-if="productList.result.value"
    class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
  >
    <ProductItem
      v-for="product in productList.result.value.data"
      :key="product.id"
      :item="product"
    />
  </div>
  <div v-else class="text-center mt-6">Loading...</div>
</template>
