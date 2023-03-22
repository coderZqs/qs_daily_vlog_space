import http from "../index";

export default {
  login(data) {
    return http({ url: "/user/login", method: "post", data });
  },

  register(data) {
    return http({ url: "/user/register", method: "post", data });
  },

  getInfo() {
    return http({ url: "/user/info", method: "get" });
  }
};
