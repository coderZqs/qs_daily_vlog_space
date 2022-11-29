import * as THREE from "three";
import threejsAPI from "@/threejs/index";

const END = 500;

let points = [
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(30, 30, -20),
  new THREE.Vector3(60, 30, -20),
  new THREE.Vector3(90, 1, 0),
];

let CatmullRomCurve = new THREE.CatmullRomCurve3(points);

let TubeGeometry = new THREE.TubeGeometry(CatmullRomCurve, 64, 1, 100);
let TubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x86e1fd,
  side: THREE.DoubleSide,
  // wireframe: true
});

let channel = new THREE.Mesh(TubeGeometry, TubeMaterial);

threejsAPI.addTextureLoader("/src/assets/image/tipe.jpg", (texture) => {
  channel.material.map = texture;
  channel.material.needsUpdate = true;
});

export let getChannelPointPoi = (index) => {
  let pointPoiGroup = CatmullRomCurve.getPoints(END);
  return pointPoiGroup[index];
};

export default channel;
