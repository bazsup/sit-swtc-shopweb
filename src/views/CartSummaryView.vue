<script setup>
import { onMounted, reactive, ref } from "vue";
import { useApi } from "@/composables/api";
import { applyCoupon, getCartSummary } from "@/services/cart";
import { store } from "@/store";
import { decimalFormat } from "@/tools/decimalFormat";

const userCoupon = ref("");
const coupon = reactive({
  valid: false,
  description: "",
});

const cartSummary = useApi(
  (cartId) => getCartSummary({ cartId }),
  (r) => r.json()
);
onMounted(() => {
  cartSummary.execute(store.cartId);
});

async function applyForCoupon() {
  const couponApply = useApi(
    (coupon) => applyCoupon({ cartId: store.cartId, coupon }),
    (r) => r.json()
  );
  await couponApply.execute(userCoupon.value);
  if (couponApply.result.value !== null) {
    coupon.description = couponApply.result.value.description;
    coupon.valid = true;
  } else if (String(couponApply.error.value.code) === "400") {
    coupon.description = couponApply.error.value.message;
    coupon.valid = false;
  }
  cartSummary.execute(store.cartId);
}
</script>

<template>
  <div class="flex justify-center my-6">
    <div
      class="flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5"
    >
      <h1 class="font-bold text-2xl md:ml-4 mb-4">Cart Summary</h1>
      <div
        v-if="cartSummary.error.value"
        class="flex items-center justify-center h-32"
      >
        Could not load content, please try again
      </div>
      <div v-else-if="cartSummary.result.value" class="flex-1">
        <table class="w-full text-sm lg:text-base" cellspacing="0">
          <thead>
            <tr class="h-12">
              <th class="text-left md:pl-4">Items</th>
              <th class="lg:text-right text-left pl-5 lg:pl-0">
                <span class="lg:hidden" title="Quantity">Qtd</span>
                <span class="hidden lg:inline">Quantity</span>
              </th>
              <th class="hidden text-right md:table-cell">Unit price</th>
              <th class="text-right">Total price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in cartSummary.result.value.lineItems"
              :key="index"
              data-cy="cart-summary-item"
            >
              <td>
                <a href="#">
                  <p data-cy="cart-summary-item--name" class="mb-2 md:ml-4">
                    {{ item.name }}
                  </p>
                </a>
              </td>
              <td class="justify-center md:justify-end md:flex">
                <div class="w-20 h-10">
                  <div class="relative flex flex-row w-full h-8">
                    <input
                      data-cy="cart-summary-item--quantity"
                      type="number"
                      :value="item.quantity"
                      readonly
                      class="w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black"
                    />
                  </div>
                </div>
              </td>
              <td class="hidden text-right md:table-cell">
                <span
                  data-cy="cart-summary-item--unit-price"
                  class="text-sm lg:text-base font-medium"
                  >${{ decimalFormat(item.unitPrice) }}</span
                >
              </td>
              <td class="text-right">
                <span
                  data-cy="cart-summary-item--total-price"
                  class="text-sm lg:text-base font-medium"
                  >${{ decimalFormat(item.quantity * item.unitPrice) }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
        <hr class="pb-6 mt-6" />
        <div class="border-b pb-4">
          <div class="flex justify-between">
            <div class="lg:px-2 lg:py-2 md:ml-2 text-center text-gray-800">
              Subtotal
            </div>
            <div class="lg:py-2 text-center text-gray-900" data-cy="subtotal">
              ${{ decimalFormat(cartSummary.result.value.subtotal) }}
            </div>
          </div>
          <div class="flex justify-between">
            <div
              class="lg:px-2 lg:py-2 md:ml-2 text-center text-gray-800"
              data-cy="discount-name"
            >
              Discount: {{ cartSummary.result.value.discountName }}
            </div>
            <div
              class="lg:py-2 text-center text-gray-900"
              data-cy="discount-amount"
            >
              -${{ decimalFormat(cartSummary.result.value.discountAmount) }}
            </div>
          </div>
          <div class="flex justify-between">
            <div
              class="lg:px-2 lg:py-2 md:ml-2 text-center font-bold text-gray-800"
            >
              Total
            </div>
            <div
              class="lg:py-2 text-center font-bold text-gray-900"
              data-cy="total"
            >
              ${{ decimalFormat(cartSummary.result.value.total) }}
            </div>
          </div>
        </div>
        <div class="my-4 mt-6 -mx-2">
          <div class="lg:px-2 lg:flex items-center">
            <div class="px-2 lg:w-1/2 mb-2">
              <h1 class="md:ml-2 font-bold uppercase">Coupon Code</h1>
            </div>
            <div class="p-2 lg:w-1/2">
              <div class="">
                <form @submit.prevent="applyForCoupon()">
                  <div
                    class="flex items-center w-full h-12 pl-3 bg-white bg-gray-100 border rounded-full"
                  >
                    <input
                      type="coupon"
                      name="code"
                      id="coupon"
                      placeholder="Apply coupon"
                      v-model="userCoupon"
                      class="w-full bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none"
                      data-cy="coupon-code"
                    />
                    <button
                      type="submit"
                      class="text-sm flex items-center px-4 h-full text-white bg-gray-800 rounded-full outline-none md:px-4 hover:bg-gray-700 focus:outline-none active:outline-none"
                      data-cy="apply-coupon-button"
                    >
                      <svg
                        aria-hidden="true"
                        data-prefix="fas"
                        data-icon="gift"
                        class="w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"
                        />
                      </svg>
                      <span class="font-medium">Apply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="p-4 mt-1 rounded-md md:mx-4 border-dashed border-2 border-gray-500 pl-6"
            :class="{ 'bg-cyan-50': coupon.valid, 'bg-red-50': !coupon.valid }"
            v-if="coupon.description"
            data-cy="coupon-detail"
          >
            <p>Description</p>
            <p data-cy="coupon-description">{{ coupon.description }}</p>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-32">Loading...</div>
    </div>
  </div>
</template>

<style></style>
