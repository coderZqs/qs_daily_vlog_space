import http from "../index";

export default {
  getBlog(params) {
    return http({ url: "/blog", method: "get", params });
  },

  addBlog(data) {
    return http({ url: "/blog", method: "post", data });
  }
};
