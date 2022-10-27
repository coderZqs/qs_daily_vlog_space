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
      var scene = new THREE.Scene();

      var axisHelper = new THREE.AxisHelper(250);
      scene.add(axisHelper);

      var point = new THREE.PointLight(0xffffff);
      point.position.set(100, 100, 100);
      scene.add(point);

      var ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);

      var width = window.innerWidth;
      var height = window.innerHeight;
      var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(100, 100, 100);

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      /*       renderer.setClearColor(0xb9d3ff, 1); */
      const controls = new OrbitControls(camera, renderer.domElement);
      document.body.appendChild(renderer.domElement);
      function render() {
        renderer.render(scene, camera);
        controls.update();

        requestAnimationFrame(render);
      }
      render();
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style></style>
