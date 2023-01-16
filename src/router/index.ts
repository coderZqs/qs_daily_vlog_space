import { createRouter, createWebHistory } from "vue-router";
import routes from "@/autoRouterConfig";
import Layout from "@/views/index.vue"

const ConstantRouterMap = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "3d-land",
        component: () => import("@/views/lands/index.vue"),
      },
      {
        path: "image-effects",
        component: () => import("@/views/image-effects/index.vue"),
      },
      {
        path: "article",
        component: () => import("@/views/article/index.vue")
      },
      {
        path: "article/:id",
        component: () => import("@/views/article/detail.vue"),
      },
    ]
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    ...ConstantRouterMap,
  ],
});

export default router;
