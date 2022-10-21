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