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
  public mesh: THREE.Mesh | null = null;

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
    textureLoader.load("/src/assets/image/1665467568000.jpg", texture => {
      console.log(texture);
      let geometry = new THREE.PlaneGeometry(5);

      let material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUV;

        float random (float p) {
          return fract(sin(p)*43758.5453123);
        }

        void main() {

            // 顶点着色器计算后的Position
            vPosition = position;
            // 把uv数据传递给片元
            vUV = uv;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,random(position.y),0.5 * sin(position.x * 10.0), 1.0);
        }`,

        fragmentShader: `
        uniform float uRadius; // 设置一个半径范围
        uniform vec3 uColor; // 颜色1
        varying vec3 vPosition; // 顶点数据
        varying vec2 vUV; // uv
        uniform sampler2D uTexture; // 材质
        void main() { 
            // 材质和uv计算为当前位置颜色
            vec4 mapColor = texture2D(uTexture, vUV);

            vec3 vCenter = vec3(0.0, 0.0, 0.0);

            float len = distance(vCenter, vPosition);

            if (len < uRadius) {
                gl_FragColor = mapColor;
            } else {
                gl_FragColor = vec4(uColor, 1.0);
            }
        }`,
        uniforms: {
          uColor: {
            value: new THREE.Color("#CCCCCC")
          },
          uRadius: {
            value: 5000
          },
          uTexture: {
            value: texture
          }
        }
      });

      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(0, 0, 0);
      this.scene.add(this.mesh);
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
