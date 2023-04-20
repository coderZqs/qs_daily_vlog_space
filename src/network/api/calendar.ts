import http from "../index";

export default {
  getCalendar(params) {
    return http({ url: "/calendar", method: "get", params });
  },

  addCalendar(data) {
    return http({ url: "/calendar", method: "post", data });
  },

  updateCalendar(data) {
    return http({ url: "/calendar", method: "put", data });
  }
};
