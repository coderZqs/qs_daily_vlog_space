<template>
  <div class="container"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";

let vertexShader = `
   varying vec3 vertexNormal;
   void main(){
      vertexNormal = normal;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position, 1.0);
   }
`;

let fragmentShader = `
   varying vec3 vertexNormal;
   void main(void){
      float intensity = 1.05 - dot(vertexNormal, vec3(0.,0.,1.));
      vec3 atmosphere = vec3(.3, .6, 1.) * intensity;
      gl_FragColor=vec4(atmosphere,0.) + vec4(0.,0.,0.2,1.);
   }
`;

import threejsAPi, { VertexNormalsHelper } from "../threejs/index";

let renderer = threejsAPi.initRenderer();
let camera = threejsAPi.initCamera();
let scene = new THREE.Scene();

var material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});
var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), material);
scene.add(mesh);
mesh.position.set(0, 0, 0);
camera.position.set(0, 0, 10);

let orbitControls = threejsAPi.addOrbitControls(camera, renderer.domElement);
threejsAPi.addAdaptionScreen(renderer, camera);

const helper = new VertexNormalsHelper(mesh, 0.2, 0xff0000);
scene.add(helper);

// start animation
function animate() {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

onMounted(() => {
  let container = document.querySelector(".container");
  threejsAPi.appendCanvasToElement(
    container as HTMLElement,
    renderer.domElement
  );
  animate();
});
</script>

<style></style>
