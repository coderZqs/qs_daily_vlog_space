<template>
  <div id="container"></div>
</template>

<script setup>
import * as THREE from "three";
import THREEBSPConstructor from "three-js-csg";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let ThreeBSP = THREEBSPConstructor(THREE);
let mouse = new THREE.Vector2();
let door = null;

var raycaster = new THREE.Raycaster();

const houseSizeConfig = {
  h: 1500,
  l: 4000,
  w: 3000,
  wallDeep: 100,
};

let doorSizeConfig = {
  width: 600,
  height: 1000,
};

let isMouseOverDoor = false;

const generateToilet = () => {
  let l = 1000;

  let wallTexture = generateTexture("/src/assets/image/wall.png", 5);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(50, houseSizeConfig.h, houseSizeConfig.w),
    new THREE.MeshLambertMaterial({ map: wallTexture })
  );

  wall.position.x = -(houseSizeConfig.l / 2) + 900;
  wall.position.y = houseSizeConfig.h / 2;

  scene.add(wall);
};

/**
 * 生成贴图
 */

const generateTexture = (url, repeatSize) => {
  let loader = new THREE.TextureLoader();
  const texture = loader.load(url);
  // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // uv两个方向纹理重复数量
  texture.repeat.set(repeatSize, repeatSize);

  return texture;
};

/**
 * 生成柜子
 */

const generateWardrobe = () => {
  const wardrobeSizeConfig = {
    h: 900,
    l: 300,
    w: 700,
  };

  const positionConfig = {
    x: -(houseSizeConfig.l / 2) + wardrobeSizeConfig.l / 2 + 900,
    y: wardrobeSizeConfig.h / 2,
    z: -(houseSizeConfig.w - wardrobeSizeConfig.w) / 2,
  };

  let wardrobeGroup = new THREE.Group();

  const wardrobeFront = new THREE.Mesh(
    new THREE.BoxGeometry(
      wardrobeSizeConfig.l,
      wardrobeSizeConfig.h,
      wardrobeSizeConfig.w
    ),
    new THREE.MeshLambertMaterial({ color: 0xaed6f1 })
  );

  wardrobeGroup.add(wardrobeFront);
  wardrobeGroup.position.set(
    positionConfig.x,
    positionConfig.y,
    positionConfig.z
  );

  scene.add(wardrobeGroup);
};

/**
 * 生成床
 */

const generateBed = () => {
  const frontSizeConfig = {
    h: 400,
    l: 1000,
    w: 2000,
  };

  const position = {
    x: 0,
    y: frontSizeConfig.h / 2,
    z: -(houseSizeConfig.w - frontSizeConfig.w) / 2,
  };

  const sideSizeConfig = {
    l: 300,
    h: 400,
    w: 300,
  };

  const sidePositionConfig = {
    x: frontSizeConfig.l / 2 + sideSizeConfig.l / 2,
    y: 0,
    z: -(frontSizeConfig.w - sideSizeConfig.w) / 2,
  };

  let bedGroup = new THREE.Group();

  const bedFront = new THREE.Mesh(
    new THREE.BoxGeometry(
      frontSizeConfig.l,
      frontSizeConfig.h,
      frontSizeConfig.w
    ),
    new THREE.MeshLambertMaterial({ color: 0xaed6f1 })
  );

  bedGroup.add(bedFront);
  bedGroup.position.set(position.x, position.y, position.z);

  const bedSide = new THREE.Mesh(
    new THREE.BoxGeometry(sideSizeConfig.l, sideSizeConfig.h, sideSizeConfig.w),
    new THREE.MeshLambertMaterial({ color: 0x000000 })
  );

  bedSide.position.set(
    sidePositionConfig.x,
    sidePositionConfig.y,
    sidePositionConfig.z
  );

  bedGroup.add(bedSide);
  scene.add(bedGroup);
};

/**
 * 生成门
 */

const generateDoor = () => {
  const doorTexture = generateTexture("/src/assets/image/door.png", 5);

  door = new THREE.Mesh(
    new THREE.BoxGeometry(30, doorSizeConfig.height, 600),
    new THREE.MeshPhongMaterial({
      map: doorTexture,
    })
  );

  door.position.set(houseSizeConfig.l / 2, 500, houseSizeConfig.w / 2 - 500);
  scene.add(door);
};

/**
 * 生成外墙
 */

const generateOutWall = () => {
  const positionConfig = {
    x: 0,
    y: 0,
    z: 0,
  };

  const outBox = new THREE.Mesh(
    new THREE.BoxGeometry(
      houseSizeConfig.l,
      houseSizeConfig.h,
      houseSizeConfig.w
    ),
    new THREE.MeshLambertMaterial({
      color: 0xaed6f1,
    })
  );

  outBox.position.set(
    positionConfig.x,
    houseSizeConfig.h / 2,
    positionConfig.z
  );

  const innerBox = new THREE.Mesh(
    new THREE.BoxGeometry(
      houseSizeConfig.l - houseSizeConfig.wallDeep,
      houseSizeConfig.h,
      houseSizeConfig.w - houseSizeConfig.wallDeep
    ),
    new THREE.MeshLambertMaterial()
  );

  innerBox.position.set(
    positionConfig.x,
    houseSizeConfig.h / 2,
    positionConfig.z
  );

  const emptyBox = new THREE.Mesh(
    new THREE.BoxGeometry(300, doorSizeConfig.height, doorSizeConfig.width),
    material
  );
  emptyBox.position.set(
    houseSizeConfig.l / 2,
    500,
    houseSizeConfig.w / 2 - 500
  );

  const outBoxBSP = new ThreeBSP(outBox);
  const innerBoxBSP = new ThreeBSP(innerBox);
  const emptyBoxBSP = new ThreeBSP(emptyBox);
  let wallBSP = outBoxBSP.subtract(innerBoxBSP);
  let resultBSP = wallBSP.subtract(emptyBoxBSP);
  var result = resultBSP.toMesh();
  result.geometry.computeFaceNormals();
  result.geometry.computeVertexNormals();

  let wallTexture = generateTexture("/src/assets/image/wall.png", 5);

  var material = new THREE.MeshPhongMaterial({
    map: wallTexture,
  });
  result.material = material;
  scene.add(result);
};

/**
 * 生成房屋内部地板
 */

let generateFloor = () => {
  const h = 20;
  let floorTexture = generateTexture("/src/assets/image/wall.png", 5);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(houseSizeConfig.l, houseSizeConfig.w, h),
    new THREE.MeshPhongMaterial({
      map: floorTexture,
    })
  );

  floor.rotation.x = Math.PI / 2;
  floor.position.y = h / 2;

  scene.add(floor);
};

/**
 * 初始化项目
 */

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0xffffff, 1, 1000);
renderer.setClearColor(new THREE.Color(0xcccccc));
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5,
  2000000
);

generateOutWall();
generateFloor();
generateBed();
generateWardrobe();
generateToilet();
generateDoor();

let planeTexture = generateTexture("/src/assets/image/plane.jpg", 100);
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200000, 200000),
  new THREE.MeshPhongMaterial({ color: 0xe5e8e8, map: planeTexture })
);

plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);

/* const directionLight = new THREE.DirectionalLight();
directionLight.position.set(-1000, 1000, -1000);
scene.add(directionLight); */

const light = new THREE.AmbientLight();

light.position.set(-500, 500, 500);
scene.add(light);

camera.position.set(6000, 2000, 0);
camera.lookAt(scene.position);

const init = () => {
  renderer.render(scene, camera);
  let dom = document.querySelector("#container");
  dom.appendChild(renderer.domElement);
};

let animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  raycaster.setFromCamera(mouse, camera);

  var intersectObject = raycaster.intersectObjects([door]);
  isMouseOverDoor = Boolean(intersectObject.length);
};

onMounted(() => {
  init();
  animate();

  window.onmousemove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  let i = 0;
  var axis = new THREE.Vector3(1, 0, 0);

  const doorAni = () => {
    let aniId = requestAnimationFrame(doorAni);
    i += 0.01;

    door.rotateOnAxis(axis, i);
  };

  document.onclick = () => {
    if (isMouseOverDoor) {
      doorAni();
    }
  };
});
</script>

<style></style>
