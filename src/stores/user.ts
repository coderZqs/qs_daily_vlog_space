import { reactive } from "vue";
import { defineStore } from "pinia";
import { User } from "@/types/user";
import UserApi from "@/network/api/user";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import jsCookie from "js-cookie";
import router from "../router/index"

export default defineStore("user", () => {
  let userInfo = reactive<User | object>({});

  const SAVEINFO = (val: User) => {
    userInfo = val;
  };

  const LOGIN = async loginParams => {
    try {
      let { code, msg, data } = await UserApi.login(loginParams);

      if (SUCCESS(code)) {
        jsCookie.set("authorization", data);
        message.success('登录成功')
        router.push("/article/index");
      } else {
        message.error(msg)
      }
    } catch (err) { }
  };

  const GETINFO = async () => {
    let { code, msg, data } = await UserApi.getInfo();

    if (SUCCESS(code)) {
      SAVEINFO(data);
    }

    return;
  };

  return { userInfo, SAVEINFO, LOGIN, GETINFO };
});
