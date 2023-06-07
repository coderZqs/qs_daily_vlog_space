<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";

var mat4 = new THREE.Matrix4();
mat4.set(1, 0, 0, 5, 0, 1, 0, 3, 0, 0, 1, 9, 0, 0, 0, 1);
// 矩阵乘以标量
mat4.multiplyScalar(10);
console.log("查看矩阵乘以标量后的结果", mat4.elements);
</script>

<style></style>
