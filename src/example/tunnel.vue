<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
let wh = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(wh.width, wh.height);

let path = {};

let points = [
  [0, 0],
  [2, 5],
  [-4, -10],
  [10, -20],
  [-20, -40],
];

let light = new THREE.AmbientLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

points.forEach((point, i) => {
  let x = point[0];
  let y = 0;
  let z = point[1];

  points[i] = new THREE.Vector3(x, y, z);
});

path = new THREE.CatmullRomCurve3(points);
let Tube = new THREE.Mesh(
  new THREE.TubeGeometry(path, 300, 2, 20, false),
  new THREE.MeshBasicMaterial({ color: 0x0e4865, wireframe: true })
);

scene.add(Tube);
let camera = new THREE.PerspectiveCamera(45, wh.width / wh.height, 0.1, 100);
camera.position.set(0, 10, 50);
let speed = 0;

let ani = () => {
  requestAnimationFrame(ani);
  speed += 0.005;
  renderer.render(scene, camera);
  let vector = path.getPointAt(speed);
  let vector2 = path.getPointAt(speed + 0.01);
  camera.position.set(vector.x, vector.y, vector.z);
  camera.lookAt(vector2);
};

onMounted(() => {
  renderer.render(scene, camera);
  document.querySelector(".container").appendChild(renderer.domElement);
  ani();
});
</script>

<style></style>
