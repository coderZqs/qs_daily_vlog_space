<template>
  <div class="comp-eye">
    <div class="eye-dot"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    // let dotList: Ref<{ x: number; y: number }[]> = ref([]);

    /*  let calcPoibyAngle = (
    angle: number,
    size: { width: number; height: number },
    centerPoi: { x: number; y: number }
  ) => {
    return {
      x: (size.width / 2) * Math.cos(angle) + centerPoi.x,
      y: (size.height / 2) * Math.sin(angle) + centerPoi.y,
    };
  }; */

    onMounted(() => {
      let dot = document.querySelector(".eye-dot");
      let dotContainer = document.querySelector(".comp-eye");
      let {
        left: boxLeft,
        top: boxTop,
        width: boxWidth,
        height: boxHeight,
      } = dotContainer?.getBoundingClientRect() as DOMRect;

      let calcPoibyAngle = (
        angle: number,
        r: number,
        centerPoi: { x: number; y: number }
      ) => {
        return {
          x: (r / 2) * Math.cos(angle) + centerPoi.x,
          y: (r / 2) * Math.sin(angle) + centerPoi.y,
        };
      };

      window.onmousemove = (e) => {
        let sourcePoi = {
          x: boxLeft + boxWidth / 2,
          y: boxTop + boxHeight / 2,
        };
        let { pageX, pageY } = e;

        let angle =
          (Math.atan2(pageY - sourcePoi.y, pageX - sourcePoi.x) * 180) /
          Math.PI;
        angle = ((angle + 360) % 360) + 90;

        // console.log(angle);

        dot.style.rotate = angle + "deg";
      };
    });
  },
});
</script>

<style lang="scss" scoped>
.comp-eye {
  width: 30px;
  height: 20px;
  border-radius: 50%;
  background: black;
  margin: 0 auto;
  position: relative;
  z-index: 9;

  &:hover {
    .eye-dot {
      transition: 0.2s all;
      scale: 1.2;
    }
  }

  .eye-dot {
    position: absolute;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: white;
    left: 50%;
    transform-origin: 0 9px;
    transform: translateX(-50%) translateY(1px);
  }
}
</style>
