import jsCookie from "js-cookie";
import router from "./router/index";
import useStore from "@/stores/user";
import _ from "lodash";

router.beforeEach((to, from, next) => {
  /*   let { userInfo, GETINFO } = useStore();
  
    let token = jsCookie.get("authorization");
    if (token) {
      // 判断是否有用户信息
      if (!userInfo || _.isEmpty(userInfo)) {
        GETINFO();
      }
    } */

  next();
});
