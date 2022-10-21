<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

renderer.setClearColor(0xffffff);
camera.position.set(100, 100, 100);

let light = new THREE.HemisphereLight(0xffffff, 0.1);
scene.add(light);

let directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.castShadow = true;
directionalLight.position.set(-600, 600, -200);
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 方向光投影近点、远点更新
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.camera.top = 800;
directionalLight.shadow.camera.bottom = -800;
directionalLight.shadow.camera.left = -800;
directionalLight.shadow.camera.right = 800;

scene.add(directionalLight);
renderer.setSize(window.innerWidth, window.innerHeight);
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

camera.lookAt(scene.position);
const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);
let run = () => {
  requestAnimationFrame(run);
  renderer.render(scene, camera);
  controls.update();
};

onMounted(() => {
  run();
  document.querySelector(".container").appendChild(renderer.domElement);
});
</script>

<style></style>
