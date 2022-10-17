<template>
  <div class="container">
    <div class="three-container"></div>
    <button
      style="z-index: 999; position: absolute; top: 0; left: 0"
      @click="play"
    >
      播放
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBufferSourceNode;

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
camera.position.set(0, 0, 100);

let light = new THREE.HemisphereLight(0xffffff, 0.1);
scene.add(light);
renderer.render(scene, camera);

onMounted(async () => {
  const arrayBuffer = await loadSound(
    "https://img.metaworks.cn/resources/7ee934613478541077ba60d24fe486ba98ca0878.mp3"
  );

  audioBufferSourceNode = audioContext.createBufferSource();
  audioBufferSourceNode.connect(audioContext.destination); // 连接到AudioContext对象
  const audioBuffer = await bufferToAudio(arrayBuffer);
  audioBufferSourceNode.buffer = audioBuffer;

  const analyser = audioContext.createAnalyser();
  audioBufferSourceNode.connect(analyser);
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let group = new THREE.Group();

  for (let i = 0; i < dataArray.length; i++) {
    let subGroup = new THREE.Group();
    let value = dataArray[i];

    let point = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    point.position.x = 10;

    subGroup.add(point);
    subGroup.rotation.z = (360 / dataArray.length) * i * ((Math.PI * 2) / 360);
    group.add(subGroup);
  }

  scene.add(group);
  group.position.x = -10;

  document.querySelector(".three-container").appendChild(renderer.domElement);
  setInterval(() => {
    renderer.render(scene, camera);
    analyser.getByteTimeDomainData(dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      group.children[i].children[0].position.x =
        10 + (dataArray[i] / 128.0) * 2;
    }
  }, 19);
});

function bufferToAudio(arrayBuffer) {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      arrayBuffer,
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

function loadSound(url) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      resolve(request.response);
    };
    request.send();
  });
}

function play() {
  if (audioBufferSourceNode.isStart) {
    audioBufferSourceNode.isStart = false;
    audioBufferSourceNode.stop(); // 暂停音频
  } else {
    audioBufferSourceNode.isStart = true;
    audioBufferSourceNode.start(0); // 从0开始播放音频
  }
}
</script>

<style></style>
