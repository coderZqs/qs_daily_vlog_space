<template>
  <div class="page-about">
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <p style="margin-top: 400px; display: block">哈哈哈哈哈哈</p>
      </div>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import * as THREE from "three";
import threeJsApi from "@/threejs/index";
</script>
 -->
<style lang="scss">
.page-about {
  height: 100vh;
  margin: 0;
  perspective: 1px;
  padding: 0;
  overflow: auto;

  .container {
    height: 1280px;
    transform-style: preserve-3d;
    position: relative;
  }
  .bg {
    position: absolute;
    left: 30px;
    top: 400px;
    width: 100px;
    height: 100px;
    background-image: url("https://img.tukuppt.com/bg_grid/00/12/95/Slv0hNR0gN.jpg!/fh/350");
    background-size: cover;
  }
  .content {
    top: 0;
    position: absolute;
    z-index: 9;
    left: 50%;
    transform: translate3D(-50%, -120px, -1px) scale(2);
  }
}
</style>
