import http from "../index";

export default {
  uploadFile(data) {
    return http({ url: "/common/upload", method: "post", data });
  },

  getOneWord() {
    return http({ url: "/common/oneword", method: "get" });
  }
};
