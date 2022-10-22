import { createRouter, createWebHistory } from "vue-router";
import ProductView from "../views/ProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ProductView,
    },
    {
      path: "/cart/summary",
      name: "cart-summary",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CartSummaryView.vue"),
    },
  ],
});

export default router;
