<template>
  <div class="box" ref="box" :style="{ height: props.height }">
    <div class="sticky-content flex justify-center items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let props = withDefaults(defineProps<{ height: string | number }>(), {
  height: "300vh"
});

let box = ref();

const init = animateList => {
  return animate(box.value, animateList);
};

/**
 *
 * @param className
 * @param param1
 *
 * 计算运动
 */

const animate = (element, animation) => {
  if (element) {
    let { top, height } = element?.getBoundingClientRect();
    // 滚动条到元素的距离，当元素为展示在屏幕，则<=0
    let scrollOverContainerDistance = height - Math.abs(top);
    // 判断是否是否滚动到元素
    let isScrollInContainer = top <= 0 && scrollOverContainerDistance >= 0;
    // 滚动到元素的比例
    let scrollInContainerProportion =
      Math.abs(top) / (height - window.innerHeight);

    if (isScrollInContainer) {
      if (animation.length) {
        generateAnimateByConfig(
          scrollInContainerProportion,
          element,
          animation
        );
      }
    }

    return { scrollInContainerProportion };
  }
};

const generateAnimateByConfig = (
  scrollInContainerProportion,
  element,
  animation
) => {
  animation.forEach(item => {
    let start = percentToPoint(item.start || "0%");
    let end = percentToPoint(item.end || "100%");
    let ele = element.querySelector(item.ele);

    if (ele && item.step) {
      let attrs = { left: 0, top: 0, scale: 1 };
      if (ele.style.transform) {
        attrs = getTransformValue(ele.style.transform);
      }

      // 有配置则配置，无配置则默认

      let step = (scrollInContainerProportion - start) / (end - start);

      // 边界判断

      if (step < 0) {
        step = 0;
      }

      if (step > 1) {
        step = 1;
      }

      let x = item.step.x ? item.step["x"] * step + "px" : attrs.left;
      let y = item.step.y ? item.step["y"] * step + "px" : attrs.top;
      let opacity = item.step.opacity
        ? item.step["opacity"] * step
        : ele.style.opacity;

      let scale = item.step.scale
        ? 1 + (item.step["scale"] - 1) * step
        : attrs.scale;
        
      ele.style.transform = `translate(${x},${y}) scale(${scale})`;

      if (item.step.opacity) {
        ele.style.opacity = opacity;
      }
    }
  });
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

const getNumberByPx = str => {
  return str.replace("px", "");
};

/**
 * 百分转小数
 * @param percentToPoint
 */

const percentToPoint = percent => {
  var str = percent.replace("%", "");
  str = str / 100;
  return str;
};

defineExpose({ init });
</script>

<style lang="scss" scoped>
.box {
  height: 300vh;
  position: relative;
  .sticky-content {
    position: sticky;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    top: 0;
  }
}
</style>
