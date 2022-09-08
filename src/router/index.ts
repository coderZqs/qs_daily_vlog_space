import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/index.vue";
import routes from "@/autoRouterConfig";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: "/",
      component: HomeView,
    },
  ],
});

export default router;
