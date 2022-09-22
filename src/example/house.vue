<template>
  <div id="container"></div>
</template>

<script setup>
import * as THREE from "three";
import THREEBSPConstructor from "three-js-csg";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let ThreeBSP = THREEBSPConstructor(THREE);

const generateOutWall = () => {
  const h = 1500;
  const l = 4000;
  const w = 1500;
  const d = 100;
  const p = [0, 0, 0];

  const wallTexture = new THREE.TextureLoader.load(
    "../assets/image/plane.jpg"
  );

  const outBox = new THREE.Mesh(
    new THREE.BoxGeometry(l, h, w),
    new THREE.MeshLambertMaterial({
      color: 0xaed6f1,
      map: wallTexture
    })
  );

  outBox.position.set(p[0], h / 2, p[2]);

  const innerBox = new THREE.Mesh(
    new THREE.BoxGeometry(l - d, h, w - d),
    new THREE.MeshLambertMaterial({ color: 0xaed6f1 })
  );

  innerBox.position.set(p[0], h / 2, p[2]);

  const emptyBox = new THREE.Mesh(
    new THREE.BoxGeometry(600, 1000, 300),
    material
  );
  emptyBox.position.set(0, 500, w / 2);
  /*  scene.add(emptyBox); */

  const outBoxBSP = new ThreeBSP(outBox);
  const innerBoxBSP = new ThreeBSP(innerBox);
  const emptyBoxBSP = new ThreeBSP(emptyBox);
  let wallBSP = outBoxBSP.subtract(innerBoxBSP);
  let resultBSP = wallBSP.subtract(emptyBoxBSP);
  var result = resultBSP.toMesh();
  result.geometry.computeFaceNormals();
  result.geometry.computeVertexNormals();
  var material = new THREE.MeshPhongMaterial({ color: 0xaed6f1 });
  result.material = material;
  scene.add(result);
};

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0xffffff, 1, 1000);
renderer.setClearColor(new THREE.Color(0xcccccc));
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  20000
);

const controls = new OrbitControls(camera, renderer.domElement);

generateOutWall();

/* box.receiveShadow = true; */

/* scene.add(box); */

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200000, 200000),
  new THREE.MeshPhongMaterial({ color: 0xe5e8e8 })
);

plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const light = new THREE.AmbientLight();
light.position.set(-500, 500, 500);
scene.add(light);

camera.position.set(1000, 2000, 1000);
camera.lookAt(scene.position);

const init = () => {
  renderer.render(scene, camera);
  let dom = document.querySelector("#container");
  dom.appendChild(renderer.domElement);
};

let animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

onMounted(() => {
  init();
  animate();
});
</script>

<style></style>
