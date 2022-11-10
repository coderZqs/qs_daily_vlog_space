<template>
  <div class="container"></div>
</template>

<script setup>
import threejsApi from "../threejs/index";
import * as THREE from "three";

import { onMounted } from "vue";
import channel, {
  getChannelPointPoi,
} from "@/components/project/Channel/index.js";
import landGroup from "./lands/index";

import { listenKeyboard } from "@/components/human/controls";

let camera = threejsApi.initCamera();
let renderer = threejsApi.initRenderer();
let scene = new THREE.Scene();

let spotLightHelper = new THREE.SpotLightHelper(
  landGroup.children.find((v) => v.type === "SpotLight")
);
scene.add(spotLightHelper);

// 聚光灯

let ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
scene.add(ambientLight);

let controls = threejsApi.addLockControls(camera, renderer.domElement);

window.onclick = function () {
  if (!controls || !controls.isLocked) {
    controls.lock();
  }
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isChannelAni = false;

window.addEventListener("click", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  isChannelAni = threejsApi.judgeRaycasterTouchObject(raycaster, [channel]);
});

scene.add(channel);
landGroup.position.x = -12;
scene.add(landGroup);

camera.position.set(0, 1, 5);

onMounted(() => {
  let time = 0;
  let element = document.querySelector(".container");
  threejsApi.appendCanvasToElement(element, renderer.domElement);
  threejsApi.addAdaptionScreen(renderer, camera);

  let animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    listenKeyboard(controls);

    if (isChannelAni) {
      time += 1;

      let position = getChannelPointPoi(time);
      let leaderPosition = getChannelPointPoi(time + 10);

      if (leaderPosition) {
        camera.position.copy(position);
        controls.target = leaderPosition;
      } else {
        isChannelAni = false;
      }
    }
  };

  animate();
});
</script>

<style></style>
