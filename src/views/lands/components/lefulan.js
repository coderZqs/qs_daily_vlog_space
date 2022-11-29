import * as THREE from "three";

import threejsAPI from "@/threejs/index";

let group = new THREE.Group();
var tray = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 0.2, 20),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
tray.position.set(0, 0, 0);
group.add(tray);

threejsAPI.loadOBJ("/src/assets/models/guisu.obj", (obj) => {
  let model = obj.children[0];
  model.scale.set(0.03, 0.03, 0.03);
  group.add(model);
});

group.position.set(0, 0, -10);

export default group;
