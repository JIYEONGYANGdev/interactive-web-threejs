import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Skybox (3차원 inside 배경을 맵핑, 게임에서 멀리 있는 배경이나 하날이나 바닥에 맵핑(도배))
// 따라서 cubeTextureLoader 사용

export default function example() {
  // 텍스처(이미지) 로드 - cubeMap
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  // const environmentTexture = cubeTextureLoader // => * scene.background 에 셋팅!
  //   .setPath("/textures/cubeMap/")
  //   .load([
  //     // +(p) -(n) 순서로
  //     "px.png",
  //     "nx.png",
  //     "py.png",
  //     "ny.png",
  //     "pz.png",
  //     "nz.png",
  //   ]);

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

  // scene background 에 cubeTextureLoader로 공간 내 이미지 맵핑
  scene.background = cubeTextureLoader
    .setPath("/textures/cubeMap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshStandardMaterial({
    metalness: 2,
    roughness: 0.1,
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
