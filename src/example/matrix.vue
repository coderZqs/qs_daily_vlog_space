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
      renderer.shadowMap.enabled = true;

      /*       let spotLight = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 5);
      spotLight.position.set(-100, 100, 0);
      scene.add(spotLight);
      spotLight.castShadow = true; */

      //   环境光
      let ambient = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
      scene.add(ambient);

      //   创建地板

      let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshPhongMaterial()
      );

      plane.position.set(0, -50, 0);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      scene.add(plane);

      let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(50, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0xd58e7e })
      );
      mesh.castShadow = true;
      scene.add(mesh);

      let T = new THREE.Matrix4();
      T.makeTranslation(10, 2, 2);
      T.makeRotationY(Math.PI / 2);

      mesh.applyMatrix4(T);

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
