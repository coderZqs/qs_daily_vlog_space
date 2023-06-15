<template>
  <div class="canvas"></div>
</template>

<script setup lang="ts">
import T from "@/threejs/index";
import { AmbientLight } from "three";
import { onMounted } from "vue";
import * as THREE from "three";

class GL {
  public camera: THREE.Camera = T.initCamera();
  public renderer: THREE.Renderer = T.initRenderer();
  public scene: THREE.Scene = new THREE.Scene();
  public canvas: HTMLElement | null = null;
  public ambientLight: THREE.AmbientLight | null = null;
  public points: THREE.Points | null = null;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.initScene();
  }

  initScene() {
    this.iniAmbientLight();
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);
    T.appendCanvasToElement(this.canvas!, this.renderer?.domElement);
    this.animate();
    this.initCube();
    T.addOrbitControls(this.camera, this.renderer.domElement);
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    this.renderer.render(this.scene, this.camera);
  }

  initCube() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/src/assets/image/fomale.png", texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      let geometry = new THREE.BufferGeometry();

      let width = 500;
      let height = 500;
      let points = []
      let distance = []

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          points.push(i / width);
          points.push(j / height);
          points.push(0);


          let disx = i - width;
          let disy = j - height / 2;

          distance.push(disx / (width))
          distance.push(disy / (height))
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 2));
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(points), 2));
      geometry.setAttribute('distance', new THREE.BufferAttribute(new Float32Array(distance), 2));


      let material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: `
        attribute vec2 distance;
        varying vec2 vUV;
        uniform vec2 uFrequency;
        void main() {
            vUV = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y + distance.y, 0.0 , 1.0);
            gl_PointSize = 1.0;
        }`,

        fragmentShader: `
        varying vec2 vUV; // uv
        uniform sampler2D uTexture; // 材质
        void main() { 
             vec4 color=texture2D(uTexture,vUV);
             gl_FragColor=color;
        }`,
        uniforms: {
          uTexture: {
            value: texture
          },

          uFrequency: {
            value: new THREE.Vector2(10, 3)
          }
        }
      });

      this.points = new THREE.Points(geometry, material);
      this.points.position.set(-0.5, -0.5, 0);
      this.scene.add(this.points);
    });
  }

  iniAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.27);
    this.scene.add(this.ambientLight);
  }
}

onMounted(() => {
  new GL(document.querySelector(".canvas")!);
});
</script>

<style scoped></style>
