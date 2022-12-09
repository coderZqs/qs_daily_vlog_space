<template>
  <canvas id="canvas"></canvas>
</template>

<script setup>
import { onMounted } from "vue";

let vsh = `
  attribute vec4 position;
  varying vec2 pox;

  void main() {
    gl_Position = position;
    gl_Position.x = gl_Position.x - 1.0;
    gl_Position.y = gl_Position.y - 1.0;
    gl_PointSize = 4.0;
    pox = gl_Position.xy;
  }
`;

let fsh = `
  precision mediump float;
  uniform vec2 u_resolution;

  float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float rnd = random( st );
    gl_FragColor = vec4(vec3(rnd),1.0);
  }
`;

onMounted(() => {
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");

  if (gl) {
    let createShader = (type, source) => {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      console.log(success);
      return shader;
    };

    let createProgram = () => {
      let vertexShader = createShader(gl.VERTEX_SHADER, vsh);
      let fragmentShader = createShader(gl.FRAGMENT_SHADER, fsh);

      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);

      let success = gl.getProgramParameter(program, gl.LINK_STATUS);
      console.log(success);
      return program;
    };

    let program = createProgram();

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    for (let key = 0; key < 100; key++) {
      for (let j = 0; j < 100; j++) {
        let array = [(2 / 100) * key, (2 / 100) * j];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);

        let positionAttributeLocation = gl.getAttribLocation(
          program,
          "position"
        );

        const resolutionLocation = gl.getUniformLocation(
          program,
          "u_resolution"
        );
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(
          positionAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );

        gl.drawArrays(gl.POINTS, 0, 1);
      }
    }
  }
});
</script>

<style></style>
