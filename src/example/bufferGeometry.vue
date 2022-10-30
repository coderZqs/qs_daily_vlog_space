<template>
  <div class="container"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";

import threejsAPi from "../threejs/index";

let renderer = threejsAPi.initRenderer();
let camera = threejsAPi.initCamera();
let orbitControls = threejsAPi.addOrbitControls(camera, renderer.domElement);
let scene = new THREE.Scene();

let geometry = new THREE.BufferGeometry();

let d = 200;
let d2 = 100;
let s = 4;
let s2 = 2;

let position = [];

for (let i = 0; i < 100000; i++) {
  // 顶点
  let x = Math.random() * d - d2;
  let y = Math.random() * d - d2;
  let z = Math.random() * d - d2;

  let ax = x + Math.random() * s - s2;
  let ay = y + Math.random() * s - s2;
  let az = z + Math.random() * s - s2;

  let bx = x + Math.random() * s - s2;
  let by = y + Math.random() * s - s2;
  let bz = z + Math.random() * s - s2;

  let cx = x + Math.random() * s - s2;
  let cy = y + Math.random() * s - s2;
  let cz = z + Math.random() * s - s2;

  position.push(ax, ay, az);
  position.push(bx, by, bz);
  position.push(cx, cy, cz);
}

const vertices = new Float32Array(position);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

let cube = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(cube);

camera.position.set(0, 0, 200);

threejsAPi.addAdaptionScreen(renderer, camera);

// start animation
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

onMounted(() => {
  orbitControls.update();
  let container = document.querySelector(".container");
  threejsAPi.appendCanvasToElement(
    container as HTMLElement,
    renderer.domElement
  );
  animate();
});
</script>

<style></style>
