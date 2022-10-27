```
  1.未产生阴影

     1.接受阴影的物体需设置receiveShadow
     2.webRenderer需设置shadowMap.enabled = true;
     3.阴影的物体需设置castShadow；
```

1.精灵模型始终朝向屏幕
2.sRGBEncoding 模型将变亮

THREE.BasicShadowMap：提供未经过滤的阴影贴图，性能最快，但质量最低。
THREE.PCFShadowMap：使用 Percentage-Closer Filtering (PCF) 算法过滤阴影贴图，是默认类型。
THREE.PCFSoftShadowMap：使用 PCF 算法过滤的更加柔和的阴影贴图，尤其是在使用低分辨率阴影贴图时。
THREE.VSMShadowMap：使用方差阴影贴图 VSM 算法过滤的阴影贴图。 使用 VSMShadowMap 时，所有阴影接收者也会投射阴影。

SAPBroadphase 剪叶算法 开启性能更好

angular（有角的）

angularVelocity 角速度
angularDamping 随着时间减少速度。 （用于球体停止滚动）
BOX3 可以获取模型长宽高

Math.cos(0) = 1 Math.cos(Math.PI /2) = 0;
Math.sin(0) = 0; Math.sin(Math.PI /2) =1;

cos = sin - 90;

Math.asin(0) = Math.acos(0) = 0;
Math.asin(Math.PI /2) = 1;
Math.acos(Math.PI /2) = -1;

反余弦和反正弦范围都是 -1 到 1；

vertexColors

    envMap：环境贴图。 需搭配cubeTexture使用。
    reflectivity： 环境贴图的对表面的影响程度
    shininess：反光的强度  defualt:30
    flatShading: 是否使用平面着色渲染     phong材质
    alphaMap：控制灰暗

    emissive和emissiveMap是同一组关系    roughnessMap对应 roughness。    map对应color  specularMap对应spccular

       fog  深度测试  贝塞尔曲线实践。  贴图细节 烘焙光照  bufferGeometry   shader



css：


background-clip  transition。 实现渐变填充。
text-shadow  animation  文本发光