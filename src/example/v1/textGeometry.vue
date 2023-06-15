<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let renderer = new THREE.WebGLRenderer({
  antialias: true,
});
let scene = new THREE.Scene();
let ratios = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, ratios, 0.5, 20000);
scene.add(camera);
camera.position.set(0, 0, 100);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

let spotLight = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 6);
spotLight.position.set(0, 300, 0);
scene.add(spotLight);
spotLight.castShadow = true;

let ambient = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
scene.add(ambient);


let generateWord = async () => {
  let width = 500;
  let height = 500;

  let points = []

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      points.push(i);
      points.push(j);
      points.push(0);
    }
  }

  let geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3)); // 一个顶点由3个坐标构成

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,// 开启透明度
  });

  let point = new THREE.Points(geometry, material)
  point.position.set(0, 0, 0);
  scene.add(point);
}

generateWord();


let control = new OrbitControls(camera, renderer.domElement);

let time = 0;
let animate = () => {
  time += 0.03;
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
};
onMounted(() => {
  let dom = document.querySelector("#container");
  dom.appendChild(renderer.domElement);
  animate();
});
</script>

<style></style>
