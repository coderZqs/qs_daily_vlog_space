import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/index.vue";
import routes from "@/autoRouterConfig";

const ConstantRouterMap = [
  {
    path: "/image-effects",
    component: () => import("@/views/image-effects/index.vue"),
  },
  {
    path: "/article",
    component: () => import("@/views/article/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /*     ...routes, */
    ...ConstantRouterMap,
    {
      path: "/",
      component: HomeView,
    },
  ],
});

export default router;
