<template>
  <canvas id="canvas"></canvas>
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
  static vsString = `
    attribute vec3 a_position;
    void main(){
        gl_Position = vec4(a_position,1.0);
        gl_PointSize = 60.0;
    }
  `;

  static fsString = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1, 0, 0.5, 1);
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
    if (this.webgl) {
      let pointPosition = new Float32Array([0.2, 0.0, 0.0, 1.0]);
      let aPosition = this.webgl.getAttribLocation(this.program!, "a_position");
      this.webgl.vertexAttrib4fv(aPosition, pointPosition);
    }
  }
  draw() {
    let gl = this.webgl;
    if (gl) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }
}
</script>

<style scoped></style>
