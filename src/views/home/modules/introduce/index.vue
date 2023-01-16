<template>
  <div class="module-introduce">
    <div class="introduce-container" v-if="isShowIntroduce">
      <div v-for="(item, key) in introduceGroup" :key="key">
        <span class="introduce-word">{{ item.t }}</span>

        <!--         <img
          v-if="item.category === 'music'"
          style="width: 300px"
          src="../introduce/image/guiji.jpg"
          alt=""
        /> -->
        <MusicComp v-if="item.category === 'music'" />
      </div>
    </div>

    <div class="menu">
      <div class="menu-item" @click="enter3DScene">进入 3D 展馆</div>
      <div class="menu-item">进入 2D 展馆</div>
    </div>

    <div class="control-button" v-if="isShowIntroduce">按 Space 跳过</div>
    <div class="enter-by-tube"></div>
  </div>
</template>

<script setup>
import * as THREE from "three";
let { Scene, AmbientLight } = THREE;
import THREEAPI from "@/threejs/index";
import { onMounted, ref } from "vue";
import textBanner from "./text-banner.ts";
import planet from "./planet.ts";
import MusicComp from "./music-comp.vue";
import { useRouter } from "vue-router";

let router = useRouter();

let introduceGroup = ref([]);
let timer = null;

let introduceControl = async () => {
  let content = [
    { t: "嘿", watting: 2000 },
    { t: "恭喜你发现了神秘的新大陆", watting: 2000 },
    { t: "这里是一个程序员的个人网站", watting: 2000 },
    { t: "他叫青顺", watting: 2000 },
    { t: "注意是青不是清", watting: 2000 },
    { t: "他的目标是成为一名高级前端工程师", watting: 2000 },
    { t: "最喜欢的歌是《轨迹》", watting: 2000, category: "music" },
    { t: "最喜欢的歌手是《五月天》", watting: 2000 },
    { t: "就像很多人一样", watting: 2000 },
    { t: "他常常有很多奇怪的想法", watting: 2000 },
    { t: "也常常会迷茫", watting: 2000 },
    { t: "他是一个有趣的人", watting: 2000 },
    { t: "好吧，至少他是这么觉得的", watting: 2000 },
    { t: "他会把一些有趣的事情记录在这里", watting: 2000 },
    { t: "也会把坏情绪丢在这里", watting: 2000 },
    { t: "他总是随着心情记录，不按时不保量", watting: 2000 },
    { t: "没办法，谁叫这个网站是他创建的呢（得意）", watting: 2000 },
  ];

  let isShowIntroduce = ref(false);

  /*   let timer = null; */
  let index = 0; // 大对象的索引
  let contentIndex = 0;

  let typpingAnimate = (target, pointer, speed) => {
    let key = 0; //item的索引
    return new Promise((resolve) => {
      timer = setInterval(async () => {
        if (pointer) {
          if (!target[index]) {
            target[index] = {
              t: "",
              watting: pointer.watting,
              category: pointer.category,
            };
          }

          if (pointer.t.length > key - 1) {
            target[index] = {
              ...pointer,
              t: pointer.t.substr(0, key),
            };
            key += 1;
          } else {
            clearTimeout(timer);
            resolve();
          }
        }
        // 如果
      }, speed);
    });
  };

  const loading = async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, time);
    });
  };

  /*   for (let i = 0; i < content.length; i++) {
    // if (index !== 0 && index % 3 == 0) {
    //   await loading(3000);
    //   introduceGroup.value = [];
    //   index = 0;
    // }
    await loading(content[i].watting);
    introduceGroup.value = [];
    await typpingAnimate(introduceGroup.value, content[i].t, 50);
    // index++;
  } */

  window.addEventListener("keydown", async (e) => {
    if (e.code === "Space") {
      if (content.length <= contentIndex) {
        return;
      }

      clearInterval(timer);
      introduceGroup.value = [];
      typpingAnimate(introduceGroup.value, content[contentIndex], 50);
      contentIndex++;
    }
  });
};

const enter3DScene = () => {
  // 每走一步会消耗 25 的时间
  // 总共会走 200 步
  // 100 / 200

  let scene = document.querySelector(".module-introduce");
  let countDown = 1000;
  let circleNum = 100;
  let s = 25;

  let timer = setInterval(() => {
    circleNum -= 100 / (countDown / s);
    scene.style.clipPath = "circle(" + circleNum + "%)";

    if (circleNum < 0) {
      clearInterval(timer);
      circleNum = 0;
      router.push("/3d-land");
    }
  }, s);
};

let scene, camera, renderer, light;

scene = new Scene();
camera = THREEAPI.initCamera();
renderer = THREEAPI.initRenderer();
scene.add(camera);

camera.position.set(0, 0, 10);

let initLight = () => {
  light = new AmbientLight(0xffffff, 0.5);
  scene.add(light);

  let pointLight = new THREE.PointLight(0xfffff);
  scene.add(pointLight);
  pointLight.position.set(-10, 10, 10);

  let directLight = new THREE.DirectionalLight(0xffffff);
  scene.add(directLight);
  directLight.add(0, 0, 10);
};

initLight();

let init = async () => {
  planet.position.z = -100;
  // THREEAPI.addAdaptionScreen(renderer, camera);
  let dom = document.querySelector(".module-introduce");
  THREEAPI.appendCanvasToElement(dom, renderer.domElement);
  scene.add(textBanner.group);
  textBanner.group.position.x = -2;

  scene.add(planet);
  planet.position.x = 3.5;
  // planet.position.y = 1;
  /*   await textBanner.init();
  textBanner.group.remove(); */
};

let animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (planet && planet.position.z < 6) {
    planet.position.z += 1;
  }

  // planet.rotation.x += 0.001;
  planet.rotation.y += 0.003;
  // planet.rotation.z += 0.002;
};

onMounted(() => {
  init();
  animate();

  introduceControl();
});
</script>

<style lang="scss" scoped>
.module-introduce {
  animation: hidden 5s;
}

.introduce-container {
  position: absolute;
  top: 150px;
  z-index: 999;
  color: white;
  margin-left: 240px;

  div {
    font-size: 30px;
    margin-bottom: 50px;
    letter-spacing: 3px;
    position: relative;

    .introduce-word {
      position: relative;
      /*   &::after {
        content: "";
        width: 2px;
        height: 40px !important;
        display: inline-block;
        background: white;
        position: absolute;
        right: -10px;
        top: 0;
        transition: opacity 1s;
        animation: fade 0.5s infinite;
      } */
    }
  }
}

.menu {
  position: absolute;
  background: red;
  z-index: 9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.control-button {
  font-size: 15px;
  position: absolute;
  bottom: 20px;
  color: gray;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 20px;
  border-radius: 4px;
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>