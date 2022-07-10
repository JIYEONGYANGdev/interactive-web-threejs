import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshStandaraMaterial with effects

export default function example() {
  // 텍스처(이미지) 로드
  const loadingManager = new THREE.LoadingManager();
  // Event Handler
  loadingManager.onStart = () => {
    console.log("start load");
  };
  loadingManager.onProgress = (img) => {
    console.log(img + " loading in progress");
  };
  loadingManager.onLoad = () => {
    console.log("load complete");
  };
  loadingManager.onError = () => {
    console.log("error");
  };

  const textureLoader = new THREE.TextureLoader(loadingManager); // * 텍스처 로딩매니저를 인자로 넣어줌

  // 여러개의 텍스처를 로드
  const baseColorTexture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_basecolor.jpg"
  );
  const ambientTexture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_ambientOcclusion.jpg"
  );
  const heightTexture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_height.png"
  );
  const normalTexture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_normal.jpg"
  );
  const roughnessTexture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_roughness.jpg"
  );

  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 1, 2);

  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);

  const material = new THREE.MeshStandardMaterial({
    map: baseColorTexture,
    roughness: 0.3,
    normalMap: normalTexture, // 기본 입체감 텍스처이미지 맵핑하는 속성, 벽돌 이미지 -> 실제 벽돌같아짐. (이런 이미지는 따로 전문적으로 만들어야 함)
    roughnessMap: roughnessTexture, // 이미지의 균열 등 표면 디테일
    aoMap: ambientTexture, // shadow
    aoMapIntensity: 1, // shadow 명도의 강도
  });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
