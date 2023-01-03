webgl = 光栅化引擎
顶点着色器(Vertex) + 片元着色器(Fragment) = 1 着色程序 (program)

<!-- 步骤 -->

创建着色器 : 创建(createShader) > 提供数据(shaderSource) > 编译 (compileShader)
创建着色程序： 创建(createProgram) > 设置着色器（attachShader）> 链接（linkProgram）
提供着色器数据： 寻找属性位置（getAttribLocation） 创建缓冲（createBuffer） 绑定缓冲（bindBuffer， gl.ARRAY_BUFFER 是绑定点） 存放数据 （bufferData(绑定点，数据，)）
设置屏幕大小 viewPort（0，0，width,height）
使用项目 （useProgram）
启用对应属性 enableVertexAttribArray
渲染(drawArrays(渲染类型, offset??? , ))

<!-- 工作原理 -->

光栅化=》用像素画出来

varying 变量 可从顶点着色器 传值到片段着色器
每个顶点调用一次顶点着色器和片元着色器

Attributes 属性和缓冲的关系： createBuffer => bindBuffer => bufferData => getAttribLocation => enableVertexAttribArray => vertexAttribPointer（传递）
Uniforms 全局变量： getUniformLocation =》 uniform4fv

全局变量可一次性赋值 uniform vec2 u_someVec2[3] uniform2fv(somevec2, [1,2,3,4,5,6])

Texture 纹理： createTextur e bindTexture（

<!-- 数学 -->

线性插值

矩阵相乘

a b x z ax+by az+bw
c d y w cx+dy cz+dw



a,b,c     1  4      1a+2b+3c+4a+5b+6c
d,e,f  *  2  5  =   1d+2e+3f+4d+5e+6f
h,i,j     3  6      1h+2i+3j+4h+5i+6j


平移矩阵

1,0      x
0,1      y   =  1x,1y

向量到原点的距离 = 模


| a  b  0 |
| c  d  0 |
| tx ty 1 |


a 水平缩放  b 水平拉伸  c 垂直拉伸  d 垂直缩放  tx 水平位移  ty 垂直位移