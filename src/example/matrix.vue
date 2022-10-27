<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      /**
       * 创建场景对象Scene
       */
      var scene = new THREE.Scene();
      /**
       * 创建网格模型
       */
      var box_geometry = new THREE.BoxGeometry(32, 32, 32);
      var sphere_geometry = new THREE.SphereGeometry(10, 32, 32);
      var cylinder_geometry = new THREE.CylinderGeometry(8, 8, 32);

      var material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0.9, 0.55, 0.4),
      });
      var box = new THREE.Mesh(box_geometry, material);
      var sphere = new THREE.Mesh(sphere_geometry, material);
      var cylinder = new THREE.Mesh(cylinder_geometry, material);
      scene.add(box);
      scene.add(sphere);
      // scene.add(cylinder);

      box.matrixAutoUpdate = false;
      sphere.matrixAutoUpdate = false;
      cylinder.matrixAutoUpdate = false;
      var sphere_matrix = new THREE.Matrix4().makeTranslation(0.0, 32.0, 0.0);
      sphere.applyMatrix(sphere_matrix);
      sphere_matrix.multiply(
        new THREE.Matrix4().makeRotationZ(-Math.PI * 0.25)
      );
      var cylinder_matrix = sphere_matrix.clone();
      cylinder_matrix.multiply(
        new THREE.Matrix4().makeTranslation(0.0, 10.0, 0.0)
      );
      cylinder.applyMatrix(cylinder_matrix);
      // cylinder.applyMatrix(cylinder_matrix);
      /**
       * 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
       * */
      var axisHelper = new THREE.AxisHelper(250);
      scene.add(axisHelper);
      /**
       * 光源设置
       */
      //点光源
      var point = new THREE.PointLight(0xffffff);
      // point.position.set(400, 200, 300); //点光源位置
      point.position.set(0, 0, 0); //点光源位置
      scene.add(point); //点光源添加到场景中
      //环境光
      var ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
      /**
       * 相机设置
       */
      var width = window.innerWidth; //窗口宽度
      var height = window.innerHeight; //窗口高度
      var k = width / height; //窗口宽高比
      var s = 400; //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象
      var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      camera.position.set(100, 100, 400); //设置相机位置
      camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
      /**
       * 创建渲染器对象
       */
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height); //设置渲染区域尺寸
      renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
      //执行渲染操作   指定场景、相机作为参数
      renderer.render(scene, camera);

      // 例子：响应鼠标、键盘
      function render() {
        renderer.render(scene, camera); //执行渲染操作
      }
      render();
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style></style>
