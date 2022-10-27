<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/* import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"; */
import * as CANNON from "cannon-es";
import CannonEsDebugger from "cannon-es-debugger";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      /*       let human; */
      let renderer = new THREE.WebGLRenderer({
        antialias: true,
      });

      /*       var raycaster = new THREE.Raycaster(); */
      let mouse = new THREE.Vector2();

      renderer.outputEncoding = THREE.sRGBEncoding;
      let scene = new THREE.Scene();
      let ratios = window.innerWidth / window.innerHeight;
      let camera = new THREE.PerspectiveCamera(45, ratios, 0.5, 20000);
      scene.add(camera);
      camera.position.set(0, 100, 100);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;

      let spotLight = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 6);
      spotLight.position.set(0, 300, 0);
      scene.add(spotLight);
      spotLight.castShadow = true;
      //   环境光
      let ambient = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
      scene.add(ambient);

      // 创建地板

      let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshPhongMaterial()
      );

      plane.position.set(0, 0, 0);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      scene.add(plane);

      let textureLoader = new THREE.TextureLoader();
      textureLoader.load("/src/assets/image/plane.png", (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        plane.material.map = texture;
        sphere.material.needsUpdate = true;
      });

      let sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
      let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      /*       scene.add(sphere); */

      sphere.position.y = 3;
      sphere.position.z = 100;

      let footballTextureLoader = new THREE.TextureLoader();
      footballTextureLoader.load(
        "/src/assets/image/football.png",
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          sphere.material.map = texture;
          sphere.material.needsUpdate = true;
        }
      );

      //   添加物理世界
      //   创建世界

      let world = new CANNON.World();
      const defaultMaterial = new CANNON.Material("default");
      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
          friction: 0.1,
          restitution: 0.3,
        }
      );
      world.addContactMaterial(defaultContactMaterial);
      world.gravity.set(0, -9.82, 0); // 重力

      //   地板

      const planeShape = new CANNON.Plane();
      let planeBody = new CANNON.Body({
        mess: 0,
      });

      planeBody.addShape(planeShape);
      planeBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
      );
      planeBody.position.set(0, 0, 0);
      planeBody.material = defaultMaterial;
      world.addBody(planeBody);
      //   球

      const sphereShape = new CANNON.Sphere(2, 32, 32);
      let sphereBody = new CANNON.Body({
        mass: 1,
      });

      sphereBody.addShape(sphereShape);
      sphereBody.angularDamping = 0.5;
      sphereBody.position.set(0, 4, 0);
      sphereBody.material = defaultMaterial;
      world.addBody(sphereBody);
      let cannonDebugger = CannonEsDebugger(scene, world);

      //  控制器
      let control = new OrbitControls(camera, renderer.domElement);
      let dom = document.querySelector("#container");
      dom.appendChild(renderer.domElement);

      let animate = () => {
        requestAnimationFrame(animate);
        cannonDebugger.update();
        world.fixedStep(1 / 60);
        control.update();
        renderer.render(scene, camera);

        /*   sphere.position.copy(sphereBody.position);
        sphere.quaternion.copy(sphereBody.quaternion); */
      };

      animate();
      document.onmousemove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      document.onkeydown = (e) => {
        let keyCode = e.keyCode;

        if (keyCode === 90) {
          sphereBody.velocity.set(0, 17, 100);
          sphereBody.angularVelocity.set(
            Math.random() * 8 * Math.PI,
            Math.random() * 8 * Math.PI,
            Math.random() * 8 * Math.PI
          );
        }
      };
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style></style>
