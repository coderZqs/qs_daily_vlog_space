import * as THREE from "three";
import {
    Camera
} from "three";

const END = 500;

let points = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(30, 30, -20),
    new THREE.Vector3(60, 30, -20),
    new THREE.Vector3(90, 1, 0),
]

let CatmullRomCurve = new THREE.CatmullRomCurve3(points);

let TubeGeometry = new THREE.TubeGeometry(CatmullRomCurve)
let TubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    side: THREE.DoubleSide
    // wireframe: true
})

let channel = new THREE.Mesh(TubeGeometry, TubeMaterial)


export let getChannelPointPoi = (index) => {
    let pointPoiGroup = CatmullRomCurve.getPoints(END);
    return pointPoiGroup[index]
}


export default channel