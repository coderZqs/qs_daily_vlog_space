<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let wh = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(wh.width, wh.height);

let light = new THREE.AmbientLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

let textureLoader = new THREE.TextureLoader();
textureLoader.load("/src/assets/image/1665467568000.jpg", (texture) => {
  // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(15, 100, 100),
    new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
    })
  );

  scene.add(sphere);

  sphere.position.set(0, 0, 0);
});
let camera = new THREE.PerspectiveCamera(45, wh.width / wh.height, 0.1, 100);
camera.position.set(0, 10, 10);
const controls = new OrbitControls(camera, renderer.domElement);

let ani = () => {
  requestAnimationFrame(ani);
  renderer.render(scene, camera);
  controls.update();
};

onMounted(() => {
  renderer.render(scene, camera);
  document.querySelector(".container").appendChild(renderer.domElement);
  ani();
});
</script>

<style></style>
