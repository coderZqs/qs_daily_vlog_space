<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
let router = useRouter();

let { LOGIN } = useStore();

const login = async () => {
  await LOGIN({ mobile: 15387716407, password: "zqszzz" });
  router.push("/article/1");
};

onMounted(async () => {
  login();
});
</script>

<style scoped></style>
