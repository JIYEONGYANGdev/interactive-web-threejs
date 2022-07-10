import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshToonMaterial(카툰 효과)

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
  const gradientTexture = textureLoader.load("/textures/gradient.png"); // * gradient texture image
  gradientTexture.magFilter = THREE.NearestFilter; // * magFilter property 설정하여 그라데이션도 2차원 효과

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
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  // *MeshToonMaterial - 2차원 처럼 단순한 음영 => gradation 이미지로 각을 더 늘릴 수 있음
  const material = new THREE.MeshToonMaterial({
    color: "plum",
    gradientMap: gradientTexture, // gradient texture image set
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
