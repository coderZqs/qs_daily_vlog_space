<template>
  <div class="canvas"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import T from "@/threejs/index";
import * as THREE from "three";

let renderer: THREE.WebGLRenderer, camera, scene;

onMounted(() => {
  camera = T.initCamera();
  renderer = T.initRenderer();
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x00000, 10, 30);

  // 灯光
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
  scene.add(ambientLight);

  let element = document.querySelector(".canvas") as HTMLElement;
  T.addAdaptionScreen(renderer, camera);
  T.appendCanvasToElement(element, renderer.domElement);
  T.addOrbitControls(camera, renderer.domElement);

  let material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: `
        varying vec2 v_uv;
        void main() {
           v_uv = uv;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader: `
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 st) {
       vec2 i = floor(st);
       vec2 f = fract(st);
   
       float a = random(i);
       float b = random(i + vec2(1.0, 0.0));
       float c = random(i + vec2(0.0, 1.0));
       float d = random(i + vec2(1.0, 1.0));
   
       vec2 u = f * f * (3.0 - 2.0 * f);
   
       return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
     }

       varying vec2 v_uv;
       uniform vec2 u_mouse;
       uniform vec2 u_resolution;
       uniform vec3 u_color;
       uniform float u_time;
       
       
       void main() {
         vec2 st = gl_FragCoord.xy / u_resolution.xy;

         gl_FragColor = vec4(st,gl_FragCoord.z, 1.0);
    }`,

    uniforms: {
      u_mouse: {
        value: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      },
      u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
      u_time: { value: 0.0 },
      u_color: { value: new THREE.Color(0xff0000) }
    }
  });

  let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  scene.add(box);
  box.position.set(0, 0, 0);

  camera.position.set(0, 0, 2);
  animate();
});

let animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
</script>

<style scoped></style>
