import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./index.scss";
import Antd from "ant-design-vue";
import "tailwindcss/tailwind.css";
import "ant-design-vue/dist/antd.css";
import "regenerator-runtime";
import "./assets/icon/iconfont.css"
import "./assets/styles/reset.scss"
import "./permission";

const app = createApp(App);

app.use(Antd);
app.use(createPinia());
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
