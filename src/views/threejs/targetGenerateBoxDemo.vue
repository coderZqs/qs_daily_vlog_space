<!-- <template>
  <div class="comp-scene">
    <div class="screen-content">当前选中物体</div>
  </div>
</template>

<script lang="ts">
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const planeImage = require("../../assets/texture/plane.jpg");
import { defineComponent, reactive, onMounted } from "vue";
export default defineComponent({
  name: "Scene",
  setup() {
    onMounted(() => {
      Scene.init();
      let selectObj = {};

      window.addEventListener("mousemove", (e) => {
        let selectObjList = getSelectMesh(e);
        if (selectObjList.length && selectObjList[0].object.name === "mesh") {
          if (Object.keys(selectObj).length) {
            // helper.setColor((selectObj as any).object, "red");
          }

          selectObj = selectObjList[0];
        } else {
          if (Object.keys(selectObj).length) {
            // helper.setColor((selectObj as any).object, "#FFB6C1");
          }
          selectObj = {};
        }
      });

      window.addEventListener("mousedown", (e) => {
        let selectObjList = getSelectMesh(e);
        if (selectObjList.length && selectObjList[0].object.name === "mesh") {
          let position = selectObjList[0].face.normal;
          let obj = selectObjList[0].object;
          let currentPoi = Object.assign({}, obj.position);
          Object.keys(position).forEach((e) => {
            if (position[e] !== 0) {
              currentPoi[e] += Number(position[e]) * Mesh.size;
            }
          });

          Mesh.create(Mesh.getRandomColor(), [
            currentPoi.x,
            currentPoi.y,
            currentPoi.z,
          ]);
        }
      });

      window.addEventListener;
    });

    const getSelectMesh = (event: MouseEvent) => {
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (-event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, Scene.camera);
      // 获取raycaster直线和所有模型相交的数组集合
      return raycaster.intersectObjects((Scene.scene as any).children);
    };

    const helper = {
      setColor: (obj: any, color: any) => {
        obj.material.color = new THREE.Color(color);
      },
    };

    const Person = reactive({
      init: () => {
        let personGeometry = new THREE.BoxGeometry(100, 100, 100);

        let personMaterial = new THREE.MeshBasicMaterial({
          color: "#FFB6C1",
        });

        let person = new THREE.Mesh(personGeometry, personMaterial);
        person.name = "person";

        window.addEventListener("keydown", (e) => {
          var key = {
            W: 87,
            S: 83,
            A: 65,
            D: 68,
          };
          let keycode = e.keyCode;

          switch (keycode) {
            case key.W:
              person.position.z += 30;
              break;
            case key.S:
              person.position.z -= 30;
              break;
            case key.A:
              person.position.x += 30;
              break;
            case key.D:
              person.position.x -= 30;
              break;
          }
        });

        person.position.set(50, 50, 50);

        return person;
      },
    });

    const Mesh = reactive({
      size: 100,
      getRandomColor() {
        return Math.random() * 0xffffff;
      },
      create(color: any, position: any) {
        let boxGeometry = new THREE.BoxGeometry(
          this.size,
          this.size,
          this.size
        );

        let boxMaterial = new THREE.MeshBasicMaterial({
          color: color || "#FFB6C1",
        });

        let box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.name = "mesh";

        box.position.set(position[0] || 0, position[1] || 0, position[2] || 0);
        (Scene as any).scene.add(box);
      },
    });

    let onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      let mouse = { x: 0, y: 0 };
      var raycaster = new THREE.Raycaster();

      mouse.x = (event.clientX / Scene.width) * 2 - 1;
      mouse.y = -(event.clientY / Scene.height) * 2 + 1;

      raycaster.setFromCamera(mouse, Scene.camera);

      var intersects = raycaster.intersectObjects(
        (Scene.scene as any).children
      );
    };

    const Scene = reactive({
      width: window.innerWidth,
      height: window.innerHeight,
      el: document.querySelector(".comp-scene"),
      scene: null,
      camera: null,
      renderer: null,
      init() {
        var scene = new THREE.Scene();
        this.initPlane();

        // 添加小人

        let person = Person.init();
        scene.add(person);

        // 灯照
        var point = new THREE.PointLight(0xffffff);
        point.position.set(400, 600, 300);
        scene.add(point);
        var ambient = new THREE.AmbientLight(0x444444);
        scene.add(ambient);

        // 相机
        let camera = this.initCamera();

        camera.position.set(
          person.position.x,
          person.position.y,
          person.position.z - 500
        );

        camera.lookAt(person.position);

        // 坐标轴

        let axis = this.initAxisHelper();
        console.log(axis);
        scene.add(axis);

        // 渲染器
        let renderer = this.initRenderer();
        var controls = new OrbitControls(camera, renderer.domElement);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.camera = camera;
        this.scene = scene;

        let animate = () => {
          controls.update();

          /*    camera.position.set(
              person.position.x,
              person.position.y + 100,
              person.position.z - 500
            ); */
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        animate();
      },

      initCamera() {
        var camera = new THREE.PerspectiveCamera(
          45,
          this.width / this.height,
          0.1,
          200000
        );

        return camera;
      },

      initAxisHelper() {
        // 坐标轴
        return new THREE.AxesHelper(10000);
      },

      initPlane() {
        // 地面
        var planeGeometry = new THREE.PlaneGeometry(20000, 20000);
        new THREE.TextureLoader().load(planeImage, function (texture: any) {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // uv两个方向纹理重复数量
          texture.repeat.set(100, 100);
          var planeMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            map: texture,
          });
          let plane = new THREE.Mesh(planeGeometry, planeMaterial);
          plane.rotation.x = Math.PI / 2;

          (Scene.scene as any).add(plane);
        });
      },

      initRenderer() {
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height);
        renderer.setClearColor(0xb9d3ff, 1);

        (document.querySelector(".comp-scene") as any).appendChild(
          renderer.domElement
        );

        return renderer;
      },
    });
  },
});
</script>

<style lang="scss" scoped>
.comp-scene {
  position: relative;
  .screen-content {
    position: absolute;
    padding: 10px;
    color: white;
  }
}
</style>
 -->
