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

      //Create a closed wavey loop
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10),
      ]);

      //   const points = curve.getPoints(50);
      const geometry = new THREE.TubeGeometry(curve, 300, 2, 20, false);
      const material = new THREE.MeshBasicMaterial({
        color: 0x34a853,
        wireframe: true,
      });

      // Create the final object to add to the scene
      const curveObject = new THREE.Mesh(geometry, material);
      scene.add(curveObject);

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      /*       renderer.setClearColor(0xb9d3ff, 1); */
      const controls = new OrbitControls(camera, renderer.domElement);
      document.body.appendChild(renderer.domElement);

      let i = 0;
      function render() {
        renderer.render(scene, camera);
        controls.update();
        i += 0.01;
        let point = curve.getPoint(i);
        let lookPoint = curve.getPoint(i + 0.1);
        console.log(point);

        camera.position.set(point.x, point.y, point.z);
        camera.lookAt(new THREE.Vector3(lookPoint.x, lookPoint.y, lookPoint.z));

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
