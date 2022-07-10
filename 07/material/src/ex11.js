import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshNormalMaterial (법선)

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
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // radius, widthSegments, heightSegments ..

  // * MeshNormalMaterial - 법선 방향이 바뀌니 색도 바뀜 (무지개 gradient 효과)
  const material = new THREE.MeshNormalMaterial({});

  const mesh = new THREE.Mesh(geometry, material);
  // 구는 법선의 방향이 모두 같으므로 orbit control로 돌려보아도 변화가 없어보임. (무지개 그라데이션 변화가)
  const mesh2 = new THREE.Mesh(sphereGeometry, material);

  mesh2.position.set(3, 0, 0);
  scene.add(mesh, mesh2);

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
