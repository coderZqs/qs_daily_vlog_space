<template>
  <canvas id="canvas" width="500" height="500"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

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
      void main(){
          gl_Position = vec4(a_position,1.0);
          gl_PointSize = 60.0;
          v_Color = a_Color;
      }
    `;

  static fsString = `
      precision mediump float;
      // varying vec4 v_Color;
      void main(){
          gl_FragColor = vec4(0.0,1.0,0.0,1.0);
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
      let points: any[] = [];
      let aPosition = gl.getAttribLocation(this.program!, "a_position");
    }
  }
  draw() {
    let gl = this.webgl;
    if (gl) {
      let points: any[] = [1, 0.5, 0, 0.6, 0.6, 0, 0.8, 0.2, 0];
      let aPosition = gl.getAttribLocation(this.program!, "a_position");
      let pointPosition = new Float32Array(points);

      let pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.LINE_LOOP, 0, pointPosition.length / 2);
    }
  }
}
</script>

<style scoped></style>
