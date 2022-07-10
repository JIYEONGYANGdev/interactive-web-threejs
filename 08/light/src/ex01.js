import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light 기본 사용법, light Helper

export default function example() {
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
  const ambientLight = new THREE.AmbientLight("white", 0.5); // AmbientLight = 은은한 조명으로 색깔구분이 되도록 하는 정도, 다른 조명과 함께 쓰는 식임.  두번째 인자는 intensity,
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight("white", 0.5); // DirectionalLight = 태양광 같은
  light.position.y = 3;
  scene.add(light);

  // * lightHelper 시각적으로 빛(조명)의 위치 확인 가능
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10); // 바닥역할 하도록 회전
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "seagreen" });
  const material2 = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  // Mesh
  const planeMesh = new THREE.Mesh(planeGeometry, material1);
  const boxMesh = new THREE.Mesh(boxGeometry, material2);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material3);

  planeMesh.rotation.x = -Math.PI * 0.5;
  boxMesh.position.set(1, 1, 0);
  sphereMesh.position.set(-1, 1, 0);

  scene.add(planeMesh, boxMesh, sphereMesh);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  // light 위치 조절(control) GUI
  gui.add(light.position, "x", -5, 5); // 범위
  gui.add(light.position, "y", -5, 5); // 범위
  gui.add(light.position, "z", -5, 5); // 범위

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
