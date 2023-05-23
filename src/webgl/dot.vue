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
      void main(){
          gl_Position = vec4(a_position,1.0);
          gl_PointSize = 60.0;
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
      this.canvas?.addEventListener("click", e => {
        let gl = this.webgl!;
        let x = e.clientX;
        let y = e.clientY;

        let { top, left, width, height } = this.canvas!.getBoundingClientRect();
        let pointAsClickArea = {
          x: (x - left - width / 2) / (width / 2),
          y: -(y - top - height / 2) / (height / 2)
        };

        points = points.concat([pointAsClickArea.x, pointAsClickArea.y, 0.0]);
        let pointPosition = new Float32Array(points);

        let pointBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

        let aColor = gl.getAttribLocation(this.program!, "a_Color");
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColor);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, pointPosition.length / 3);
      });
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
