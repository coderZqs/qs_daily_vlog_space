<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/* https://media.w3.org/2010/05/sintel/trailer.mp4 */

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

renderer.setClearColor(0xffffff);
camera.position.set(100, 100, 100);

let light = new THREE.HemisphereLight(0xffffff, 0.1);
scene.add(light);

let directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.castShadow = true;
directionalLight.position.set(-600, 600, -200);
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 方向光投影近点、远点更新
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.camera.top = 800;
directionalLight.shadow.camera.bottom = -800;
directionalLight.shadow.camera.left = -800;
directionalLight.shadow.camera.right = 800;

scene.add(directionalLight);
renderer.setSize(window.innerWidth, window.innerHeight);
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

let floor = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.MeshStandardMaterial({ color: 0xffe14d })
);

floor.receiveShadow = true;

let box = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 100),
  new THREE.MeshStandardMaterial({ color: 0xf5f6f7 })
);
box.position.y = 50;
box.castShadow = true;
scene.add(box);

let listener = new THREE.AudioListener();
camera.add(listener);
let posAudio = new THREE.PositionalAudio(listener);
box.add(posAudio);

var audioLoader = new THREE.AudioLoader();
// 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
audioLoader.load(
  "http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3",
  function (AudioBuffer) {
    console.log(AudioBuffer);
    // 音频缓冲区对象关联到音频对象audio
    posAudio.setBuffer(AudioBuffer);
    posAudio.setVolume(0.9); //音量
    posAudio.setRefDistance(200); //参数值越大,声音越大
    /* 
    window.onclick = () => {
      posAudio.play(); //播放
    }; */
  }
);

floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, 0);
scene.add(floor);
camera.lookAt(scene.position);
const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);
let run = () => {
  requestAnimationFrame(run);
  renderer.render(scene, camera);
  controls.update();
};

onMounted(() => {
  run();
  document.querySelector(".container").appendChild(renderer.domElement);
});
</script>

<style></style>
