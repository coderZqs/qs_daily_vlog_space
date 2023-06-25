<template>
  <div class="canvas"></div>
</template>

<script setup lang="ts">
import T from "@/threejs/index";
import { AmbientLight } from "three";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { optionOptions } from "ant-design-vue/lib/vc-mentions/src/Option";
import { PositionalAudio } from "three";
import { Vector3 } from "three";

/* let openOptions = {
  size: 0,
  uFrequency: 0
};

const gui = new GUI();
const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(openOptions, "size", 0, 50);
cubeFolder.open();
 */


let batSpeed = 0.1;
let sss = 1;
let ddd = Math.PI / 180 * 90;

let isToForWord = true;
const clock = new THREE.Clock()

class GL {
  public camera: THREE.Camera = T.initCamera();
  public renderer: THREE.Renderer = T.initRenderer();
  public scene: THREE.Scene = new THREE.Scene();
  public canvas: HTMLElement | null = null;
  public ambientLight: THREE.AmbientLight | null = null;
  public points: THREE.Points | null = null;
  public mixer = null;
  public bat = null;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.initScene();
  }

  initBat() {
    T.loadGLTF("/src/assets/3dModel/toon-bat/scene.gltf", (gltf) => {
      let bat = gltf.scene;
      this.scene.add(bat);

      bat.position.y = 13;
      bat.position.z = 5;
      bat.position.x = 5;

      bat.rotation.y = Math.PI / 2;
      bat.scale.set(0.03, 0.03, 0.03);

      let obj = {};

      bat.traverse((e) => {
        if (e.name === 'RootNode') {
          obj = e;
        }
      })

      this.bat = bat;

      this.mixer = new THREE.AnimationMixer(obj);
      let AnimationAction = this.mixer.clipAction(gltf.animations[0]);
      AnimationAction.timeScale = 1;
      AnimationAction.play();//开始播放
    })
  }

  initWall() {
    let wall = new THREE.Mesh(new THREE.BoxGeometry(100, 20, 1), new THREE.MeshPhysicalMaterial({ color: 0x1F1F1F }))
    wall.position.set(0, 10, 0);
    wall.receiveShadow = true;
    wall.castShadow = true;
    this.scene.add(wall);


    let plane = new THREE.Mesh(new THREE.BoxGeometry(100, 20, 1), new THREE.MeshPhongMaterial({ color: 0x262624 }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.z = 10;
    this.scene.add(plane)

    let rightPlane = new THREE.Mesh(new THREE.BoxGeometry(100, 20, 1), new THREE.MeshPhongMaterial({ color: 0x1F1F1F }));
    rightPlane.position.z = 20;
    rightPlane.position.y = 10;
    this.scene.add(rightPlane)

    let topPlane = new THREE.Mesh(new THREE.BoxGeometry(100, 20, 1), new THREE.MeshPhongMaterial({ color: 0x1F1F1F }));
    topPlane.position.y = 20;
    topPlane.position.z = 10;
    topPlane.rotation.x = -Math.PI / 2;
    this.scene.add(topPlane)
  }

  initPointLight() {
    T.loadGLTF("/src/assets/3dModel/minecraft_torch/scene.gltf", (gltf) => {
      T.addTextureLoader('/src/assets/3dModel/minecraft_torch/textures/Material.003_baseColor.png', (texture) => {

        let light = gltf.scene;

        light.traverse((e) => {
          e.castShadow = true;
          // e.receiveShadow = true;

          /* if (e.type === 'Mesh') {
            e.material.map = texture;
          } */
        })

        for (let i = 0; i <= 4; i++) {
          let copyLight = light.clone();

          this.scene.add(copyLight);
          copyLight.position.set(25 * i - 50, 15, 0.8);
          copyLight.rotation.x = Math.PI / 4;

          let pointLight = new THREE.PointLight(0xDCDCAA, 1, 100);
          pointLight.castShadow = true;
          this.scene.add(pointLight)

          // let pointHelper = new THREE.PointLightHelper(pointLight);
          // this.scene.add(pointHelper);

          pointLight.position.x = copyLight.position.x;
          pointLight.position.y = copyLight.position.y + 0.45;
          pointLight.position.z = copyLight.position.z + 0.4;

        }
      })
    })
  }

  initScene() {
    this.initBat();
    this.renderer.shadowMap.enabled = true;
    this.scene.receiveShadow = true;
    this.initPointLight();
    this.iniAmbientLight();
    this.initWall();
    this.camera.position.set(0, 15, 15);
    this.camera.lookAt(new Vector3(0, 10, -10))
    this.scene.add(this.camera);
    T.appendCanvasToElement(this.canvas!, this.renderer?.domElement);
    this.animate();
    // this.initCube();
    // T.addOrbitControls(this.camera, this.renderer.domElement);
  }

  animate() {
    const time = clock.getDelta()
    if (this.mixer) {
      this.mixer.update(time)
    }

    requestAnimationFrame(() => {
      this.animate();
    });

    this.renderer.render(this.scene, this.camera);

    if (this.points) {
      this.points.material.uniforms.uProgress.value = openOptions.size;
      this.points.material.uniformsNeedUpdate = true;
    }

    if (this.bat) {

      // if (this.bat.position.x <= -30) {
      //   isToForWord = false;
      // }

      // if (!isToForWord) {
      //   sss += 0.01;
      //   ddd += 0.05;
      //   batSpeed = Math.cos(sss);
      // }

      this.bat.position.x -= batSpeed;
      // this.bat.rotation.y = ddd;
    }
  }

  initTestCube() {
    let box = T.generateCube([1, 1, 1], "MeshPhysicalMaterial", {
      color: 0xff0000
    });

    this.scene.add(box);
  }

  initCube() {
    this.initTestCube();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/src/assets/image/fomale.png", texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      let geometry = new THREE.BufferGeometry();

      let width = 500;
      let height = 500;
      let points = [];
      let distance = [];
      let uv = [];

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          points.push((i / width) * 2 - 1);
          points.push((j / height) * 2 - 1);
          points.push(0);

          uv.push(i / width);
          uv.push(j / height);

          let disx = i - width / 2;
          let disy = j - height / 2;

          distance.push(disx / width);
          distance.push(disy / height);
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(points), 3)
      );
      geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(uv), 2)
      );
      geometry.setAttribute(
        "distance",
        new THREE.BufferAttribute(new Float32Array(distance), 2)
      );

      let material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: `
        uniform float uProgress;
        attribute vec2 distance;
        varying vec2 vUV;
        uniform vec2 uFrequency;
        void main() {
            vUV = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x + distance.x * uProgress,position.y + distance.y * uProgress, sin((position.x + distance.x * uProgress) * 3.0) , 1.0);
            gl_PointSize = 5.0;
        }`,

        fragmentShader: `
        varying vec2 vUV;
        uniform sampler2D uTexture;
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
          },

          uProgress: {
            value: openOptions.size
          }
        }
      });

      this.points = new THREE.Points(geometry, material);
      this.scene.add(this.points);
    });
  }

  iniAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.58);
    this.scene.add(this.ambientLight);
  }
}

onMounted(() => {
  new GL(document.querySelector(".canvas")!);
});
</script>

<style scoped></style>
