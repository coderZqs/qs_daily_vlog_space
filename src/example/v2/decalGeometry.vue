<template>
  <div class="canvas"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as THREE from "three";
import T from "@/threejs/index";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load("/src/assets/image/decal-diffuse.png");
decalDiffuse.colorSpace = THREE.SRGBColorSpace;
const decalNormal = textureLoader.load("/src/assets/image/decal-normal.jpg");

const decalMaterial = new THREE.MeshPhongMaterial({
  specular: 0x444444,
  map: decalDiffuse,
  normalMap: decalNormal,
  normalScale: new THREE.Vector2(1, 1),
  shininess: 30,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  wireframe: false
});

const decals = [];
let raycaster = new THREE.Raycaster();
let mouseHelper;
const position = new THREE.Vector3(0, 0, 0);
const orientation = new THREE.Euler();
const size = new THREE.Vector3(5, 5, 5);

const params = {
  minScale: 3,
  maxScale: 5,
  rotate: true,
  clear: function () {
    removeDecals();
  }
};

const removeDecals = () => {
  decals.forEach(function (d) {
    scene.remove(d);
  });

  decals.length = 0;
};

// 摄像机
let camera, renderer;

camera = T.initCamera();
renderer = T.initRenderer();
let scene = new THREE.Scene();
scene.add(camera);
// T.addOrbitControls(camera, renderer.domElement);

let animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

let light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 创建正方体

let cube = T.generateCube([5, 5, 5], "MeshPhysicalMaterial", {
  color: 0xcccccc
});

cube.rotation.y = Math.PI / 5;

window.addEventListener("click", e => {
  if (cube === undefined) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.intersectObject(cube, false, intersects);

  if (intersects.length > 0) {
    const p = intersects[0].point;
    intersection.point.copy(p);

    const n = intersects[0].face.normal.clone();
    n.transformDirection(intersects[0].object.matrixWorld);
    n.multiplyScalar(10);
    n.add(intersects[0].point);

    intersection.normal.copy(intersects[0].face.normal);

    intersection.intersects = true;
    intersects.length = 0;

    position.copy(intersection.point);

    if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

    const scale =
      params.minScale + Math.random() * (params.maxScale - params.minScale);
    size.set(scale, scale, scale);

    const material = decalMaterial.clone();
    material.color.setHex(Math.random() * 0xffffff);

    const m = new THREE.Mesh(
      new DecalGeometry(cube, position, orientation, size),
      material
    );

    decals.push(m);
    scene.add(m);
  } else {
    intersection.intersects = false;
  }
});

window.onmousemove = event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

camera.position.set(0, 3, 20);
scene.add(cube);

onMounted(() => {
  let dom = document.querySelector(".canvas");
  T.appendCanvasToElement(dom, renderer.domElement);

  animate();
});
</script>

<style scoped></style>


110 - b + 70 + b = 180
