import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
const sizeConfig = {
  height: window.innerHeight,
  width: window.innerWidth,
};

/**
 * 添加生成的canvas
 * @param element
 * @param canvas
 */

const appendCanvasToElement = (
  element: HTMLElement,
  canvas: HTMLCanvasElement
) => {
  element.appendChild(canvas);
};

/**
 * 添加控制器
 * @param camera
 * @param canvas
 * @returns
 */

const addOrbitControls = (camera: THREE.Camera, canvas: HTMLCanvasElement) => {
  const controls = new OrbitControls(camera, canvas);

  return controls;
};

/**
 * 添加控制器
 * @param camera
 * @param canvas
 * @returns
 */

const addLockControls = (camera: THREE.Camera) => {
  const controls = new PointerLockControls(camera, document.body);

  return controls;
};

/**
 * 添加照相机
 * @param type
 * @param near
 * @param far
 * @returns
 */
const initCamera = (type = "PerspectiveCamera", near = 0.1, far = 1000) => {
  let camera;
  if (type === "PerspectiveCamera") {
    camera = new THREE.PerspectiveCamera(
      45,
      sizeConfig.width / sizeConfig.height,
      near,
      far
    );
  } else {
    camera = new THREE.OrthographicCamera(
      sizeConfig.width / -2,
      sizeConfig.width / 2,
      sizeConfig.height / 2,
      sizeConfig.height / -2,
      near,
      far
    );
  }

  return camera;
};

/**
 * 添加渲染器
 * @param params
 * @returns
 */

const initRenderer = (params: object = {}) => {
  const renderer = new THREE.WebGLRenderer({
    ...params,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(sizeConfig.width, sizeConfig.height);

  return renderer;
};

/**
 *  添加BoxGeometry
 * @param sizeConfig
 * @param materialType
 * @param materialConfig
 * @returns
 */

const generateCube = (
  sizeConfig: number[] = [100, 100, 100],
  materialType = "MeshBasicMaterial",
  materialConfig: {}
) => {
  return new THREE.Mesh(
    new THREE.BoxGeometry(sizeConfig[0], sizeConfig[1], sizeConfig[2]),
    new (THREE as any)[materialType]({ ...materialConfig })
  );
};

/**
 * aspect scene
 */

const addAdaptionScreen = (
  renderer: THREE.Renderer,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
) => {
  window.addEventListener("resize", () => {
    sizeConfig.height = window.innerHeight;
    sizeConfig.width = window.innerWidth;
    camera.updateProjectionMatrix();

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = sizeConfig.width / sizeConfig.height;
    }

    renderer.setSize(sizeConfig.width, sizeConfig.height);
  });
};

/**
 * 判断射线是否接触到物体
 * @param raycaster
 * @param objectList
 * @returns
 */

const judgeRaycasterTouchObject = (
  raycaster: THREE.Raycaster,
  objectList: THREE.Object3D[]
) => {
  const intersectObject = raycaster.intersectObjects(objectList);

  return Boolean(intersectObject.length);
};

/**
 * 添加贴图加载器
 * @param textureUrl
 * @param callback
 */
const addTextureLoader = (
  textureUrl: string,
  callback: (arg1: object) => any
) => {
  const fileExtension = textureUrl.split(".").pop();
  const isDDS = fileExtension === "dds";

  let loader;

  if (isDDS) {
    loader = new DDSLoader();
  } else {
    loader = new THREE.TextureLoader();
  }

  loader.load(textureUrl, (object) => {
    callback && callback(object);
  });
};

/**
 * 添加位置相关的音频对象
 * @param audioUrl
 * @param camera
 * @param volume
 * @param refDistance
 */

const addPositionalAudio = (
  audioUrl: string,
  camera: THREE.Camera,
  volume: number,
  refDistance: number
) => {
  return new Promise((resolve, reject) => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const PositionalAudio = new THREE.PositionalAudio(listener);

    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(audioUrl, (AudioBuffer) => {
      PositionalAudio.setBuffer(AudioBuffer);
      PositionalAudio.setVolume(volume || 0.9); //音量
      PositionalAudio.setRefDistance(refDistance || 1); //参数值越大,声音越大

      resolve(PositionalAudio);
    });
  });
};

/**
 * 生成地板
 */

const addPlane = (size: number, params: object): THREE.Mesh => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      ...params,
    })
  );

  plane.rotation.x = -Math.PI / 2;

  return plane;
};

/**
 * 加载fbx
 */

const loadFBX = (url: string, callback: (arg0: object) => void) => {
  const loader = new FBXLoader();
  // 加载人物
  loader.load(url, (object) => {
    callback && callback(object);
  });
};

/**
 * 加载OBJ
 */

const loadOBJ = (url: string, callback: (arg0: object) => void) => {
  const loader = new OBJLoader();
  // 加载人物
  loader.load(url, (object) => {
    callback && callback(object);
  });
};

export default {
  addPlane,
  appendCanvasToElement,
  generateCube,
  addOrbitControls,
  initCamera,
  initRenderer,
  addAdaptionScreen,
  judgeRaycasterTouchObject,
  addTextureLoader,
  addPositionalAudio,
  addLockControls,
  loadFBX,
  loadOBJ,
};
