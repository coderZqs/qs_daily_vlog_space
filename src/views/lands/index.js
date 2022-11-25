import * as THREE from "three";
import crystalBall from "./components/studio";
let landGroup = new THREE.Group();
import threejsApi from "@/threejs/index";

let light = new THREE.PointLight(0xefd49e, 0.16);
// light.position.set(0, 25, 0);
landGroup.add(light);

let spotLight = new THREE.SpotLight(0x2879ff);
spotLight.position.set(0, 25, 0);
landGroup.add(spotLight);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 5;

/* let generateLightModel = (size = 1) => {
  for (let j = 0; j <= size; j += 0.05) {
    let position = [];
    let circleRadius = Math.sin((j / size) * Math.PI);
    position[1] = j;

    for (let i = 0; i <= circleRadius; i += 0.05) {
      if (circleRadius !== 0) {
        position[0] = Math.cos((i / circleRadius) * Math.PI * 2);
        position[2] = Math.sin((i / circleRadius) * Math.PI * 2);
        array = array.concat(position);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  let vertices = new Float32Array(array);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
  return new THREE.Points(geometry, material);
};
 */

let generateLightModel = () => {
  var sphereGeometry = new THREE.SphereGeometry(0.5, 35, 35); // 球
  var sphereMaterial = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 0.05,
    lights: true,
  });
  var sphere = new THREE.Points(sphereGeometry, sphereMaterial);

  return sphere;
};

let lightModel = generateLightModel();
lightModel.position.set(0, 5, 0);
lightModel.castShadow = true;
lightModel.receiveShadow = true;
landGroup.add(lightModel);

spotLight.position.set(0, 6, 0);

// 球
let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(15, 64, 64),
  new THREE.MeshPhongMaterial({
    color: 0xccccc,
    side: THREE.DoubleSide,
  })
);

spotLight.target = sphere;

// 沙发
threejsApi.loadFBX("/src/assets/models/sofa.fbx", (object) => {
  object.children.forEach((item) => {
    if (item.type === "Mesh" && item.name === "GREEN_COUCH") {
      landGroup.add(item);
      item.scale.set(0.4, 0.4, 0.4);
      item.position.set(-14, 0, 0);
      item.rotation.z = -Math.PI;
    }
  });
});

landGroup.add(sphere);
landGroup.add(crystalBall);

// 盾牌

threejsApi.loadOBJ("/src/assets/models/dunpai/object.obj", (object) => {
  let shield = object.children[0];

  shield.scale.set(0.02, 0.02, 0.02);
  shield.position.set(-14.5, 2, 0);
  shield.rotation.y = Math.PI / 2;
  landGroup.add(shield);

  threejsApi.addTextureLoader(
    "/src/assets/models/dunpai/texture.dds",
    (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      shield.material.map = texture;
      shield.material.needsUpdate = true;
    }
  );
});

// 地面
let plane = new THREE.Mesh(
  new THREE.CircleGeometry(15, 64, 64),
  new THREE.MeshPhongMaterial({
    color: 0xccccccc,
  })
);

plane.receiveShadow = true;

threejsApi.addTextureLoader("/src/assets/image/plane1.png", (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  plane.material.map = texture;
  plane.material.needsUpdate = true;
});

plane.rotation.x = -Math.PI / 2;

landGroup.add(plane);

export default landGroup;
