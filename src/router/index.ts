import { createRouter, createWebHistory } from "vue-router";
// import routes from "@/autoRouterConfig";
import Layout from "@/views/index.vue";

const ConstantRouterMap = [
  {
    path: "/",
    component: Layout
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
    path: "/article",
    redirect: "/article/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/article/index.vue")
      },
      {
        path: ":id",
        component: () => import("@/views/article/detail.vue")
      },
      {
        path: "edit",
        component: () => import("@/views/article/edit.vue")
      }
    ]
  },

  {
    path: "/target",
    component: () => import("@/views/target/index.vue")
  },

  {
    path: "/topic",
    component: () => import("@/views/topic/index.vue")
  },

  {
    path: "/clendar",
    component: () => import("@/views/clendar/index.vue")
  },

  // 3D区
  {
    path: "/3d-land",
    component: () => import("@/views/lands/index.vue")
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [/* ...routes, */ ...ConstantRouterMap]
});

export default router;
