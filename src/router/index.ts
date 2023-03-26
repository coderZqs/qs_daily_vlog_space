import { createRouter, createWebHistory } from "vue-router";
// import routes from "@/autoRouterConfig";
import Layout from "@/views/index.vue";

const ConstantRouterMap = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue")
  },
  {
    path: "/home",
    component: () => import("@/views/home/index.vue")
  },
  {
    path: "/3d-land",
    component: () => import("@/views/lands/index.vue")
  },
  {
    path: "/article/index",
    component: () => import("@/views/article/index.vue")
  },
  {
    path: "/article/:id",
    component: () => import("@/views/article/detail.vue")
  },
  {
    path: "/chat",
    component: () => import("@/views/chat/index.vue")
  },
  {
    path: "/article/edit",
    component: () => import("@/views/article/edit.vue")
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [/* ...routes, */ ...ConstantRouterMap]
});

export default router;
