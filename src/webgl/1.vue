<template>
  <canvas></canvas>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  let canvas = document.querySelector("canvas");
  let gl = canvas.getContext("webgl");

  const vertexScript = `
    attribute vec4 position;

    void main() {
        gl_Position = position;
        gl_Position.x = gl_Position.x - 1.0;
        gl_Position.y = sin(gl_Position.x * 3.14 * 4.0);
        gl_PointSize = 1.0;
    }
  `;

  const fragmentScript = `
    precision mediump float;

    void main() {
     gl_FragColor = vec4(1, 0, 0.5, 1); 
    }
  `;

  let createShader = (type, source) => {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    console.log(success);
    if (success) {
      return shader;
    }
    return shader;
  };

  let createProgram = () => {
    let vertexShader = createShader(gl.VERTEX_SHADER, vertexScript);
    let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentScript);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  };
  // 创建项目
  let program = createProgram();
  // 提供着色器数据
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  for (let i = 0; i < 1000; i++) {
    let position = [i / 500, i / 500];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    let positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
});
</script>

<style></style>
