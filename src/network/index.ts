import axios from "axios";
import jsCookie from "js-cookie";

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
  baseURL: "http://192.168.16.155:88",
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
