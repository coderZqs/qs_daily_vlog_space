import http from "../index";

export default {
    getTarget(params) {
        return http({ url: "/target", method: "get", params });
    },

    addTarget(data) {
        return http({ url: "/target", method: "post", data })
    }
};
