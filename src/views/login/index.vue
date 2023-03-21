<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import UserApi from "@/network/api/user";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import jsCookie from "js-cookie";
import { useRouter } from "vue-router";
let router = useRouter();

const login = async () => {
  try {
    let { code, msg, data } = await UserApi.login({
      mobile: 15387716407,
      password: "zqszzz"
    });

    if (SUCCESS(code)) {
      jsCookie.set("authorization", data);
      router.push("/article/1");
    } else {
      message.error(msg);
    }
  } catch (err) {}
};

onMounted(async () => {
  login();
});
</script>

<style scoped></style>
