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

  {{ y }} {{ x }}
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";

let gl: Ref<Gl | null> = ref(null);
let y = ref(200);
let x = ref(0);

onMounted(() => {
  gl.value = new Gl();
  gl.value.init();
});

const change = () => {
  gl.value.draw();
};

const m3 = {
  translation: function (tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },

  rotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },

  scaling: function (sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22
    ];
  }
};

class Gl {
  public webgl: WebGLRenderingContext | null = null;
  public program: WebGLProgram | null = null;
  public canvas: HTMLCanvasElement | null = null;
  static vsString = `
         attribute vec3 a_position;
         attribute vec4 a_Color;
         varying vec4 v_Color;
         uniform vec2 u_resolution;
         uniform mat3 u_matrix;

         void main(){
            vec2 position = (u_matrix * vec3(a_position.xy,1)).xy / u_resolution * 2.0 - 1.0;
            gl_Position = vec4(position * vec2(1,-1), 0 , 1);
            v_Color = a_Color;
         }
    `;

  static fsString = `
      precision mediump float;
      varying vec4 v_Color;

      void main(){
          gl_FragColor = v_Color;
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
      let points: any = new Float32Array([
        0, 0, 0, 200, 200, 0, 200, 200, 200, 0, 0, 200
      ]);

      let colors: any = new Float32Array([
        0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1,
        0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1
      ]);

      let aPosition = gl.getAttribLocation(this.program!, "a_position");
      let uResolution = gl.getUniformLocation(this.program!, "u_resolution");
      let aColor = gl.getAttribLocation(this.program!, "a_Color");
      let uMatrix = gl.getUniformLocation(this.program!, "u_matrix");

      gl.uniform2fv(uResolution, [
        this.canvas?.clientWidth,
        this.canvas?.clientHeight
      ]);

      let matrix = m3.multiply(m3.translation(x.value,y.value), m3.rotation(20));

      gl.uniformMatrix3fv(uMatrix, false, matrix);

      //   创建点变量缓冲

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition); // 启用数据

      //  创建颜色缓冲

      let colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aColor); // 启用数据
    }
  }
  draw() {
    let gl = this.webgl;
    if (gl) {
      this.initBuffer();
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}
</script>

<style scoped></style>
