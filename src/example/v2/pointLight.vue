<template>
  <div class="canvas"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import T from "@/threejs/index";
import * as THREE from "three";

let renderer: THREE.WebGLRenderer, camera, scene;

onMounted(() => {
  camera = T.initCamera();
  renderer = T.initRenderer();
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x00000, 10, 30);

  // 灯光
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
  scene.add(ambientLight);
  let spotLight = new THREE.SpotLight(0x2878ff, 1, 30, Math.PI / 60, 0, 1);
  scene.add(spotLight);
  spotLight.position.set(-2.5, 2.5, 20);

  let pointLight = new THREE.PointLight(0xff00000, 1, 14, 2);
  scene.add(pointLight);

  pointLight.position.set(0, 10, 0);

  let spotLight2 = new THREE.SpotLight(0xde9a14, 1, 30, Math.PI / 60, 0, 1);
  scene.add(spotLight2);
  spotLight2.position.set(2.5, 2.5, 20);

  let element = document.querySelector(".canvas") as HTMLElement;
  T.addAdaptionScreen(renderer, camera);
  T.appendCanvasToElement(element, renderer.domElement);
  T.addOrbitControls(camera, renderer.domElement);
  let box = T.generateCube([20, 5, 5], "MeshPhysicalMaterial", {
    color: 0xffffff
  });

  camera.position.set(0, 0, 20);
  scene.add(box);
  spotLight.target = box;
  spotLight2.target = box;
  animate();
});

let animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
</script>

<style scoped></style>
