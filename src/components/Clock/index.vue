<template>
  <canvas id="clock" :width="size" :height="size"></canvas>
</template>

<script setup lang="ts">
import { watch, onMounted, nextTick, ref } from "vue";

let props = withDefaults(defineProps<{ size: number; scale: number }>(), {
  size: 200,
  scale: 1
});

let context;

const scale = ref(props.scale);
const size = ref(props.size * props.scale);

watch(
  () => props.scale,
  val => {
    size.value = val * props.size;
    scale.value = val;
  }
);

onMounted(() => {
  const canvas: HTMLCanvasElement | null = document.querySelector("#clock");
  if (canvas) {
    let draw = () => {
      context = canvas.getContext("2d");
      context.save();
      context.clearRect(
        -size.value / 2,
        -size.value / 2,
        size.value,
        size.value
      );
      // 定时器旋转
      drawCenterDot(context);
      // 画圆
      drawCircle(context);
      // 画刻度
      drawDegree(context);
      // 画指针
      drawNeedle(context);
    };

    let render = () => {
      draw();
      requestAnimationFrame(render);
    };

    render();
  }
});

const drawCircle = (ctx: CanvasRenderingContext2D) => {
  context.save();
  ctx.beginPath();

  ctx.arc(size.value / 2, size.value / 2, size.value / 2, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
  context.restore();
};

const drawCenterDot = (ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    size.value / 2,
    size.value / 2,
    4 * scale.value,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

const drawNeedle = (ctx: CanvasRenderingContext2D) => {
  const hourNeedleWidth = 4 * scale.value;
  const hourNeedleHeight = 40 * scale.value;
  const minuteNeedleWidth = 3 * scale.value;
  const minuteNeedleHeight = 50 * scale.value;
  const secondNeedleWidth = 2 * scale.value;
  const secondNeedleHeight = 70 * scale.value;

  const date = new Date();
  const milliseconds = date.getMilliseconds();
  const seconds = date.getSeconds() + milliseconds / 1000; //获取当前秒
  const mins = date.getMinutes() + seconds / 60; //获取当前分
  const hours = date.getHours() + mins / 60; //获取当前时

  ctx.save();
  ctx.rotate((Math.PI / 180) * (hours * 30));
  ctx.beginPath();
  ctx.lineTo(-hourNeedleWidth / 2, 0);
  ctx.lineTo(-hourNeedleWidth / 2, -hourNeedleHeight);
  ctx.lineTo(0, -hourNeedleHeight - 5 * scale.value);
  ctx.lineTo(hourNeedleWidth / 2, -hourNeedleHeight);
  ctx.lineTo(hourNeedleWidth / 2, 0);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.rotate((Math.PI / 180) * (mins * 6));
  ctx.beginPath();
  ctx.lineTo(-minuteNeedleWidth / 2, 0);
  ctx.lineTo(-minuteNeedleWidth / 2, -minuteNeedleHeight);
  ctx.lineTo(0, -minuteNeedleHeight - 5 * scale.value);
  ctx.lineTo(minuteNeedleWidth / 2, -minuteNeedleHeight);
  ctx.lineTo(minuteNeedleWidth / 2, 0);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.rotate((Math.PI / 180) * (seconds * 6));
  ctx.beginPath();
  ctx.lineTo(-secondNeedleWidth / 2, 0);
  ctx.lineTo(-secondNeedleWidth / 2, -secondNeedleHeight);
  ctx.lineTo(0, -secondNeedleHeight - 5 * scale.value);
  ctx.lineTo(secondNeedleWidth / 2, -secondNeedleHeight);
  ctx.lineTo(secondNeedleWidth / 2, 0);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

const drawDegree = (ctx: CanvasRenderingContext2D) => {
  ctx.save();
  for (let i = 0; i <= 60; i++) {
    ctx.rotate(Math.PI / 30);
    ctx.beginPath();
    ctx.moveTo(0, -size.value / 2 + 5 * scale.value);
    ctx.lineTo(0, -size.value / 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  ctx.restore();
};
</script>

<style scoped></style>
