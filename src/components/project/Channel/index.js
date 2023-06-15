import * as THREE from "three";
import threejsAPI from "@/threejs/index";

const END = 500;

let points = [
  new THREE.Vector3(0, 5, 15),
  new THREE.Vector3(10, 12, -2),
  new THREE.Vector3(20, 0, 1),
  new THREE.Vector3(20, 50, 2),
  new THREE.Vector3(58, 20, 0),
  new THREE.Vector3(60, 18, 0),
];

let CatmullRomCurve = new THREE.CatmullRomCurve3(points);


let TubeGeometry = new THREE.TubeGeometry(CatmullRomCurve, 100, 1, 20);
let TubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x86e1fd,
  side: THREE.DoubleSide,
  closed: true,
  // wireframe: true
});

let channel = new THREE.Mesh(TubeGeometry, TubeMaterial);

threejsAPI.addTextureLoader("/src/assets/image/guidao1.png", (texture) => {
  channel.material.map = texture;
  channel.material.needsUpdate = true;
});

export let getChannelPointPoi = (index) => {
  let pointPoiGroup = CatmullRomCurve.getPoints(END);
  return pointPoiGroup[index];
};

channel.position.set(-45, -20, 0)

export default channel;