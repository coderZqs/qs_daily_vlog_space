import axios from "axios";
import errorHandle from "./response-error";
const instance = axios.create({
  baseURL: "http://192.168.16.155:88",
  timeout: 5000
});

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    return response.status === 200
      ? Promise.resolve(response)
      : Promise.reject(response);
  },
  error => {
    const { response } = error;
    errorHandle(response.status, response.info);
  }
);

export default instance;
