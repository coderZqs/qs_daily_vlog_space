<template>
  <div class="three-person-container">
    <div class="steering-wheel">
      <div class="control-dot" @mousedown="dragControl"></div>
    </div>


    <div class="keyboard">
      <div></div>
      <div class="key" :style="{ background: isForward ? '#0078D4' : '' }">W</div>
      <div></div>
      <div class="key" :style="{ background: isLeft ? '#0078D4' : '' }">A</div>
      <div class="key" :style="{ background: isBack ? '#0078D4' : '' }">S</div>
      <div class="key" :style="{ background: isRight ? '#0078D4' : '' }">D</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import threejsAPI from "@/threejs/index";
import { onMounted, ref } from "vue";

let renderer: THREE.WebGLRenderer = threejsAPI.initRenderer();
let scene: THREE.Scene = new THREE.Scene();
let light: THREE.Light = new THREE.AmbientLight(0xffffff, 1);
let spotLight = new THREE.SpotLight(0xD44E39, 1, 1000, Math.PI / 3)
spotLight.castShadow = true;
let camera: THREE.Camera = threejsAPI.initCamera("PerspectiveCamera");
let plane: THREE.Mesh;
let sphere: THREE.Mesh;
let isForward = ref(false);
let isLeft = ref(false);
let isRight = ref(false);
let isBack = ref(false);
let angle = 0;
let point;


const generateStar = () => {

  let vertexPoint: number[] = [];
  let size = 1000;

  for (let i = 0; i < 10000; i++) {
    let x, y, z;

    x = Math.random() * (size) - 1000 / 2;
    y = Math.random() * (size) - 1000 / 2;
    z = Math.random() * (size) - 1000 / 2;

    vertexPoint.push(x);
    vertexPoint.push(y);
    vertexPoint.push(z);
  }

  let geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexPoint), 3)); // 一个顶点由3个坐标构成

  const material = new THREE.PointsMaterial({
    color: '#ffff00',
    size: 2,
    transparent: true,// 开启透明度
  });

  point = new THREE.Points(geometry, material)
  point.position.set(0, 0, 0);
  scene.add(point);
}


generateStar();


spotLight.position.set(20, 20, 20)
scene.add(spotLight)
scene.add(light);
scene.castShadow = true;
camera.position.set(0, 100, 100);

// scene.fog = new THREE.Fog(0x00000, 0, 30);

const planeSizeWidth = 1000;
const planeSizeHeight = 1000;

const generatePlane = (): THREE.Mesh => {
  plane = new THREE.Mesh(
    new THREE.BoxGeometry(planeSizeWidth, planeSizeHeight, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x7697FF,
      opacity: 0.2,
      transparent: true,
    })
  );

  plane.receiveShadow = true;
  plane.castShadow = true;

  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0, 0);

  return plane;
};

const generateSphere = (): THREE.Mesh => {
  let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 36, 36),
    new THREE.MeshToonMaterial({ color: 0xB8C9FF })
  );

  /*   let texture = threejsAPI.addTextureLoader('') */
  sphere.position.y = 5;
  sphere.receiveShadow = true;
  sphere.castShadow = true;

  spotLight.target = sphere;
  return sphere;
};

const judgeISBoundary = (x: number, z: number) => {
  let isOverX = x < -planeSizeWidth / 2 || x + 1 > planeSizeWidth / 2;
  let isOverZ = z < -planeSizeWidth / 2 || z + 1 > planeSizeWidth / 2;
  if (isOverX || isOverZ) {
    return true;
  }

  return false;
};

plane = generatePlane();
scene.add(plane);
sphere = generateSphere();
scene.add(sphere);

let addKeyBoardControls = () => {
  window.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "w") {
      isForward.value = true;
    }
    if (key === "s") {
      isBack.value = true;
    }
    if (key === "a") {
      isLeft.value = true;
    }
    if (key === "d") {
      isRight.value = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    let key = e.key;

    if (key === "w") {
      isForward.value = false;
    }
    if (key === "s") {
      isBack.value = false;
    }
    if (key === "a") {
      isLeft.value = false;
    }
    if (key === "d") {
      isRight.value = false;
    }
  });
};

addKeyBoardControls();

let animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  point.rotation.y += 0.001;

  let stepX: number = 0;
  let stepZ: number = 0;

  if (isForward.value) {
    stepZ = -0.5;
  }

  if (isBack.value) {
    stepZ = 0.5;
  }

  if (isLeft.value) {
    stepX = -0.5;
  }

  if (isRight.value) {
    stepX = 0.5;
  }

  if (angle) {
    stepX = 0.5 * Math.cos((angle * Math.PI) / 180);
    stepZ = -0.5 * Math.sin((angle * Math.PI) / 180);
  }

  if (!judgeISBoundary(sphere.position.x + stepX, sphere.position.z + stepZ)) {
    sphere.position.x += stepX;
    sphere.position.z += stepZ;
  }
  camera.lookAt(sphere.position);
  camera.position.set(sphere.position.x, 100, sphere.position.z + 50);
};

let dragControl = (e: MouseEvent) => {
  let steeringWheel = document.querySelector(".steering-wheel") as HTMLElement;
  let controlDot = document.querySelector(".control-dot") as HTMLElement;
  if (controlDot instanceof HTMLElement) {
    let {
      top: ft,
      left: fl,
      height: fh,
      width: fw,
    } = steeringWheel.getBoundingClientRect();

    window.onmousemove = (mouse) => {
      let centerPoint = {
        y: ft + fh / 2,
        x: fl + fw / 2,
      };

      let x = mouse.pageX - centerPoint.x;
      let y = mouse.pageY - centerPoint.y;
      let r = fh / 2;
      const judgePointInCircle = () => {
        if ((Math.abs(x) ^ 2) + (Math.abs(y) ^ 2) < (r ^ 2)) {
          return true;
        } else {
          return false;
        }
      };

      angle = (Math.atan2(-y, x) * 180) / Math.PI;
      angle = angle < 0 ? angle + 360 : angle;

      let isInCircle = judgePointInCircle();
      if (isInCircle) {
        controlDot.style.left = mouse.pageX - fl + "px";
        controlDot.style.top = mouse.pageY - ft + "px";
      } else {
        let x = Math.cos((angle * Math.PI) / 180) * r;
        let y = Math.sin((angle * Math.PI) / 180) * r;

        controlDot.style.left = x + r + "px";
        controlDot.style.top = -y + r + "px";
      }
    };

    window.onmouseup = () => {
      controlDot.style.left = "50%";
      controlDot.style.top = "50%";

      angle = 0;
      window.onmousemove = null;
      window.onmouseup = null;
    };
  }
};

onMounted(() => {
  let element = document.querySelector(".three-person-container");
  if (element instanceof HTMLDivElement) {
    threejsAPI.appendCanvasToElement(element, renderer.domElement);
  }

  animate();
});
</script>

<style lang="scss" scoped>
.steering-wheel {
  position: absolute;
  bottom: 100px;
  left: 100px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 9;
  height: 100px;
  width: 100px;
  border-radius: 50%;

  .control-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #DCE5FF;
    cursor: pointer;
  }
}

.keyboard {
  position: fixed;
  right: 100px;
  bottom: 100px;
  display: grid;
  grid-template-columns: 50px 50px 50px;
  justify-items: center;

  div {
    height: 50px;
    width: 50px;
    line-height: 50px;
    text-align: center;
  }

  .key {
    user-select: none;
    font-size: 20px;
    color: #C8CFFF;
  }
}
</style>
