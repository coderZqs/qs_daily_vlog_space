<template>
  <div class=""></div>
</template>

<script setup>
import { createNoise2D } from "simplex-noise";
const noise2D = createNoise2D();
let dotList = [];

for (let i = 0; i < 1; i++) {
  dotList.push({
    x: i,
    y: noise2D(2, 2) * 100,
  });
}
</script>

<style>
.dot-container {
  position: relative;
  display: flex;
}

.dot {
  height: 2px;
  width: 2px;
  background: red;
  position: absolute;
}
</style>
