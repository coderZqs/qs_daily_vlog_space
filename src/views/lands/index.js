import * as THREE from "three";
import crystalBall from "./components/studio";
let landGroup = new THREE.Group();

let light = new THREE.PointLight(0xefd49e);
light.position.set(0, 25, 0);
landGroup.add(light);

// 球
let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(15, 32, 32),
  new THREE.MeshPhongMaterial({
    color: 0xccccc,
    side: THREE.DoubleSide,
  })
);
landGroup.add(sphere);

landGroup.add(crystalBall);

let plane = new THREE.Mesh(
  new THREE.CircleGeometry(15),
  new THREE.MeshPhongMaterial({
    color: 0xccccccc,
  })
);

plane.rotation.x = -Math.PI / 2;

landGroup.add(plane);

export default landGroup;
