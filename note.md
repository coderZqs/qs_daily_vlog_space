产生阴影条件

1.接受阴影的物体需设置 receiveShadow
2.webRenderer 需设置 shadowMap.enabled = true; 3.阴影的物体需设置 castShadow；

模型：

精灵模型始终朝向屏幕
sRGBEncoding 模型将变亮

THREE.BasicShadowMap：提供未经过滤的阴影贴图，性能最快，但质量最低。
THREE.PCFShadowMap：使用 Percentage-Closer Filtering (PCF) 算法过滤阴影贴图，是默认类型。
THREE.PCFSoftShadowMap：使用 PCF 算法过滤的更加柔和的阴影贴图，尤其是在使用低分辨率阴影贴图时。
THREE.VSMShadowMap：使用方差阴影贴图 VSM 算法过滤的阴影贴图。 使用 VSMShadowMap 时，所有阴影接收者也会投射阴影。
BOX3 可以获取模型长宽高

cannon-es：

SAPBroadphase 剪叶算法 开启性能更好
angular（有角的）
angularVelocity 角速度
angularDamping 随着时间减少速度。 （用于球体停止滚动）

Math:

Math.cos(0) = 1 Math.cos(Math.PI /2) = 0;
Math.sin(0) = 0; Math.sin(Math.PI /2) =1;
cos = sin - 90;
Math.asin(0) = Math.acos(0) = 0;
Math.asin(Math.PI /2) = 1;
Math.acos(Math.PI /2) = -1;

反余弦和反正弦范围都是 -1 到 1；
向量点乘 = a 的长度 + b 的长度\* 两个向量的夹角
向量叉乘可以得出两个向量组成的平面的垂直向量 = 法线

https://lexra.pixnet.net/blog/post/354226367-%EF%BF%AD-%E9%A4%98%E5%BC%A6%E5%AE%9A%E7%90%86---cosine-theorem

vertexColors 顶点颜色
envMap：环境贴图。 需搭配 cubeTexture 使用。
reflectivity： 环境贴图的对表面的影响程度
shininess：反光的强度 defualt:30
flatShading: 是否使用平面着色渲染 phong 材质
alphaMap：控制灰暗
emissive 和 emissiveMap
roughnessMap 对应 roughness。  
map 对应 color
specularMap 对应 spccular

learning

fog 深度测试 贝塞尔曲线实践。 贴图细节 烘焙光照 bufferGeometry shader

background-clip transition。 实现渐变填充。
text-shadow animation 文本发光

bufferGeometry

属性： position 位置， color 颜色， 颜色是以 rgb 的形式传入 ，normal 光照

数学基础

矩阵：Matrix4

初始 4x4 矩阵

// 1, 0, 0, 0,
// 0, 1, 0, 0,
// 0, 0, 1, 0,
// 0, 0, 0, 1

multiplyScalar 矩阵内的所有值都乘以这个参数

矩阵相乘有三种方式

multiplyMatrices，类似于 Object.assign(); 会生成新的结果
multiply 类似于 push, 会在原来的值做修改

矩阵不可逆

2d 向量：向量 ab b 代表方向

点乘代表着 向量 a 在向量 b 的投影， 如结果= 0；则两个向量垂直，如果大于 0，则夹角为锐角， 如果小于 0，则为钝角

弧度等于 两条半径所形成夹角的弧度 = 半径

圆和椭圆的关系， 圆是平面中到圆心的距离为定值的所有点组成的图形， 椭圆是平面中到两个点的距离之和为定值的所有点组成的图形， 两个点是焦点，两个点距离叫做焦距。

贴图：

环境光遮蔽(AO)贴图,
光线映射(lightMap)贴图
高光(Specular)贴图
金属(metalness)贴图
光滑(roughness)贴图
环境(environment)贴图
灰阶高度(displacement map or height map)贴图