<template>
  <!-- <div class="page-login">
    <div class="canvas"></div>
    <div class="form">
      <div class="form-item">
        <input
          type="text"
          placeholder="请输入账号"
          v-model="formState.mobile"
        />
      </div>
      <div class="form-item">
        <input
          type="text"
          placeholder="请输入密码"
          v-model="formState.password"
        />
      </div>
      <div class="form-item">
        <div class="login-btn" @click="loign">进入生命画卷</div>
      </div>
    </div>
  </div> -->

  <div>
    <div>
      <div class="first-step box" style="margin-top: 100vh">
        <div class="sticky-content flex justify-center items-center">
          <div class="test">
            <Clock :size="clockSize"></Clock>
          </div>
        </div>
      </div>
      <div class="second-step box">
        <div class="sticky-content">
          <div class="circle">1</div>
          <div class="circle2">2</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
import Clock from "@/components/Clock/index.vue";
let router = useRouter();
let { LOGIN } = useStore();

interface FormState {
  mobile: string;
  password: string;
}

const clockSize = ref(200);

const formState = reactive<FormState>({
  mobile: "",
  password: ""
});

const loign = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};

onMounted(() => {
  document.body.addEventListener("scroll", e => {
    calcAnimate(".second-step", [
      { ele: ".circle", step: { x: 400 }, start: "10%", end: "50%" },
      { ele: ".circle2", step: { x: 500 }, start: "25%", end: "80%" }
    ]);

    calcAnimate(".first-step", [{ ele: ".test", step: { x: 500, scale: 3 } }]);
  });
});

/**
 *
 * @param className
 * @param param1
 */

const calcAnimate = (className, animation) => {
  let container = document.querySelector(className);
  if (container) {
    let { top, height } = container?.getBoundingClientRect();
    // 滚动条到元素的距离，当元素为展示在屏幕，则<=0
    let scrollOverContainerDistance = height - Math.abs(top);
    // 判断是否是否滚动到元素
    let isScrollInContainer = top <= 0 && scrollOverContainerDistance >= 0;
    // 滚动到元素的比例
    let scrollInContainerProportion =
      Math.abs(top) / (height - window.innerHeight);

    if (isScrollInContainer) {
      if (animation.length) {
        animation.forEach(item => {
          let ele = container.querySelector(item.ele);
          if (
            ele &&
            item.step &&
            scrollInContainerProportion > toPoint(item.start || "0%") &&
            scrollInContainerProportion < toPoint(item.end || "100%")
          ) {
            let attrs = { left: 0, top: 0, scale: 1 };
            if (ele.style.transform) {
              attrs = getTransformValue(ele.style.transform);
            }

            // 有配置则配置，无配置则默认

            let x = item.step.x
              ? item.step["x"] * scrollInContainerProportion + "px"
              : attrs.left;
            let y = item.step.y
              ? item.step["y"] * scrollInContainerProportion + "px"
              : attrs.top;
            let scale = item.step.scale
              ? 1 + (item.step["scale"] - 1) * scrollInContainerProportion
              : attrs.scale;

            ele.style.transform = `translate(${x},${y}) scale(${scale})`;
          }
        });
      }
    }
  }
};

/**
 * 获取transform 的数据
 * @param transform
 */

const getTransformValue = transform => {
  let scale = transform.match(/\.*scale\((.*)\)/i)[1];
  let translate = transform.match(/\.*translate\((.+?)\)/i)[1];
  let left = translate.split(",")[0];
  let top = translate.split(",")[1];

  return { scale, left, top };
};

const toPoint = percent => {
  var str = percent.replace("%", "");
  str = str / 100;
  return str;
};
</script>

<style lang="scss" scoped>
.page-login {
  width: 100%;
  height: calc(100vh - $navbar-height);
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 400px;

    .form-item {
      margin: 30px 0;
    }

    input {
      border-radius: 4px;
      width: 300px;
      outline: none;
      background: #e8eff7;
      border: none;
      height: 40px;
      display: block;
      padding: 4px 12px;
      box-sizing: border-box;
    }
  }

  .login-btn {
    height: 40px;
    width: 300px;
    border-radius: 8px;
    background: #455ff0;
    text-align: center;
    line-height: 40px;
    color: white;
    transition: 0.3s all;
    cursor: pointer;

    &:hover {
      box-shadow: -10px 10px 16px gray;
    }
  }
}

.box {
  background: #f5f5f5;
  height: 300vh;
  position: relative;
  .sticky-content {
    position: sticky;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    top: 0;

    .circle,
    .circle2 {
      height: 100px;
      width: 100px;
      background: red;
    }

    .circle2 {
      left: calc(100% - 100px);
    }
  }
}

.ddbox2 {
  background: white;
}
</style>
