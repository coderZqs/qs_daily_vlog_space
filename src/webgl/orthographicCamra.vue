<template>
  <canvas id="canvas" width="500" height="500"></canvas>
  <input
    type="range"
    id="volume"
    name="volume"
    min="0"
    max="500"
    v-model="x"
    @input="change"
  />

  <input
    type="range"
    id="volume"
    name="volume"
    min="0"
    max="500"
    v-model="y"
    @input="change"
  />

  <input
    type="range"
    id="volume"
    name="volume"
    min="0"
    max="500"
    v-model="z"
    @input="change"
  />

  <input
    type="range"
    id="volume"
    name="volume"
    min="0"
    max="360"
    v-model="xRotate"
    @input="change"
  />

  {{ y }} {{ x }} {{ z }}
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";

let gl: Ref<Gl | null> = ref(null);
let y = ref(200);
let x = ref(200);
let z = ref(0);
let xRotate = ref(0);

onMounted(() => {
  gl.value = new Gl();
  gl.value.init();
});

const change = () => {
  gl.value.draw();
};

var m4 = {
  projection: function (width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  }
};

class Gl {
  public webgl: WebGLRenderingContext | null = null;
  public program: WebGLProgram | null = null;
  public canvas: HTMLCanvasElement | null = null;
  static vsString = `
         attribute vec4 a_position;
         attribute vec4 a_color;
         uniform mat4 u_matrix;
         varying vec4 v_color;

         void main(){
            gl_Position = u_matrix * a_position;
            v_color = a_color;
         }
    `;

  static fsString = `
      precision mediump float;
      varying vec4 v_color;
      void main(){
          gl_FragColor = v_color;
      }
    `;
  constructor() {}

  init() {
    this.initGl();
    this.initShader();
    this.draw();
  }

  initGl() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.webgl = canvas.getContext("webgl");
    this.webgl?.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    this.canvas = canvas;
  }

  initShader() {
    let gl = this.webgl;

    if (gl) {
      let vsShader = gl.createShader(gl.VERTEX_SHADER)!;
      let fsShader = gl.createShader(gl.FRAGMENT_SHADER)!;

      gl.shaderSource(vsShader, Gl.vsString);
      gl.shaderSource(fsShader, Gl.fsString);

      gl.compileShader(vsShader);
      gl.compileShader(fsShader);

      let program = gl.createProgram()!;
      gl.attachShader(program, vsShader);
      gl.attachShader(program, fsShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      this.program = program;
    }
  }
  initBuffer() {
    let gl = this.webgl;
    if (gl) {
      let aPosition = gl.getAttribLocation(this.program!, "a_position");
      let uMatrix = gl.getUniformLocation(this.program!, "u_matrix");
      let aColor = gl.getAttribLocation(this.program!, "a_color");

      let matrix = m4.projection(
        this.canvas.clientWidth,
        this.canvas.clientHeight,
        400
      );

      matrix = m4.translate(matrix, x.value, y.value, z.value);
      matrix = m4.xRotate(matrix, (Math.PI / 2 / 180) * xRotate.value);
      matrix = m4.yRotate(matrix, (Math.PI / 2 / 180) * 270);
      matrix = m4.zRotate(matrix, (Math.PI / 2 / 180) * 60);

      gl.uniformMatrix4fv(uMatrix, false, matrix);
      let positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column front
          0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

          // top rung front
          30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

          // middle rung front
          30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

          // left column back
          0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

          // top rung back
          30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30,
          30,

          // middle rung back
          30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90,
          30,

          // top
          0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

          // top rung right
          100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0,
          30,

          // under top rung
          30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30,
          0,

          // between top rung and middle
          30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

          // top of middle rung
          30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

          // right of middle rung
          67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

          // bottom of middle rung.
          30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

          // right of bottom
          30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150,
          30,

          // bottom
          0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150,
          0,

          // left side
          0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0
        ]),
        gl.STATIC_DRAW
      );

      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);

      let colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column front
          0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
          0.5, 0.5, 0.5, 0.5,

          // top rung front
          0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3,
          0.3, 0.3, 0.3, 0.3,

          // middle rung front
          0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
          0.4, 0.4, 0.4, 0.4,

          // left column back
          0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
          0.1, 0.1, 0.1, 0.1,

          // top rung back
          0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
          0.9, 0.9, 0.9, 0.9,

          // middle rung back
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2,

          // top
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48,

          // top rung right
          0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31,
          0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31,

          // under top rung
          0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5,
          0.6, 0.5, 0.6, 0.5,

          // between top rung and middle
          0.9, 0.1, 0.9, 0.1, 0.9, 0.1, 0.9, 0.1, 0.9, 0.1, 0.9, 0.1, 0.9, 0.1,
          0.9, 0.1, 0.9, 0.1,

          // top of middle rung
          0.8, 0.12, 0.8, 0.12, 0.8, 0.12, 0.8, 0.12, 0.8, 0.12, 0.8, 0.12, 0.8,
          0.12, 0.8, 0.12, 0.8, 0.12,

          // right of middle rung
          0.14, 0.85, 0.14, 0.85, 0.14, 0.85, 0.14, 0.85, 0.14, 0.85, 0.14,
          0.85, 0.14, 0.85, 0.14, 0.85, 0.14, 0.85,

          // bottom of middle rung.
          0.98, 0.97, 0.98, 0.97, 0.98, 0.97, 0.98, 0.97, 0.98, 0.97, 0.98,
          0.97, 0.98, 0.97, 0.98, 0.97, 0.98, 0.97,

          // right of bottom
          0.44, 0.84, 0.44, 0.84, 0.44, 0.84, 0.44, 0.84, 0.44, 0.84, 0.44,
          0.84, 0.44, 0.84, 0.44, 0.84, 0.44, 0.84,

          // bottom
          0.17, 0.51, 0.17, 0.51, 0.17, 0.51, 0.17, 0.51, 0.17, 0.51, 0.17,
          0.51, 0.17, 0.51, 0.17, 0.51, 0.17, 0.51,

          // left side
          0.84, 0.25, 0.84, 0.25, 0.84, 0.25, 0.84, 0.25, 0.84, 0.25, 0.84,
          0.25, 0.84, 0.25, 0.84, 0.25, 0.84, 0.25
        ]),
        gl.STATIC_DRAW
      );

      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aColor);
    }
  }

  draw() {
    let gl = this.webgl;
    if (gl) {
      this.initBuffer();
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }
  }
}
</script>

<style scoped></style>
