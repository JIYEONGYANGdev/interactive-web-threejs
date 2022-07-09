import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Mesh에 텍스처 이미지로 wrapping해보기

export default function example() {
  // 텍스처로더 상수 선언, 텍스처로더를 사용해서 이미지를 로드해온다
  const textureLoader = new THREE.TextureLoader();
  // const texture = textureLoader.load(
  //   "/textures/buildingFacade_brick/Building_Facade_001_basecolor.jpg" // webpack 설정에서 설정 필요
  // );
  // console.log(textureImage);
  const texture = textureLoader.load(
    "/textures/buildingFacade_brick/Building_Facade_001_basecolor.jpg",
    // 함수 - 로드 중, 로드 중 에러, 로드 완료 등에 실행
    () => {
      console.log("Loaded successfully");
    },
    () => {
      console.log("isLoading");
    },
    () => {
      console.log("error");
    }
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
  const geometry = new THREE.CylinderGeometry(2, 2, 4, 36);

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
