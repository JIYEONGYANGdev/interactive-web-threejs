import * as THREE from "three";
import dat from "dat.gui";

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
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5); // 전체적으로 은은한 조명
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

  // Dat GUI - controls
  const gui = new dat.GUI(); // javascript object를 gui 로 조작 가능하도록 하는 외부 라이브러리
  gui.add(mesh.position, "y", -5, 5, 0.01); // javascript object임, y 속성에 .형태로 접근 가능. arguments: (대상, 범위, 단위)

  gui.add(mesh.position, "z").min(-10).max(3).step(0.01).name("position Z"); // method chaining 가능

  // 카메라 control gui
  gui.add(camera.position, "x", -10, 10, 0.01).name("카메라 X");
  camera.lookAt(mesh.position); // mesh를 바라보도록 -> draw 함수 내에서도 lookAt 메소드 호출해줘야 함

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    mesh.rotation.y = time;
    camera.lookAt(mesh.position); // mesh를 바라보도록. 마우스 컨트롤로 3차원 이미지 360도 돌려볼 수 있는 그런 interactive효과

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
