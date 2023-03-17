import * as THREE from "three";
import crystalBall from "./components/studio";
let landGroup = new THREE.Group();
import threejsApi from "@/threejs/index";
import { InterpolateDiscrete } from "three";
/* import lefulanModel from "./components/lefulan";
import shyvanaModel from "./components/shyvana"; */

let light = new THREE.PointLight(0xefd49e, 0.16);
landGroup.add(light);

let spotLight = new THREE.SpotLight(0xd6b027);
spotLight.position.set(0, 105, 0);
landGroup.add(spotLight);
spotLight.castShadow = true;
/* spotLight.angle = Math.PI / 5; */

let initMoon = async () => {
  return new Promise((resolve) => {
    threejsApi.addTextureLoader(
      "/src/assets/image/planet/moom/moom.png",
      (texture) => {
        var sphereGeometry = new THREE.SphereGeometry(20, 35, 35); // 球
        var sphereMaterial = new THREE.MeshToonMaterial({
          color: 0xffffff,
          lights: true,
          map: texture,
        });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        resolve(sphere);
      }
    );
  });
};

let moon = await initMoon();
moon.rotation.x = Math.PI / -3;
moon.position.set(30, 200, 0);
landGroup.add(moon);

// 树
threejsApi.loadFBX("/src/assets/models/tree.fbx", (object) => {
  for (let i = 1; i < 20; i++) {
    let model = object.clone();
    landGroup.add(model);
    model.scale.set(2.0, 2.0, 2.0);
    model.position.set(-14, 1, -30 + i * 3);
  }
});

// 地面
let plane = new THREE.Mesh(
  new THREE.PlaneGeometry(64, 64, 64),
  new THREE.MeshPhongMaterial({
    color: 0xccccccc,
  })
);

// 字

let initIntroduceWord = async (text) => {
  let textGeometry = await threejsApi.initTextGeometry(text, {
    size: 1,
    height: 0.1,
  });

  var textMaterial = new THREE.MeshNormalMaterial({
    color: 0xcccccc,
  });
  var textMesh = new THREE.Mesh(textGeometry, textMaterial);

  return textMesh;
};

let introduceWord = await initIntroduceWord("欢迎来到青顺的 3D 空间");
landGroup.add(introduceWord);
introduceWord.position.set(-16, 9, 0);
introduceWord.rotation.y = Math.PI / 2;

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
