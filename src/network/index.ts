import axios from "axios";
import jsCookie from "js-cookie";
import Router from "../router/index"

declare module "axios" {
  interface AxiosResponse<T = any> {
    code: number;
    msg: string;
    data: T;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

import errorHandle from "./response-error";
const instance = axios.create({
  baseURL: "http://localhost:88",
  timeout: 5000
});

instance.interceptors.request.use(
  config => {
    config.headers.authorization = jsCookie.get("authorization");
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    if (response.data.code === 2001) {
      Router.push("/login")
    }
    // 如果未登录，则直接退出登录。

    return response.status === 200
      ? Promise.resolve(response.data)
      : Promise.reject(response);
  },
  error => {
    const { response } = error;
    errorHandle(response.status, response.info);
  }
);

export default instance;
