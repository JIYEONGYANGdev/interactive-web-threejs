import * as THREE from "three";
import dat from "dat.gui";
import { degToRad } from "three/src/math/MathUtils";

// ----- 주제: 그룹 만들기(Scene Graph)

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
    color: "orange",
  });

  const materialOfEarth = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });

  const materialOfMoon = new THREE.MeshStandardMaterial({
    color: "lightgray",
  });

  const group1 = new THREE.Group();
  const sun = new THREE.Mesh(geometry, material);

  const group2 = new THREE.Group();
  const earth = new THREE.Mesh(geometry, materialOfEarth);
  // const earth = sun.clone();
  earth.scale.set(0.3, 0.3, 0.3);
  group2.position.x = 2;

  // const group3 = new THREE.Object#D();
  const group3 = new THREE.Group();
  const moon = new THREE.Mesh(geometry, materialOfMoon);
  // const moon = earth.clone();
  moon.scale.set(0.15, 0.15, 0.15); // 참조한 원본대비 비율임
  moon.position.x = 0.5;

  group3.add(moon);
  group2.add(earth, group3);
  group1.add(sun, group2);
  scene.add(group1);

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

  // 회전
  // mesh.rotation.reorder("YXZ");
  // mesh.rotation.y = THREE.MathUtils.degToRad(45);
  // mesh.rotation.x = THREE.MathUtils.degToRad(20);

  function draw() {
    const delta = clock.getDelta();

    // 그룹 만들기(scene graph)
    group1.rotation.y += delta;
    group2.rotation.y += delta;
    group3.rotation.y += delta;

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
