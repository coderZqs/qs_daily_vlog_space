import jsCookie from "js-cookie";
import router from "./router/index";
import useStore from "@/stores/user";
import _ from "lodash";

router.beforeEach(async (to, from, next) => {
  let { userInfo, GETINFO } = useStore();

  console.log(userInfo)
  let token = jsCookie.get("authorization");
  if (token) {
    // 判断是否有用户信息
    if (!userInfo || _.isEmpty(userInfo)) {
      await GETINFO();
    }
  }

  next();
});
