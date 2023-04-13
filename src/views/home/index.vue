<template>
  <div>
    <div class="module-introduce" ref="canvas"></div>
    <div class="info">
      <div class="container flex items-center" style="overflow:hidden;height:100%;width:100%;">
        <div class="card-container relative" style="perspective:800px; transform-style: preserve-3d;">
          <div class="card flex flex-col justify-center items-center" @mousemove="cardMouseMove" @mouseleave="resetPoi">
            <div class="target-model">
              <div class="target-input">
                <input type="text" placeholder="做你想要做的事情">
              </div>
              <!-- 前往记录 -->

              <!-- 今日任务 -->

              <!-- 今日特征 -->
            </div>
            <div ref="cardContainer" class="bg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import Emoji from "./hooks/emoji";
import { onMounted, ref, onUnmounted } from "vue";

let canvas = ref()
let cardContainer = ref();

/**
 * 卡片鼠标交互
 */

const cardMouseMove = (e) => {
  let { offsetX, offsetY } = e;
  let { height, width } = e.currentTarget.getBoundingClientRect();
  let deg = 2;
  e.currentTarget.style.transform = `rotateX( ${-1 * (offsetY / height - 0.5) * deg}deg ) rotateY(${(offsetX / width - 0.5) * deg}deg)`

  cardContainer.value.style.left = e.offsetX - 300 + 'px';
  cardContainer.value.style.top = e.offsetY - 300 + 'px';
  cardContainer.value.style.opacity = 1;
}

/**
 * 重回状态
 */

const resetPoi = (e) => {
  e.currentTarget.style.transform = "none"
  cardContainer.value.style.opacity = 0;
}

/**
 * 离开页面停止定时器
 */

window.addEventListener('visibilityChange', () => {
  if (document.hidden) {
    Emoji.stop();
  } else {
    Emoji.start();
  }
})


onMounted(() => {
  Emoji.run(canvas.value);
})

onUnmounted(() => {
  Emoji.clear()
})
</script>

<style lang="scss" scoped>
.module-introduce {
  width: 100%;
  overflow: hidden;
}


.info {
  z-index: 99;
  position: absolute;
  width: 100%;
  top: 64px;
  height: calc(100% - 64px);

  .card-container {
    width: 100%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .card {
    overflow: hidden;
    background: rgba(gray, 0.3);
    backdrop-filter: blur(5px);
    width: 100%;
    height: 100%;
    // transform: rotateY(5deg);

    .bg {
      z-index: -1;
      position: absolute;
      height: 600px;
      width: 600px;
      border-radius: 300px;
      pointer-events: none;
      background: #7ee787;
      opacity: 0;
      filter: blur(180px);
      mix-blend-mode: soft-light;
      transition: opacity 0.3s;
      will-change: transform;
    }
  }
}


.target-model {
  display: flex;
  justify-content: center;
  align-items: center;

  .target-input {
    height: 40px;
    width: 300px;

    input {
      border-bottom: 1px solid black;
      background: transparent;
      height: 100%;
      outline: none;
      width: 100%;
    }
  }
}
</style>
