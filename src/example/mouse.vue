<template>
  <div class="container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  100
);

let light = new THREE.AmbientLight(0xfffffff, 1);
scene.add(light);

let directionalLight = new THREE.DirectionalLight(0xffffff);
scene.add(directionalLight);

directionalLight.position.set(100, 100, 100);

camera.position.set(0, 0, 8);

let cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0xfff59d })
);

// 粒子效果

let particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 1) {
  positions[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

let pointQiu = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.09,
    sizeAttenuation: true,
  })
);

pointQiu.position.z = 7;
scene.add(pointQiu);
cube.position.set(0, 0, -7);
scene.add(cube);

const gltfLoader = new GLTFLoader();
gltfLoader.load("/src/assets/image/character.glb", (gltf) => {
  let human = gltf.scene.children[0];
  human.scale.set(5, 5, 5);
  human.position.y = -2;

  console.log(human);
  scene.add(gltf.scene.children[0]);
});

renderer.render(scene, camera);

onMounted(() => {
  document.querySelector(".container").appendChild(renderer.domElement);

  window.onmousemove = (ev) => {
    camera.position.set(
      ((ev.pageX - window.innerWidth / 2) / (window.innerWidth / 2)) * 2,
      ((ev.pageY - window.innerHeight / 2) / (window.innerHeight / 2)) * -2,
      8
    );

    camera.lookAt(cube.position);

    renderer.render(scene, camera);
  };
});
</script>

<style></style>
