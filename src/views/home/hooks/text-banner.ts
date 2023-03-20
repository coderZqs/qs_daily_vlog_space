import * as THREE from "three";
const { Group } = THREE;
import THREEAPI from "@/threejs/index";
let timer = null;
const group = new Group();

/**
 * 初始化文本方法
 * @param text
 * @returns
 */

const initText = async (text) => {
  const textGeometry = await THREEAPI.initTextGeometry(text, {
    size: 0.5,
    height: 0.1,
  });

  const textMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  const textSize = THREEAPI.calcObject3DSize(textMesh);
  textMesh.position.set(-textSize.width / 2, 0, 0);

  return textMesh;
};
const init = async () => {
  group.add(await initText("HEllo！"));
  group.add(await initText("我叫青顺"));
  group.add(await initText("是一名前端工程师"));
  group.add(await initText("这是我的个人空间"));

  let time = 0;
  let index = 0;
  let isAdd = true;
  const speed = 0.03;

  return new Promise((resolve, reject) => {
    timer = setInterval(() => {
      isAdd ? (time += speed) : (time -= speed);
      if (time >= 1) {
        isAdd = false;
      }

      if (time <= 0) {
        isAdd = true;

        if (index >= group.children.length - 1) {
          clearInterval(timer);
          resolve(Symbol("STOP"));
        } else {
          index += 1;
        }
      }

      group.children[index].material.opacity = time;
    }, 30);
  });
};

export default {
  init,
  group,
};
