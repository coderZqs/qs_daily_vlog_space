<template>
  <div class="planet-canvas"></div>
</template>

<script setup lang="ts">
import threeApi from "@/threejs/index";
import * as THREE from "three";
import { onMounted } from "vue";

let renderer = threeApi.initRenderer({ antialias: true });
let camera = threeApi.initCamera();
let scene = new THREE.Scene();
let light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 10);
scene.add(directionalLight);
directionalLight.castShadow = true;
const d = 10;

directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;

scene.add(light);
scene.add(camera);

let control = threeApi.addOrbitControls(camera, renderer.domElement);

let initPlanet = () => {
  const earthTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthmap2k.jpg"
  );
  // 灰階高度貼圖
  const displacementTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/editedBump.jpg"
  );
  const roughtnessTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2kReversedLighten.png"
  );
  const speculatMapTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2k.jpg"
  );
  const bumpTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthbump2k.jpg"
  );

  let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 100, 100),
    new THREE.MeshStandardMaterial({
      map: earthTexture,
      side: THREE.DoubleSide,
      roughnessMap: roughtnessTexture,
      roughness: 0.9,
      metalnessMap: speculatMapTexture,
      metalness: 1,
      displacementMap: displacementTexture,
      displacementScale: 0.5,
      bumpMap: bumpTexture,
      bumpScale: 0.1,
    })
  );

  scene.add(sphere);
};

camera.position.set(0, 10, 15);

initPlanet();

let animate = () => {
  control.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

onMounted(() => {
  let canvasContainer = document.querySelector(".planet-canvas") as HTMLElement;
  threeApi.appendCanvasToElement(canvasContainer, renderer.domElement);
  animate();
});
</script>

<style></style>
