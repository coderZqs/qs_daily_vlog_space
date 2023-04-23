<template>
  <div class="page-home">
    <div class="module-introduce" ref="canvas"></div>
    <div class="info">
      <div
        class="container flex items-center"
        style="overflow: hidden; height: 100%; width: 100%"
      >
        <div
          class="card-container relative"
          style="perspective: 800px; transform-style: preserve-3d"
        >
          <div class="card" @mousemove="cardMouseMove" @mouseleave="resetPoi">
            <!-- <div class="card-title">今日看板</div> -->
            <div class="target-model card-item">
              <h1>今日目标</h1>

              <div class="today">
                <div class="target-input">
                  <input
                    type="text"
                    v-model="targetValue"
                    @keyup.enter="createTarget"
                    placeholder="做你想要做的事情"
                  />
                </div>

                <div class="target-list" v-for="item in targets" :key="item.id">
                  <a-checkbox>
                    <span style="color: white"> {{ item.content }}</span>
                  </a-checkbox>
                </div>
              </div>
            </div>
            <div ref="cardContainer" class="bg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import Emoji from "./hooks/emoji";
import useTarget from "./hooks/target";
import { onMounted, ref, onUnmounted } from "vue";
import { curStartTime, curEndTime } from "@/utils/date";

let { addTarget, getTarget, targets } = useTarget();

let canvas = ref();
let cardContainer = ref();
let targetValue = ref("");

/**
 * 创建目标
 */

const createTarget = async () => {
  let data = {
    content: targetValue.value,
    start_at: curStartTime(),
    end_at: curEndTime()
  };

  await addTarget(data);
  message.success("添加成功");
  targetValue.value = "";
  getTarget();
};

/**
 * 卡片鼠标交互
 */

const cardMouseMove = e => {
  let { offsetX, offsetY } = e;
  let { height, width } = e.currentTarget.getBoundingClientRect();
  let deg = 2;
  e.currentTarget.style.transform = `rotateX( ${
    -1 * (offsetY / height - 0.5) * deg
  }deg ) rotateY(${(offsetX / width - 0.5) * deg}deg)`;

  cardContainer.value.style.left = e.offsetX - 300 + "px";
  cardContainer.value.style.top = e.offsetY - 300 + "px";
  cardContainer.value.style.opacity = 1;
};

/**
 * 重回状态
 */

const resetPoi = e => {
  e.currentTarget.style.transform = "none";
  cardContainer.value.style.opacity = 0;
};

/**
 * 离开页面停止定时器
 */

window.addEventListener("visibilityChange", () => {
  if (document.hidden) {
    Emoji.stop();
  } else {
    Emoji.start();
  }
});

onMounted(() => {
  Emoji.run(canvas.value);
  getTarget();
});

onUnmounted(() => {
  Emoji.clear();
});
</script>

<style lang="scss" scoped>
.page-home {
  height: calc(100vh - $navbar-height);
  overflow: hidden;
}

.module-introduce {
  position: absolute;
  width: 100%;
  overflow: hidden;
}

.info {
  z-index: 99;
  height: 100%;
  overflow: hidden;

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
  margin: 12px;
  padding: 12px;
  height: 300px;
  width: 500px;
  color: white;

  h1 {
    color: white;
    font-size: 20px;
  }

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

  .target-list {
    margin-top: 12px;
  }
}

.card-item {
}
</style>
