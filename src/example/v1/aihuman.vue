<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from "cannon-es";
import CannonEsDebugger from "cannon-es-debugger";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      let human;
      let renderer = new THREE.WebGLRenderer({
        antialias: true,
      });

      var raycaster = new THREE.Raycaster();
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
      /*       let DirectionalLight = new THREE.DirectionalLight(0xfffff, 0.5);
        DirectionalLight.position.set(-100, 100, 0);
        scene.add(DirectionalLight); */

      //  创建点光源辅助
      /* let lightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(lightHelper); */

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

      //   生成正方体

      let generateCube = (l, w, d, color) => {
        const shape = new THREE.Shape();

        shape.moveTo(0, 0);
        shape.lineTo(0, l);
        shape.lineTo(w, l);
        shape.lineTo(w, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
          steps: 2,
          depth: d,
          bevelEnabled: false,
        };

        let wallGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let wallMaterial = new THREE.MeshBasicMaterial({ color: color });
        let wall = new THREE.Mesh(wallGeometry, wallMaterial);

        return wall;
      };

      //   生成墙壁

      let wallGroup = new THREE.Group();
      let wallL = 60;
      let wallW = 120;
      let wallD = 50;

      let backWall = generateCube(wallL, wallW, 1, 0xffffff);
      backWall.position.set(0, 0, -0);
      wallGroup.add(backWall);

      let leftWall = generateCube(wallL, wallD, 1, 0xffffff);
      leftWall.position.set(-0, 0, wallD);
      leftWall.rotation.y = Math.PI / 2;
      wallGroup.add(leftWall);

      let rightBall = generateCube(wallL, wallD, 1, 0xffffff);
      rightBall.position.set(wallW, 0, wallD);
      rightBall.rotation.y = Math.PI / 2;
      wallGroup.add(rightBall);

      let topBall = generateCube(wallD, wallW, 1, 0xffffff);
      topBall.position.set(0, wallL, wallD);
      topBall.rotation.x = -Math.PI / 2;
      wallGroup.add(topBall);

      scene.add(wallGroup);
      wallGroup.position.set(-wallW / 2, 0, -60);

      //   发球线

      const lineGeometry = new THREE.PlaneGeometry(3, 80);
      let line = new THREE.Mesh(
        lineGeometry,
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );

      scene.add(line);
      line.rotation.z = Math.PI / 2;
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 3, 100);

      //   足球

      let sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
      let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

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

      //   人物

      const gltfLoader = new GLTFLoader();
      gltfLoader.load("/src/assets/image/character.glb", (gltf) => {
        human = gltf.scene.children[0];
        human.scale.set(30, 30, 30);
        human.castShadow = true;
        gltf.scene.castShadow = true;
        human.traverse((item) => {
          item.castShadow = true;
        });

        scene.add(human);
        camera.lookAt(human.children[0]);
      });
      /*    let loader = new FBXLoader();
      // 加载人物
      loader.load("/src/assets/image/human.fbx", (object) => {
        object.castShadow = true;
        object.traverse(function (child) {
          if (child.isMesh) {
            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.emissiveMap = child.material.map;
            child.material.specular.setScalar(0.1);
          }
        });

        let animations = object.animations;
        object.scale.set(0.02, 0.02, 0.02);
        object.position.y = 0;
        scene.add(object);

        camera.lookAt(object.position);
        human = object;

        let mixer = new THREE.AnimationMixer(human);
        let idleAnim = new THREE.AnimationClip.findByName(
          animations,
          "mixamo.com"
        );
        let idle = mixer.clipAction(idleAnim);
        idle.play();
      }); */

      //   添加物理世界
      //   创建世界

      let world = new CANNON.World();
      const defaultMaterial = new CANNON.Material("default");
      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
          friction: 0.1, // 恢复力
          restitution: 0.4, // 弹力
        }
      );
      world.addContactMaterial(defaultContactMaterial);
      world.gravity.set(0, -9.82, 0); // 重力
      world.solver.iterations = 1000;

      // 创建人物
      let humanShape = new CANNON.Box(new CANNON.Vec3(5, 17, 1));
      let humanBody = new CANNON.Body({
        mass: 50,
      });
      humanBody.position.set(0, 17, 0);
      humanBody.material = defaultMaterial;
      humanBody.angularVelocity.set(0, 0, 0);
      humanBody.angularDamping = 1;
      humanBody.addShape(humanShape);
      world.addBody(humanBody);

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
      world.addBody(planeBody);
      planeBody.material = defaultMaterial;

      //   球

      const sphereShape = new CANNON.Sphere(3);
      let sphereBody = new CANNON.Body({
        mass: 4,
      });

      sphereBody.angularDamping = 0.5;
      sphereBody.addShape(sphereShape);
      sphereBody.position.set(0, 3, 100);
      sphereBody.material = defaultMaterial;
      world.addBody(sphereBody);

      //   墙

      /*  let wallGroup = new THREE.Group();
      let wallL = 60;
      let wallW = 120;
      let wallD = 50; */

      let backWallShape = new CANNON.Box(
        new CANNON.Vec3(wallL / 2, wallW / 2, 1)
      );
      let backWallBody = new CANNON.Body({ mass: 0 });
      backWallBody.addShape(backWallShape);
      backWallBody.position.set(0, wallL / 2, -60);
      backWallBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1),
        Math.PI / 2
      );
      world.addBody(backWallBody);

      let leftWallShape = new CANNON.Box(
        new CANNON.Vec3(wallD / 2, wallL / 2, 1)
      );
      let leftWallBody = new CANNON.Body({ mass: 0 });
      leftWallBody.addShape(leftWallShape);
      leftWallBody.position.set(-wallW / 2, wallL / 2, -30);
      leftWallBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        Math.PI / 2
      );
      world.addBody(leftWallBody);

      let rightWallShape = new CANNON.Box(
        new CANNON.Vec3(wallD / 2, wallL / 2, 1)
      );
      let rightWallBody = new CANNON.Body({ mass: 0 });
      rightWallBody.addShape(rightWallShape);
      rightWallBody.position.set(wallW / 2, wallL / 2, -30);
      rightWallBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        Math.PI / 2
      );
      world.addBody(rightWallBody);

      let topWallShape = new CANNON.Box(
        new CANNON.Vec3(wallW / 2, wallD / 2, 1)
      );
      let topWallBody = new CANNON.Body({ mass: 0 });
      topWallBody.addShape(topWallShape);
      topWallBody.position.set(0, wallW / 2, -35);
      topWallBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        Math.PI / 2
      );
      world.addBody(topWallBody);

      let cannonDebugger = CannonEsDebugger(scene, world);

      //  控制器
      let control = new OrbitControls(camera, renderer.domElement);
      let dom = document.querySelector("#container");
      dom.appendChild(renderer.domElement);

      let animate = () => {
        requestAnimationFrame(animate);
        /*         cannonDebugger.update(); */
        world.fixedStep(1 / 60);
        control.update();
        renderer.render(scene, camera);
        if (human) {
          human.position.copy(humanBody.position);
          human.quaternion.copy(humanBody.quaternion);
          human.translateY(-17);
          raycaster.setFromCamera(mouse, camera);
          var intersectObject = raycaster.intersectObjects([sphere]);

          let isMouseTouchHuman = Boolean(intersectObject.length);
          /*   if (isMouseTouchHuman) {

          } */
          //   human.position.y -= 17;
        }

        sphere.position.copy(sphereBody.position);
        sphere.quaternion.copy(sphereBody.quaternion);
      };

      animate();
      document.onmousemove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      document.onkeydown = (e) => {
        let keyCode = e.keyCode;

        var box = new THREE.Box3().setFromObject(human);
        console.log(box);
        if (keyCode === 90) {
          let power = 1;
          humanBody.velocity.set(0, 10, 0);
          /* sphereBody.angularVelocity.set(0, 34 * power, -100 * power); */
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
