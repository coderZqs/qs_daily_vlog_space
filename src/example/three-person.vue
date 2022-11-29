<template>
  <div class="three-person-container">
    <div class="steering-wheel">
      <div class="control-dot" @mousedown="dragControl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import threejsAPI from "@/threejs/index";
import { onMounted } from "vue";

let renderer: THREE.WebGLRenderer = threejsAPI.initRenderer();
let scene: THREE.Scene = new THREE.Scene();
let light: THREE.Light = new THREE.AmbientLight(0xffffff);
let camera: THREE.Camera = threejsAPI.initCamera("PerspectiveCamera");
let plane: THREE.Mesh;
let sphere: THREE.Mesh;
let isForward = false;
let isLeft = false;
let isRight = false;
let isBack = false;
let angle = 0;

light.position.set(0, 0, 0);
scene.add(light);
camera.position.set(0, 30, 100);

const generatePlane = (): THREE.Mesh => {
  plane = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0xdee1e6,
    })
  );

  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0, 0);

  return plane;
};

const generateSphere = (): THREE.Mesh => {
  let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 36, 36),
    new THREE.MeshStandardMaterial({ color: 0x050a32 })
  );
  sphere.position.y = 1;
  return sphere;
};

plane = generatePlane();
scene.add(plane);
sphere = generateSphere();
scene.add(sphere);

let addKeyBoardControls = () => {
  window.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "w") {
      isForward = true;
    }
    if (key === "s") {
      isBack = true;
    }
    if (key === "a") {
      isLeft = true;
    }
    if (key === "d") {
      isRight = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    let key = e.key;

    if (key === "w") {
      isForward = false;
    }
    if (key === "s") {
      isBack = false;
    }
    if (key === "a") {
      isLeft = false;
    }
    if (key === "d") {
      isRight = false;
    }
  });
};

addKeyBoardControls();

let animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (isForward) {
    sphere.position.z -= 0.5;
  }
  if (isBack) {
    sphere.position.z += 0.5;
  }

  if (isLeft) {
    sphere.position.x -= 0.5;
  }

  if (isRight) {
    sphere.position.x += 0.5;
  }

  if (angle) {
    sphere.position.x += 0.5 * Math.cos((angle * Math.PI) / 180);
    sphere.position.z += -0.5 * Math.sin((angle * Math.PI) / 180);
  }

  camera.lookAt(sphere.position);
  camera.position.set(sphere.position.x, 50, sphere.position.z + 50);
};

let dragControl = (e: MouseEvent) => {
  let steeringWheel = document.querySelector(".steering-wheel") as HTMLElement;
  let controlDot = document.querySelector(".control-dot") as HTMLElement;
  if (controlDot instanceof HTMLElement) {
    let { top, left } = controlDot.getBoundingClientRect();
    let {
      top: ft,
      left: fl,
      height: fh,
      width: fw,
    } = steeringWheel.getBoundingClientRect();
    let startX = e.pageX - left;
    let startY = e.pageY - top;

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
  background: red;
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
    background: gray;
    cursor: pointer;
  }
}
</style>
