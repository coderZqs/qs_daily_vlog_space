<template>
  <div class="container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xf1f1f1);
let human;
let clock = new THREE.Clock();
let animations = [];
let scene = new THREE.Scene();
renderer.shadowMap.enabled = true;
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  100
);

let mixer;

let loader = new FBXLoader();
// 加载人物
loader.load("/src/assets/image/human.fbx", (object) => {
  object.castShadow = true;
  object.traverse(function (child) {
    if (child.isMesh) {
      child.frustumCulled = false;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.emissiveMap = child.material.map;
      child.material.specular.setScalar(0.1);
    }
  });

  animations = object.animations;
  object.scale.set(0.02, 0.02, 0.02);
  object.position.y = 0;
  scene.add(object);

  camera.lookAt(object.position);
  human = object;

  mixer = new THREE.AnimationMixer(human);
  let idleAnim = new THREE.AnimationClip.findByName(animations, "mixamo.com");
  let idle = mixer.clipAction(idleAnim);
  idle.play();
});
// 地板
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5000, 5000, 1, 1),
  new THREE.MeshPhongMaterial({ color: 0xeeeeee, shininess: 0 })
);

plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -Math.PI / 2;

let light = new THREE.AmbientLight(0xfffffff, 0.55);
light.position.set(0, 10, 0);
scene.add(light);

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);
directionalLight.position.set(-8, 12, 8);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.top = 8.25;
directionalLight.shadow.camera.bottom = -8.25;
directionalLight.shadow.camera.left = -8.25;
directionalLight.shadow.camera.right = 8.25;

const helper = new THREE.DirectionalLightHelper(directionalLight, 2);
scene.add(helper);

// const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(7, 16, 7);

renderer.render(scene, camera);

let ani = () => {
  requestAnimationFrame(ani);
  renderer.render(scene, camera);
  /*   controls.update(); */

  if (mixer) {
    mixer.update(clock.getDelta());
  }
};

/**
 * 获取旋转角度
 * @param {*} param0 线段1坐标
 * @param {*} param1 线段2坐标
 */

let getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const dot = x1 * x2 + y1 * y2;
  const det = x1 * y2 - y1 * x2;
  const angle = (Math.atan2(det, dot) / Math.PI) * 180;
  console.log(angle);
  return (angle + 360) % 360;
};

onMounted(() => {
  document.querySelector(".container").appendChild(renderer.domElement);
  let run = null;
  let lastTargetPoi = { x: 0, y: 0, z: 1 };

  window.onmousedown = (ev) => {
    clearInterval(run);

    // 射线拿到点击地板处
    var Sx = ev.clientX;
    var Sy = ev.clientY;
    var x = (Sx / window.innerWidth) * 2 - 1;
    var y = -(Sy / window.innerHeight) * 2 + 1;
    var standardVector = new THREE.Vector3(x, y, 0.5);
    var worldVector = standardVector.unproject(camera);
    var ray = worldVector.sub(camera.position).normalize();
    var raycaster = new THREE.Raycaster(camera.position, ray);
    var intersects = raycaster.intersectObjects([plane, human]);

    if (intersects.length) {
      let targetPoi = intersects[0].point;

      // xz需同时到达，所以需要算出xy的速度
      let speed = 0.1;
      let time = 0;
      let xSpeed = 0;
      let zSpeed = 0;

      let zDistance = Math.abs(targetPoi.z - human.position.z);
      let xDistance = Math.abs(targetPoi.x - human.position.x);
      time = zDistance > xDistance ? zDistance / speed : xDistance / speed;

      xSpeed = xDistance / time;
      zSpeed = zDistance / time;

      //   通过上一次点击算出旋转角
      human.rotation.y += THREE.Math.degToRad(
        getAngle(
          { x: lastTargetPoi.x, y: -lastTargetPoi.z },
          { x: targetPoi.x, y: -targetPoi.z }
        )
      );

      lastTargetPoi = Object.assign(targetPoi);

      run = setInterval(() => {
        if (human.position.x > targetPoi.x) {
          human.position.x -= xSpeed;
        } else {
          human.position.x += xSpeed;
        }

        if (human.position.z > targetPoi.z) {
          human.position.z -= zSpeed;
        } else {
          human.position.z += zSpeed;
        }

        // 结束
        if (Math.floor(Math.abs(human.position.z - targetPoi.z) * 10) === 0) {
          clearInterval(run);
        }
      }, 19);
    }
  };

  ani();
});
</script>

<style></style>
