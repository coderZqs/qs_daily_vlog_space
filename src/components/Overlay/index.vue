<template>
  <div class="mask">
    <div class="mask-cover" @click="closeByMask"></div>
    <transition name="fade">
      <!-- 内容区 -->
      <div class="mask-content">
        <!-- 插槽，放置要插入到遮罩里的内容 -->
        <slot name="default"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    //是否可以点击遮罩关闭，默认是
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="scss">
.mask {
  position: relative;
  color: #2e2c2d;
  font-size: 16px;
}
.mask-cover {
  background: rgba($color: #000000, $alpha: 0.5);
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask-content {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 0;
  left: 0;
}

//动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
