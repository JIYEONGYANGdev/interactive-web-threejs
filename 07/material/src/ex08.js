import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: texture 이미지 변환

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

  const texture = textureLoader.load(
    "/textures/skull/Ground Skull_basecolor.jpg"
  );

  // 텍스처 변환 (wrapping 위치 조정 및 반복 가능)
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  // 랩핑 위치
  // texture.offset.x = 0.3;
  // texture.offset.y - 0.3;
  // 반복
  // texture.repeat.x = 2;
  // texture.repeat.y = 2;
  // 회전
  texture.rotation = THREE.MathUtils.degToRad(30);
  // 회전 기준점 설정
  texture.center.x = 0.5;
  texture.center.y = 0.5;

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
    map: texture, // texture 맵핑
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
