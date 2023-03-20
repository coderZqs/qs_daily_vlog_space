<template>
  <div class="music-container">
    <div class="three-container" :style="{ opacity: visible ? 1 : 0 }"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import * as THREE from "three";

export default defineComponent({
  setup() {
    let visible = ref(false);

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioBufferSourceNode;

    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);

    renderer.setSize(200, 200);
    renderer.setClearColor(0xffffff);
    camera.position.set(0, 0, 40);

    let light = new THREE.HemisphereLight(0xffffff, 0.1);
    scene.add(light);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000);

    onMounted(async () => {
      const arrayBuffer = await loadSound(
        "https://webfs.tx.kugou.com/202301151738/efddd5ebbaf1966895773b6c3be714ed/v2/e2fcb8d3a0bcda595d2a71239a54888f/part/0/960119/KGTX/CLTX001/clip_e2fcb8d3a0bcda595d2a71239a54888f.mp3"
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
        let point = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.MeshPhongMaterial({ color: 0xffffff })
        );

        subGroup.add(point);
        subGroup.rotation.z =
          (360 / dataArray.length) * i * ((Math.PI * 2) / 360);
        group.add(subGroup);
      }

      scene.add(group);
      group.position.x = 0;

      document
        .querySelector(".three-container")
        .appendChild(renderer.domElement);

      visible.value = true;

      setInterval(() => {
        renderer.render(scene, camera);
        analyser.getByteTimeDomainData(dataArray);

        for (let i = 0; i < dataArray.length; i++) {
          group.children[i].children[0].position.x =
            10 + (dataArray[i] / 128.0) * 5;
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

    return {
      visible,
    };
  },
});
</script>

<style lang="scss">
.three-container {
  background: black;

  canvas {
    width: 100px !important;
    height: 100px !important;
  }
}
</style>
