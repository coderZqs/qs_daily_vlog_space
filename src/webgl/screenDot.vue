<template>
  <div>
    <canvas class="canvas" style="width:100vw;height:100vh"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

class GL {
  static VERTEX_SHADER: string = `
     attribute vec3 a_position;
     attribute vec4 a_color;
     varying vec4 v_color;
     attribute float a_size;

     void main() {
        gl_Position = vec4(a_position,1.0);
        gl_PointSize = a_size;
        v_color = a_color;
     }
  `;

  static FRAGMENT_SHADER: string = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      gl_FragColor = v_color;
    }
  `;

  public webgl: WebGLRenderingContext | null = null;
  public canvas: HTMLCanvasElement | null = null;
  public program: WebGLProgram | null = null;
  public sizeData: number[] = [];
  public colorData: number[] = [];
  public positionData: number[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    this.webgl = canvas.getContext("webgl");

    this.webgl!.viewport(0, 0, canvas.width, canvas.height);
  }

  init() {
    this.addClickListener();
    this.initShader();
    this.draw();

    let animate = () => {
      this.draw();
      requestAnimationFrame(animate);
    };

    animate();
  }

  addClickListener() {
    if (this.webgl) {
      if (this.canvas) {
        this.canvas.addEventListener("click", e => {
          let x = (e.clientX / this.canvas!.offsetWidth - 0.5) * 2;
          let y = -(e.clientY / this.canvas!.offsetHeight - 0.5) * 2;

          this.addData("positionData", [x, y, 0.0]);
          this.addData("colorData", [
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ]);

          this.addData("sizeData", 20.0);
        });
      }
    }
  }

  initShader() {
    if (this.webgl) {
      let vertexShader = this.webgl.createShader(this.webgl.VERTEX_SHADER)!;
      let fragmentShader = this.webgl.createShader(this.webgl.FRAGMENT_SHADER)!;

      this.webgl.shaderSource(vertexShader, GL.VERTEX_SHADER);
      this.webgl.shaderSource(fragmentShader, GL.FRAGMENT_SHADER);

      this.webgl.compileShader(vertexShader);
      this.webgl.compileShader(fragmentShader);

      let program = this.webgl.createProgram()!;
      this.webgl.attachShader(program, vertexShader);
      this.webgl.attachShader(program, fragmentShader);

      if (
        !this.webgl.getShaderParameter(vertexShader, this.webgl.COMPILE_STATUS)
      ) {
        console.log(this.webgl.getShaderInfoLog(vertexShader));
      }

      this.webgl.linkProgram(program);
      this.webgl.useProgram(program);

      if (!this.webgl.getProgramParameter(program, this.webgl.LINK_STATUS)) {
        var info = this.webgl.getProgramInfoLog(program);
        console.log(info);
      }

      this.program = program;
    }
  }

  addData(type, data) {
    if (["positionData", "colorData", "sizeData"].includes(type)) {
      if (Array.isArray(data)) {
        this[type] = this[type].concat(data);
      } else {
        this[type].push(data);
      }
    }
  }

  changePointSize() {
    this.sizeData = this.sizeData.map(e => e + 0.1);
  }

  draw() {
    if (this.webgl) {
      this.changePointSize();
      let uPosition = this.webgl.getAttribLocation(this.program!, "a_position");
      let uColor = this.webgl?.getAttribLocation(this.program!, "a_color");
      let uSize = this.webgl?.getAttribLocation(this.program!, "a_size");

      let positionBuffer = this.webgl?.createBuffer()!;
      let colorBuffer = this.webgl?.createBuffer()!;

      this.webgl?.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);

      this.webgl?.bufferData(
        this.webgl.ARRAY_BUFFER,
        new Float32Array(this.positionData),
        this.webgl.STATIC_DRAW
      );

      this.webgl?.enableVertexAttribArray(uPosition);

      this.webgl?.vertexAttribPointer(
        uPosition,
        3,
        this.webgl.FLOAT,
        false,
        0,
        0
      );

      this.webgl?.bindBuffer(this.webgl?.ARRAY_BUFFER, colorBuffer);

      this.webgl?.bufferData(
        this.webgl?.ARRAY_BUFFER,
        new Float32Array(this.colorData),
        this.webgl.STATIC_DRAW
      );

      this.webgl?.vertexAttribPointer(uColor, 4, this.webgl.FLOAT, false, 0, 0);
      this.webgl?.enableVertexAttribArray(uColor!);

      let sizeBuffer = this.webgl?.createBuffer()!;
      this.webgl?.bindBuffer(this.webgl.ARRAY_BUFFER, sizeBuffer);
      this.webgl?.bufferData(
        this.webgl.ARRAY_BUFFER,
        new Float32Array(this.sizeData),
        this.webgl.STATIC_DRAW
      );

      this.webgl?.vertexAttribPointer(
        uSize,
        1,
        this.webgl.FLOAT,
        false,
        new Float32Array(this.sizeData).BYTES_PER_ELEMENT,
        0
      );
      this.webgl?.enableVertexAttribArray(uSize!);

      this.webgl?.clearColor(0.0, 0.0, 0.0, 1.0);
      this.webgl?.clear(
        this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT
      );

      this.webgl?.drawArrays(
        this.webgl.POINTS,
        0,
        new Float32Array(this.positionData).length / 3
      );

      this.webgl?.drawArrays(
        this.webgl.LINE_STRIP,
        0,
        new Float32Array(this.positionData).length / 3
      );
    }
  }
}

onMounted(() => {
  let gl = new GL(document.querySelector(".canvas") as HTMLCanvasElement);
  gl.init();
});
</script>

<style scoped></style>
