import http from "../index";

export default {
    getBill(params) {
        return http({ url: "/bill", method: "get", params });
    },

    addBill(data) {
        return http({ url: "/bill", method: "post", data });
    }
};
