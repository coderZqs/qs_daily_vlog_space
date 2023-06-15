<template>
    <div class="canvas"></div>
</template>
  
<script setup lang="ts">
import { onMounted } from "vue";
import T from "@/threejs/index";
import * as THREE from "three";
import channel, { getChannelPointPoi } from "@/components/project/Channel/index"

let renderer: THREE.WebGLRenderer, camera, scene, light, time = 0, controls;

onMounted(() => {
    camera = T.initCamera();
    renderer = T.initRenderer();
    scene = new THREE.Scene();

    light = new THREE.AmbientLight(0xFFFFFF);
    scene.add(light)

    let element = document.querySelector(".canvas") as HTMLElement;
    T.addAdaptionScreen(renderer, camera);
    T.appendCanvasToElement(element, renderer.domElement);
    // controls = T.addOrbitControls(camera, renderer.domElement);

    scene.add(channel);
    channel.position.set(0, 0, 0)
    camera.position.set(0, 0, 10)

    animate();
    generateKunKun();
});


let generateKunKun = () => {
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }))
    scene.add(plane)

    plane.position.set(70, 8, 0)
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = -Math.PI / 2;
    plane.rotation.y = -Math.PI / 4;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/src/assets/image/ziliao.png", texture => {
        plane.material.map = texture;
    });
}

let animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    time += 1;

    let position = getChannelPointPoi(time);
    let leaderPosition = getChannelPointPoi(time + 10);

    if (leaderPosition) {
        camera.position.copy(position);
        camera.lookAt(leaderPosition);
        // controls.target = leaderPosition;
    } else {
    }
};
</script>
  
<style scoped></style>
  