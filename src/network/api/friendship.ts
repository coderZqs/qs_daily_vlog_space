import http from "../index";

export default {
  getFriend(params) {
    return http({ url: "/friend", method: "get", params });
  },

  addFriend(data) {
    return http({ url: "/friend", method: "post", data });
  }
};
