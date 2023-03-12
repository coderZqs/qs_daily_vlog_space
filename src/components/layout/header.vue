<template>
  <div class="header flex justify-between items-center">
    <div class="icon-area"></div>
    <comp-eye class="eye"></comp-eye>
    <div class="menu flex mr-8">
      <div class="menu-item">我的主页</div>
      <div class="menu-item" @click="routerTo('/article')">忙于记录</div>
      <div class="menu-item">关于我的</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CompEye from "./eye-comp.vue";
import { useRouter } from "vue-router"
const router = useRouter();
const routerTo = (url: string) => {
  router.push(url)
}
</script>

<style lang="scss" scoped>
.header {
  height: 64px;
  line-height: 64px;
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  color: black;
}

.eye {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu {
  display: flex;

  .menu-item {
    margin: 0 20px;
  }
}
</style>
