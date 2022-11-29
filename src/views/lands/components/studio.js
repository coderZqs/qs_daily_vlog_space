import * as THREE from "three";
let crystalBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xfffff,
  })
);

crystalBall.position.set(0, 0.2, 0);
export default crystalBall;
