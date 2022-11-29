import * as THREE from "three";
import threejsAPI from "@/threejs/index";

// 关键帧， 剪辑， 操作（播放方式）

let group = new THREE.Group();
var tray = new THREE.Mesh(
  new THREE.CylinderGeometry(2, 2, 0.2, 40),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
tray.position.set(0, 0, 0);
group.add(tray);

threejsAPI.loadOBJ("/src/assets/models/shyvana.obj", (obj) => {
  let model = obj.children[0];
  model.scale.set(0.02, 0.02, 0.02);
  model.position.set(0.5, 0, 0);
  group.add(model);
});

group.position.set(-4, 0, -10);

export default group;
