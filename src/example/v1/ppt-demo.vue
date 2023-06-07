<template>
  <div class="button-group">
    <button class="next-page" @click="lastPage">上一页</button>
    <button class="next-page" @click="nextPage">下一页</button>
    <button class="rotate" @click="rotate">旋转</button>
    <button class="destory" @click="destory">摧毁</button>
  </div>

  <div class="page-ppt-demo"></div>
</template>

<script setup>
import threejsAPI from "@/threejs/index";
import * as THREE from "three";
import { onMounted } from "vue";
let currentPage = 0;
let mouse = new THREE.Vector2();
let isStartRotate = false;
let { Scene, AmbientLight, Raycaster } = THREE;

let renderer = threejsAPI.initRenderer();
let camera = threejsAPI.initCamera();
let scene = new Scene();

let pptSlide = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

renderer.setClearColor(0xffffff);
scene.add(camera);

let cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);

scene.add(cube);
cube.position.set(0, 0.5, 0.5);
camera.position.set(0, 0.5, 4);

let ambientLight = new AmbientLight(0xffffff);
scene.add(ambientLight);
ambientLight.position.set(10, 10, 10);

pptSlide.forEach((item, index) => {
  threejsAPI.loadGLTF("/src/assets/image/character.glb", (group) => {
    item.human = group.scene;
    scene.add(item.human);
    console.log(item.human);
    item.human.position.set(4 * index, 0, 0);
  });
});

let cameraRotate = (camera, R, center, deg) => {
  let currentHuman = pptSlide[currentPage].human;
  let x = Math.sin((180 / Math.PI) * (deg / 360)) * R + currentPage * 4;
  let z = Math.cos((180 / Math.PI) * (deg / 360)) * R;
  camera.position.set(x, center, z);

  console.log(camera.position.x);
  camera.lookAt(currentHuman.position.x, center, currentHuman.position.z);
};

let nextPage = () => {
  currentPage += 1;
};

let lastPage = () => {
  currentPage -= 1;
};

let rotate = () => {
  isStartRotate = true;

  let isTouch = threejsAPI.judgeRaycasterTouchObject(
    new Raycaster(),
    [pptSlide[currentPage].human],
    mouse,
    camera
  );
};

const destory = () => {
  console.log(cube.geometry.attr);
};

let deg = 0;

let animate = () => {
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (isStartRotate) {
    deg += 0.05;
    var box = new THREE.Box3().setFromObject(pptSlide[currentPage].human);
    const center = (box.max.y - box.min.y) / 2;
    const R = 3;

    cameraRotate(camera, R, center, deg);
  }

  let x = currentPage * 4;

  if (Math.floor(camera.position.x) !== x) {
    camera.position.x += 0.05;
  }

  window.onmousemove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
};

onMounted(() => {
  let dom = document.querySelector(".page-ppt-demo");
  threejsAPI.appendCanvasToElement(dom, renderer.domElement);
  animate();
});
</script>

<style lang="scss" scoped>
.button-group {
  position: absolute;
  top: 0;

  button {
    background: red;
    padding: 0.25rem;
    margin: 0.5rem;
  }
}
</style>
