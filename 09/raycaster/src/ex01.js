import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// ----- 주제: Raycaster(클릭 감지), 특정 광선(ray)에 맞은 Mesh 판별하기

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
  camera.position.x = 5;
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

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  // * raycaster의 광선은 보이지 않으므로, 동일한 위치에 geometry를 이용해서 광선mesh를 만들어 눈에 보이도록 구현
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  // * BufferGeometry 이용, 임의의 점들을 이어서 geometry를 만들 수 있는 형태 (선분 - 점 2개 기본)
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100));
  points.push(new THREE.Vector3(0, 0, -100));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const guide = new THREE.Line(lineGeometry, lineMaterial);

  scene.add(guide);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const toursGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const toursMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const toursMesh = new THREE.Mesh(toursGeometry, toursMaterial);
  toursMesh.name = "tours";

  scene.add(boxMesh, toursMesh);

  const meshes = [boxMesh, toursMesh];

  // * raycaster 만들기
  const raycaster = new THREE.Raycaster();

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    // * 움직임을 넣어 광선에 맞을 때만 color속성 변경
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    toursMesh.position.y = Math.cos(time) * 2;

    boxMesh.material.color.set("plum");
    toursMesh.material.color.set("lime");

    // * 실제 광선 만들기 - 시작점과 방향
    const origin = new THREE.Vector3(0, 0, 100);
    const direction = new THREE.Vector3(0, 0, -100);
    direction.normalize(); // '100'이라는 값 방향 정교화
    // console.log(direction.lenght())// 1 로 정교화되는 것 확인 가능. 방향은 '1' 로 주면 됨.

    raycaster.set(origin, direction);

    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      item.object.material.color.set("yellow");
    });

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
