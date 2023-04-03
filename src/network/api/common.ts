import http from "../index";

export default {
    uploadFile(data) {
        return http({ url: "/common/upload", method: "post", data });
    },

    addBlog(data) {
        return http({ url: "/blog", method: "post", data });
    }
};
