<template>
  <div id="container" ref="container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";

let container = ref<HTMLDivElement | null>(null);
// box配置
let boxNum = 120;
const boxSize = 10;
const boxColor = 0x0000ff;
const boxMargin = 10;
const rowLength = Math.ceil(Math.sqrt(boxNum));
const colLength = Math.floor(Math.sqrt(boxNum));

/**
 * 获得坐标
 */
const getPoiByIndex = (i: number) => {
  let x = (i % rowLength) * (boxSize + boxMargin);
  let y = Math.floor(i / rowLength) * (boxSize + boxMargin);
  let z = boxSize / 2;

  return { x, y, z };
};

/**
 * 生成box
 */
const generateBox = (i: number) => {
  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(boxSize, boxSize, boxSize),
    new THREE.MeshLambertMaterial({
      color: boxColor,
    })
  );

  let { x, y, z } = getPoiByIndex(i);
  cube.position.set(x, y, z);

  return cube;
};

const init = () => {
  let scene = new THREE.Scene();
  // 摄像机
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  scene.add(camera);

  // 光源
  let point = new THREE.PointLight(0xfffff);
  point.position.set(400, 200, 300);
  scene.add(point);
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  for (let i = 0; i <= boxNum; i++) {
    let cube = generateBox(i);
    scene.add(cube);
  }

  // 坐标轴
  var axesHelper = new THREE.AxesHelper(100000);
  scene.add(axesHelper);

  camera.position.set(
    (colLength * (boxSize + boxMargin)) / 2,
    (rowLength * (boxSize + boxMargin)) / 2,
    500
  );
  /* camera.lookAt(scene.position); */

  // 渲染器
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xb9d3ff, 1);

  if (container.value) {
    container.value.appendChild(renderer.domElement);
    renderer.render(scene, camera);
  }

  /**
   * 设置定时器
   */
  setInterval(() => {
    boxNum += 1;
    let cube = generateBox(boxNum);
    scene.add(cube);

    const { y } = getPoiByIndex(boxNum);

    camera.position.y = y / 2;
    camera.position.z = y / 2 / Math.tan(Math.PI / 8);
    renderer.render(scene, camera);
  }, 30);
};

onMounted(() => {
  init();
});
</script>

<style></style>
