import * as THREE from "three";
import dat from "dat.gui";
import { degToRad } from "three/src/math/MathUtils";

// ----- 주제: rotation

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
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  // 그리기
  const clock = new THREE.Clock();

  // * rotation 속성 주의할 점 - 축을 바꿔주지 않으면 우리가 상상하는 입체 움직임 각도와 불일치
  // 마인크래프트 게임캐릭터로 생각해보면 이해가 쉽다.
  mesh.rotation.reorder("YXZ");
  mesh.rotation.y = THREE.MathUtils.degToRad(45);
  mesh.rotation.x = THREE.MathUtils.degToRad(20);

  function draw() {
    const delta = clock.getDelta();

    // mesh.position.set(-1, 2, -5);

    // mesh.scale.set(4, 1, 2);

    // * rotation
    // mesh.rotation.x = degToRad(45); // THREE.MathUtils.degToRad()
    // mesh.rotation.x = Math.PI / 4; // 180 / 4 == 45
    // mesh.rotation.x = 1; // PI기준 대비값. PI(3.14)의 1/3이므로 60도 정도

    // mesh.rotation.z += delta; // 회전하는 애니메이션 효과

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
