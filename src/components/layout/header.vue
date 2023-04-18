<template>
  <div
    class="header flex justify-between items-center"
    :style="{ backgroundColor: scrollTop === 0 ? 'white' : 'black' }"
    ref="headerRef"
  >
    <!-- <div class="icon-area"></div> -->
    <div class="flex items-center icon-area">
      <comp-eye
        class="eye"
        :theme="scrollTop === 0 ? 'dark' : 'light'"
      ></comp-eye>
      <div
        class="title mt-1 ml-1"
        :style="{ color: scrollTop === 0 ? 'black' : 'white' }"
      >
        人生画卷
      </div>
    </div>

    <div
      class="menu flex mr-8"
      :style="{ color: scrollTop === 0 ? 'black' : 'white' }"
    >
      <div class="menu-item" @click="routerTo('/')">
        <img src="../../assets/icon/img/navbar/target.png" alt="" />
        <span>目标清单</span>
      </div>
      <div class="menu-item" @click="routerTo('/article/index')">
        <img src="../../assets/icon/img/navbar/daily.png" alt="" />
        <span>记莫等闲</span>
      </div>
      <div class="menu-item" @click="routerTo('/calendar')">
        <img src="../../assets/icon/img/navbar/calendar.png" alt="" />
        <span>我的日程</span>
      </div>
      <div class="menu-item" @click="routerTo('/topic')">
        <img src="../../assets/icon/img/navbar/topic.png" alt="" />
        <span>话题讨论</span>
      </div>
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
  window.onscroll = e => {
    scrollTop.value = document.documentElement.scrollTop;
  };
});
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
  z-index: 9;

  @include render(phone) {
    padding: 0 12px;
  }
}

.eye {
  /*   position: absolute;
  left: 50%;
  transform: translateX(-50%); */
}

.menu {
  display: flex;

  @include render(phone) {
    display: none;
  }

  .menu-item {
    display: flex;
    align-items: center;
    margin: 0 20px;
    cursor: pointer;

    img {
      width: 26px;
      height: 26px;
      margin-right: 4px;
    }
  }
}

.title {
  font-size: 22px;
  font-weight: 600;
  font-family: "Courier New", Courier, monospace;
}

.icon-area {
  margin-left: 30px;

  @include render(phone) {
    margin-left: 0;
  }
}
</style>
