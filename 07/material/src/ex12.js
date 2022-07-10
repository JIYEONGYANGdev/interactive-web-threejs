import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshMatcapMaterial - 구 형태에 울퉁불퉁 입체감 있는 텍스처를 다양한 geometry 형태 mesh에 맵핑

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
  const matCapTexture = textureLoader.load(
    "/textures/stone_floor/Stylized_Stone_Floor_003_basecolor.jpg"
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
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  // * MeshMatCapMaterial
  const material = new THREE.MeshMatcapMaterial({
    matcap: matCapTexture,
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
