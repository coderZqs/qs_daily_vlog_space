<template>
  <div class="container"></div>
</template>

<script setup>
import threejsApi from "@/threejs/index";
import * as THREE from "three";

import { onMounted } from "vue";
import channel, {
  getChannelPointPoi,
} from "@/components/project/Channel/index.js";
import landGroup from "./index";

import { listenKeyboard } from "@/components/human/controls";
let camera = threejsApi.initCamera();
let renderer = threejsApi.initRenderer();
let scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isChannelAni = false;
let followCamera;

let person;

let API = () => {
  /**
   * 初始化灯光
   */

  let initLight = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambientLight);
  };

  /**
   * 添加音乐
   */

  let addMusic = () => {
    let url =
      "/src/assets/music/Taibian (타이비언) _ Dia (디아) - 배영하는 물고기 (仰泳的鱼).mp3";
    threejsApi.addPositionalAudio(url, camera, 1, 1).then((personalAudio) => {
      personalAudio.play();
    });
  };

  /**
   * 初始化准心
   */

  let initCrosshair = () => { };

  /**
   * 初始化项目
   */

  let initProject = () => {
    initLight();
    camera.position.set(0, 1, 5);
    camera.rotation.y = Math.PI / 2;

    scene.add(channel);
    landGroup.position.x = -12;
    scene.add(landGroup);

    // addMusic();
  };

  let initPerson = () => {
    person = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xaed6f1 })
    );

    person.position.set(0, 1, 0);
    scene.add(person);

    followCamera = new THREE.Object3D();
    followCamera.position.copy(camera.position);

    person.add(followCamera);
    camera.lookAt(person.position);
  };

  return {
    initLight,
    initProject,
    initCrosshair,
    addMusic,
    initPerson,
  };
};

onMounted(() => {
  // 业务逻辑

  let controler = API();
  controler.initProject();
  controler.initCrosshair();
  controler.initPerson();

  // let controls = threejsApi.addOrbitControls(camera, renderer.domElement);

  let time = 0;
  let element = document.querySelector(".container");
  threejsApi.appendCanvasToElement(element, renderer.domElement);
  threejsApi.addAdaptionScreen(renderer, camera);

  let animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    camera.position.lerp(
      followCamera.getWorldPosition(new THREE.Vector3()),
      0.05
    );

    camera.lookAt(person.position);
    listenKeyboard(person);

    /**
     * 如果点了管道，则进行管道运动
     */

    /*   if (isChannelAni) {
        time += 1;
  
        let position = getChannelPointPoi(time);
        let leaderPosition = getChannelPointPoi(time + 10);
  
        if (leaderPosition) {
          camera.position.copy(position);
          controls.target = leaderPosition;
        } else {
          isChannelAni = false;
        }
      } */
  };

  /**
   * 锁定第一视角和判断是否点击了管道
   */

  /*  element.addEventListener("click", (e) => {
     if (!controls || !controls.isLocked) {
       controls.lock();
     }
 
     mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
     mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
 
     raycaster.setFromCamera(mouse, camera);
     isChannelAni = threejsApi.judgeRaycasterTouchObject(
       raycaster,
       [channel],
       mouse,
       camera
     );
   }); */

  animate();
});
</script>

<style></style>
