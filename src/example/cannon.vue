<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

/* let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let scene = new THREE.Scene();

let size = {
  w: window.innerWidth,
  h: window.innerHeight,
};

renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(45, size.w / size.h, 0.1, 110);
camera.position.set(0, 10, 50);
const controls = new OrbitControls(camera, renderer.domElement);

let plane = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshPhongMaterial({ color: 0xd9d9d9 })
);

plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;
scene.add(plane);

let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 32),
  new THREE.MeshStandardMaterial({ color: 0xd9d9d9 })
);

sphere.position.y = 1;
sphere.castShadow = true;
scene.add(sphere);

let light = new THREE.AmbientLight(0xffffff, 0.28);
scene.add(light);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// 方向光投影近点、远点更新
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;

scene.add(directionalLight);

let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const sphereShape = new CANNON.Sphere(1);
const sphereBody = new CANNON.Body({
  mess: 5,
  position: new CANNON.Vec3(0, 10, 0),
  shape: sphereShape,
});
world.addBody(sphereBody);
console.log(world);

renderer.render(scene, camera);

let animate = () => {
  controls.update();
  world.fixedStep();
  sphere.position.copy(sphereBody.position);
  //   sphere.position.y -= 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
 */

// three.js variables
let camera, scene, renderer, controls;
let mesh;
let bottomMesh;

// cannon.js variables
let world;
let body;
let bottomBody;

initThree();
initCannon();
animate();

function initThree() {
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.z = 20;

  // Scene
  scene = new THREE.Scene();

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  controls = new OrbitControls(camera, renderer.domElement);
  // Box
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // bottom

  bottomMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 5, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );

  bottomMesh.position.set(1.1, 5, 0);
  scene.add(bottomMesh);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );
  world.addContactMaterial(defaultContactMaterial);

  // Box
  const shape = new CANNON.Sphere(1);
  body = new CANNON.Body({
    mass: 1,
  });
  body.position = new CANNON.Vec3(0, 10, 0);
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  body.material = defaultMaterial;
  world.addBody(body);

  // plane

  const planeShape = new CANNON.Plane();
  let planeBody = new CANNON.Body({
    mess: 1,
  });

  planeBody.addShape(planeShape);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(planeBody);

  planeBody.material = defaultMaterial;

  // 底座

  const bottomShape = new CANNON.Sphere(1);
  bottomBody = new CANNON.Body({
    mess: 1,
  });

  bottomBody.position = new CANNON.Vec3(1.1, 2, 0);
  bottomBody.material = defaultMaterial;
  bottomBody.angularVelocity.set(0, 10, 0);
  bottomBody.angularDamping = 0.5;
  bottomBody.addShape(bottomShape);
  world.addBody(bottomBody);
}

function animate() {
  requestAnimationFrame(animate);

  // Step the physics world
  world.fixedStep();

  // Copy coordinates from cannon.js to three.js
  mesh.position.copy(body.position);
  mesh.quaternion.copy(body.quaternion);
  bottomMesh.position.copy(
    new THREE.Vector3(
      bottomBody.position.x,
      bottomBody.position.y + 2.5,
      bottomBody.position.z
    )
  );
  console.log(bottomBody.position);

  // Render three.js
  controls.update();
  renderer.render(scene, camera);
}

onMounted(() => {
  document.querySelector(".container").appendChild(renderer.domElement);
  animate();
});
</script>

<style></style>
