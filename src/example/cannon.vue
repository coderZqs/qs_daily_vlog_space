<template>
  <div class="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import cannonEsDebugger from "cannon-es-debugger";

let camera, scene, renderer, cannonDebugger, controls;
let mesh;
let bottomMesh;

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

  /*   controls = new OrbitControls(camera, renderer.domElement); */
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
      restitution: 0,
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
  body.angularVelocity.set(0, 100, 0);
  body.angularDamping = 0.5;
  body.material = defaultMaterial;
  world.addBody(body);

  // 底座

  const bottomShape = new CANNON.Sphere(1);
  bottomBody = new CANNON.Body({
    mass: 1,
  });
  bottomBody.position = new CANNON.Vec3(1.1, 5, 0);
  bottomBody.addShape(bottomShape);
  bottomBody.angularVelocity.set(0, 10, 0);
  bottomBody.angularDamping = 0.5;
  bottomBody.material = defaultMaterial;
  world.addBody(bottomBody);

  // plane

  const planeShape = new CANNON.Plane();
  let planeBody = new CANNON.Body({
    mess: 1,
  });

  planeBody.addShape(planeShape);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(planeBody);

  planeBody.material = defaultMaterial;

  cannonDebugger = cannonEsDebugger(scene, world);
}

function animate() {
  requestAnimationFrame(animate);

  world.fixedStep();

  /*   mesh.position.copy(bottomBody.position);
  mesh.quaternion.copy(bottomBody.quaternion); */
  /*   bottomMesh.position.copy(
    new THREE.Vector3(
      bottomBody.position.x,
      bottomBody.position.y + 2.5,
      bottomBody.position.z
    )
  ); */

  // Render three.js
  /*   controls.update(); */
  camera.position.copy(body.position);
  cannonDebugger.update();
  renderer.render(scene, camera);
}

onMounted(() => {
  document.querySelector(".container").appendChild(renderer.domElement);
  animate();

  window.onkeydown = (ev) => {
    let keycode = ev.keyCode;
    console.log(keycode);

    if (keycode === 32) {
      body.applyForce(new CANNON.Vec3(0, 200, 0), new CANNON.Vec3(0, 0, 0));
    }

    if (keycode === 65) {
      body.applyForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0));
    }

    if (keycode === 68) {
      body.applyForce(new CANNON.Vec3(-100, 0, 0), new CANNON.Vec3(0, 0, 0));
    }
  };
});
</script>

<style></style>
