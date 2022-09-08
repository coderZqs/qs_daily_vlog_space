<template>
  <div id="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";

let init = () => {
  let h = window.innerHeight;
  let w = window.innerWidth;

  let k = w / h;
  let s = 200;
  // 摄像机
  let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0.1, 100000);
  // 场景
  let scene = new THREE.Scene();
  // 物品
  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
    })
  );
  // 坐标轴
  var axesHelper = new THREE.AxesHelper(100000);
  scene.add(axesHelper);

  scene.add(cube);
  // 光源
  let point = new THREE.PointLight(0xfffff);
  point.position.set(400, 200, 300);
  scene.add(point);
  // 光类
  let ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  // 渲染器
  camera.position.set(400, 300, 200);
  let renderer = new THREE.WebGLRenderer();
  let container = document.querySelector("#container");

  renderer.setSize(w, h);
  renderer.setClearColor(0xb9d3ff, 1);

  container.appendChild(renderer.domElement);

  renderer.render(scene, camera);
};

onMounted(() => {
  init();
});

// 场景
</script>

<style></style>
