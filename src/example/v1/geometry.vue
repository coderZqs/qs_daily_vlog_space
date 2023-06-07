<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      let renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      let scene = new THREE.Scene();
      let ratios = window.innerWidth / window.innerHeight;
      let camera = new THREE.PerspectiveCamera(45, ratios, 0.5, 20000);
      scene.add(camera);
      camera.position.set(100, 300, 200);
      camera.lookAt(scene.position);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // 环境光
      let ambient = new THREE.AmbientLight();
      scene.add(ambient);

      // BoxGeometry是正方体
      let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.MeshPhongMaterial({ color: 0xd58e7e })
      );
      // circleGeometry 圆形
      // Cone 圆锥
      // Cylinder 圆柱
      // Dodecahedron 十二面
      mesh.castShadow = true;
      scene.add(mesh);

      //  控制器
      let control = new OrbitControls(camera, renderer.domElement);
      let dom = document.querySelector("#container");
      dom.appendChild(renderer.domElement);

      let animate = () => {
        requestAnimationFrame(animate);
        control.update();
        renderer.render(scene, camera);
      };

      animate();
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style></style>
