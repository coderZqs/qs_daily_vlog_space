<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// todo
const TEXT = "########################################";

let group = new THREE.Group();

for (let i = 0; i < TEXT.length; i++) {
  new THREE.FontLoader().load("/src/assets/image/bold.json", (font) => {
    console.log(TEXT[i]);
    const geometry = new THREE.TextGeometry(TEXT[0], {
      font: font,
      size: 5,
      height: 1,
    });

    let text = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    let x = Math.sin(((Math.PI * 2) / TEXT.length) * i) * 30;
    let z = Math.cos(((Math.PI * 2) / TEXT.length) * i) * 30;
    text.position.set(x, 0, z);
    group.add(text);
  });
}
scene.add(group);

let control = new OrbitControls(camera, renderer.domElement);

let time = 0;
let animate = () => {
  time += 0.03;
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
  group.rotation.y -= 0.01;
  group.rotation.z = Math.sin(time) / 5;
  group.rotation.x = Math.cos(time) / 5;
};
onMounted(() => {
  let dom = document.querySelector("#container");
  dom.appendChild(renderer.domElement);
  animate();
});
</script>

<style></style>
