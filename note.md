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
