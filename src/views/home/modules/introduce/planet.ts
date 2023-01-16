import * as THREE from "three"

const earthTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthmap2k.jpg"
);
// 灰階高度貼圖
const displacementTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/editedBump.jpg"
);
const roughtnessTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2kReversedLighten.png"
);
const speculatMapTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2k.jpg"
);
const bumpTexture = new THREE.TextureLoader().load(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthbump2k.jpg"
);

let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 300, 300),
    new THREE.MeshStandardMaterial({
        map: earthTexture,
        side: THREE.DoubleSide,
        roughnessMap: roughtnessTexture,
        roughness: 0.9,
        metalnessMap: speculatMapTexture,
        metalness: 1,
        displacementMap: displacementTexture,
        displacementScale: 0.1,
        bumpMap: bumpTexture,
        bumpScale: 0.5,
    })
);

export default sphere