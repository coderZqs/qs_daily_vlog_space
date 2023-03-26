<template>
  <div class="header flex justify-between items-center" :style="{ backgroundColor: scrollTop === 0 ? 'white' : 'black' }"
    ref="headerRef">
    <div class="icon-area"></div>
    <comp-eye class="eye"></comp-eye>
    <div class="menu flex mr-8" :style="{ color: scrollTop === 0 ? 'black' : 'white' }">
      <div class="menu-item">我的主页</div>
      <div class="menu-item" @click="routerTo('/article/index')">忙于记录</div>
      <div class="menu-item">关于我的</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CompEye from "./eye-comp.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
const router = useRouter();
const routerTo = (url: string) => {
  router.push(url);
};

let headerRef = ref();
let scrollTop = ref(0);

onMounted(() => {
  window.onscroll = (e) => {
    scrollTop.value = document.documentElement.scrollTop;
  }
})
</script>


<style lang="scss" scoped>
.header {
  height: 64px;
  line-height: 64px;
  position: fixed;
  top: 0;
  width: 100%;
  color: black;
  transition: all 0.5s;
  z-index: 9
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
    cursor: pointer;
  }
}
</style>
