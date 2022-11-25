<template>
  <canvas id="point" style="width: 300px; height: 300px"> </canvas>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const vertexShader = `
  // Vertex Shader
      precision mediump int;
      precision mediump float;
      
      attribute vec2 a_PointVertex;
      attribute vec3 a_PointColor;
      
      varying vec3 color;
      
      void main() {
        gl_Position = vec4(a_PointVertex, 0.0, 1.0);
        gl_PointSize = 2.0;
        color = a_PointColor;
      }
  `;

  const fragmentShader = `
      precision mediump int;
      precision mediump float;
      
      varying vec3 color;
      
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
  `;

  var pointCanvas = document.getElementById("point"); // 我们的纸
  var gl = pointCanvas.getContext("webgl", { preserveDrawingBuffer: true }); // 我们的笔
  // 生成 360 个点，来模拟一个圆
  var pointCount = 360;
  var pointData = [];
  var loop = 0;
  var alpha = 0; // 注意，这里的 α 单位是弧度，关于这个要温习一下初中数学
  var step = (2 * Math.PI) / pointCount; // 每一次增加的弧度 (1°)
  var x, y, _R, _G, _B;
  for (loop = 0; loop < pointCount; loop++) {
    alpha = loop * step;
    x = Math.cos(alpha);
    y = Math.sin(alpha);
    pointData.push(x);
    pointData.push(y);
    _R = Math.random(); // 随机一个
    _G = Math.random(); // 随机一个
    _B = Math.random(); // 随机一个
    pointData.push(_R);
    pointData.push(_G);
    pointData.push(_B);
  }
  //
  var pointArray = new Float32Array(pointData);
  var buffer_id;
  buffer_id = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
  gl.bufferData(gl.ARRAY_BUFFER, pointArray, gl.STATIC_DRAW);
  var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, vertexShader);
  gl.compileShader(vertex_shader);

  var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment_shader, fragmentShader);
  gl.compileShader(fragment_shader);
  //
  var program = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  gl.useProgram(program);
  //
  var a_PointVertex = gl.getAttribLocation(program, "a_PointVertex");
  console.log(a_PointVertex);
  gl.vertexAttribPointer(a_PointVertex, 2, gl.FLOAT, false, 5 * 4, 0);
  gl.enableVertexAttribArray(a_PointVertex);
  var a_PointColor = gl.getAttribLocation(program, "a_PointColor");
  gl.vertexAttribPointer(a_PointColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
  gl.enableVertexAttribArray(a_PointColor);
  //
  gl.drawArrays(gl.POINTS, 0, pointCount);
});
</script>

<style></style>
