<template>
  <canvas id="canvas" width="500" height="500"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  let gl = new Gl();
  gl.init();
});

class Gl {
  public webgl: WebGLRenderingContext | null = null;
  public program: WebGLProgram | null = null;
  public canvas: HTMLCanvasElement | null = null;
  static vsString = `
      attribute vec3 a_position;
      attribute vec4 a_Color;
      varying vec4 v_Color;
      uniform vec4 u_resolution;
      void main(){
        gl_Position = vec4(a_position, 1) + u_resolution;
        v_Color = a_Color;
      }
    `;

  static fsString = `
      precision mediump float;
      // varying vec4 v_Color;
      void main(){
          gl_FragColor = v_Color;
      }
    `;
  constructor() {}

  init() {
    this.initGl();
    this.initShader();
    this.initBuffer();
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
        -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5
      ]);

      let colors: any = new Float32Array([0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1]);

      let aPosition = gl.getAttribLocation(this.program!, "a_position");
      let uResolution = gl.getUniformLocation(this.program!, "u_resolution");
      let aColor = gl.getAttribLocation(this.program!, "a_Color");

      gl.uniform4fv(uResolution, [-0.5, 0.2, 0, 1]);

      //   创建点变量缓冲

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition); // 启用数据

      //  创建颜色缓冲

      let colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aColor); // 启用数据
    }
  }
  draw() {
    let gl = this.webgl;
    if (gl) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}
</script>

<style scoped></style>
