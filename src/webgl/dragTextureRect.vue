<template>
  <div>
    <canvas class="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

class GL {
  static VERTEX_SHADER: string = `
     attribute vec2 a_position;
     uniform vec2 u_translation;
     uniform vec2 u_resolution;
     attribute vec2 a_texCoord;
     varying vec2 v_texCoord;

     void main() {
        vec2 position =  (a_position + u_translation) / u_resolution * 2.0 - 1.0;
        gl_Position = vec4(position * vec2(1,-1), 0,1);
        v_texCoord = a_texCoord;
     }
  `;

  static FRAGMENT_SHADER: string = `
    uniform sampler2D u_image;
    precision mediump float;
    varying vec2 v_texCoord;
    void main() {
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  `;

  public translateX: number = 200;
  public translateY: number = 200;

  public webgl: WebGLRenderingContext | null = null;
  public canvas: HTMLCanvasElement | null = null;
  public program: WebGLProgram | null = null;
  public positionData: number[] = [
    -100, -100, 100, -100, -100, 100, 100, 100, 100, -100, -100, 100
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.webgl = canvas.getContext("webgl");

    this.webgl!.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  init() {
    this.addDragHandle();
    this.initShader();
    this.draw();
    this.loadTexture();

    let animate = () => {
      let radian = (Math.PI / 180) * 1;
      this.positionData = this.positionData.map((v, key) => {
        let number = 0;

        if (key % 2 === 0) {
          number =
            v * Math.cos(radian) -
            this.positionData[key + 1] * Math.sin(radian);
        } else {
          number =
            v * Math.cos(radian) +
            this.positionData[key - 1] * Math.sin(radian);
        }

        return number;
      });

      this.draw();
      requestAnimationFrame(animate);
    };

    animate();
  }

  judgeEventInPoint(eventX, eventY) {
    let sizeX = 100;
    let sizeY = 100;

    if (
      eventX > this.translateX - sizeX &&
      eventX < this.translateX + sizeX &&
      eventY > this.translateY - sizeY &&
      eventY < this.translateY + sizeY
    ) {
      return true;
    } else {
      return false;
    }
  }

  loadTexture() {
    let image = new Image();
    image.src = "/src/assets/image/login.jpg";
    image.onload = () => {
      var texCoordLocation = this.webgl!.getAttribLocation(
        this.program!,
        "a_texCoord"
      );

      let texCoordBuffer = this.webgl!.createBuffer();
      this.webgl!.bindBuffer(this.webgl!.ARRAY_BUFFER, texCoordBuffer);
      this.webgl!.bufferData(
        this.webgl!.ARRAY_BUFFER,
        new Float32Array([
          0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0
        ]),
        this.webgl!.STATIC_DRAW
      );

      this.webgl!.enableVertexAttribArray(texCoordLocation);
      this.webgl!.vertexAttribPointer(
        texCoordLocation,
        2,
        this.webgl!.FLOAT,
        false,
        0,
        0
      );

      var texture = this.webgl!.createTexture();
      this.webgl!.bindTexture(this.webgl?.TEXTURE_2D!, texture);

      // 设置参数，让我们可以绘制任何尺寸的图像
      this.webgl!.texParameteri(
        this.webgl!.TEXTURE_2D,
        this.webgl!.TEXTURE_WRAP_S,
        this.webgl!.CLAMP_TO_EDGE
      );
      this.webgl!.texParameteri(
        this.webgl!.TEXTURE_2D,
        this.webgl!.TEXTURE_WRAP_T,
        this.webgl!.CLAMP_TO_EDGE
      );
      this.webgl!.texParameteri(
        this.webgl!.TEXTURE_2D,
        this.webgl!.TEXTURE_MIN_FILTER,
        this.webgl!.NEAREST
      );
      this.webgl!.texParameteri(
        this.webgl!.TEXTURE_2D,
        this.webgl!.TEXTURE_MAG_FILTER,
        this.webgl!.NEAREST
      );

      // 将图像上传到纹理
      this.webgl!.texImage2D(
        this.webgl!.TEXTURE_2D,
        0,
        this.webgl!.RGBA,
        this.webgl!.RGBA,
        this.webgl!.UNSIGNED_BYTE,
        image
      );
    };
  }

  addDragHandle() {
    if (this.webgl) {
      if (this.canvas) {
        this.canvas.onmousedown = downEvent => {
          let x = downEvent.clientX;
          let y = downEvent.clientY;

          let offsetLeft = this.translateX - x;
          let offsetTop = this.translateY - y;

          if (this.judgeEventInPoint(x, y)) {
            window.onmousemove = e => {
              console.log(this.translateX - x);
              this.translateX = e.clientX + offsetLeft;
              this.translateY = e.clientY + offsetTop;
            };

            window.onmouseup = () => {
              window.onmousemove = null;
              window.onmouseup = null;
            };
          }
        };
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

  draw() {
    if (this.webgl) {
      let uPosition = this.webgl.getAttribLocation(this.program!, "a_position");
      let u_resolution = this.webgl?.getUniformLocation(
        this.program!,
        "u_resolution"
      );

      let u_translation = this.webgl?.getUniformLocation(
        this.program!,
        "u_translation"
      );

      //  设置顶点

      let positionBuffer = this.webgl?.createBuffer()!;
      this.webgl?.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);

      this.webgl?.bufferData(
        this.webgl.ARRAY_BUFFER,
        new Float32Array(this.positionData),
        this.webgl.STATIC_DRAW
      );

      this.webgl?.enableVertexAttribArray(uPosition);

      this.webgl?.vertexAttribPointer(
        uPosition,
        2,
        this.webgl.FLOAT,
        false,
        0,
        0
      );

      //   设置长宽

      this.webgl?.uniform2fv(u_resolution, [
        this.canvas!.clientWidth,
        this.canvas!.clientHeight
      ]);

      //   设置位移

      this.webgl?.uniform2fv(u_translation, [this.translateX, this.translateY]);

      //   绘制

      this.webgl?.clearColor(0.0, 0.0, 0.0, 1.0);
      this.webgl?.clear(
        this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT
      );

      this.webgl?.drawArrays(
        this.webgl.TRIANGLES,
        0,
        new Float32Array(this.positionData).length / 2
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
