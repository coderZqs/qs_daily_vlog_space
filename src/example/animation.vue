<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      let renderer = new THREE.WebGLRenderer();
      let ratios = window.innerWidth / window.innerHeight;
      let camera = new THREE.PerspectiveCamera(45, ratios, 0.5, 20000);
      let scene = new THREE.Scene();
      renderer.setClearColor(0xa75b4a);
      renderer.setSize(window.innerWidth, window.innerHeight);
      let animationObjectGroup = new THREE.AnimationObjectGroup();

      for (let i = 0; i < 2; i++) {
        let mesh = new THREE.Mesh(
          new THREE.BoxGeometry(50, 50, 50),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
          })
        );

        mesh.position.set(i * 100, 0, 0);

        scene.add(mesh);
        animationObjectGroup.add(mesh);
      }

      const xAxis = new THREE.Vector3(1, 0, 0);
      /*       const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0); */
      /*       const qFinial = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI); */
      const opacityTrack = new THREE.NumberKeyframeTrack(
        ".material.opacity",
        [0, 1],
        [0, 1]
      );
      const colorKF = new THREE.ColorKeyframeTrack(
        ".material.color",
        [0, 1],
        [1, 0, 0, 0, 1, 0],
        THREE.InterpolateDiscrete
      );
      /*       const rotationTrack = new THREE.QuaternionKeyframeTrack(
        ".quaternion",
        [0, 1, 2],
        [
          qInitial.x,
          qInitial.y,
          qInitial.z,
          qInitial.w,
          qFinial.x,
          qFinial.y,
          qFinial.z,
          qFinial.w,
          qInitial.x,
          qInitial.y,
          qInitial.z,
          qInitial.w,
        ]
      ); */

      let duration = 2;
      let clip = new THREE.AnimationClip("default", duration, [
        /*    rotationTrack, */
        colorKF,
        opacityTrack,
      ]);
      let mixer = new THREE.AnimationMixer(animationObjectGroup);
      mixer.addEventListener("finished", function (e) {
        animationObjectGroup._objects.forEach((object) => {
          object.material.transparent = false;
        });
      });
      let AnimationAction = mixer.clipAction(clip);
      AnimationAction.setLoop(THREE.LoopOnce);
      AnimationAction.play();

      scene.add(camera);
      camera.position.set(200, 300, 200);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);

      let dom = document.querySelector("#container");
      dom.appendChild(renderer.domElement);
      const clock = new THREE.Clock();

      setInterval(() => {
        const delta = clock.getDelta();
        mixer.update(delta);
        renderer.render(scene, camera);
      }, 30);
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style></style>
