import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.scss";
import Antd from "ant-design-vue";
import "tailwindcss/tailwind.css";
import "ant-design-vue/dist/antd.css";
import "regenerator-runtime";

const app = createApp(App);

app.use(Antd);
app.use(createPinia());
app.use(router);

app.mount("#app");
