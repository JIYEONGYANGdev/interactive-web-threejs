import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light & Shadow

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  // * 그림자가 생길 수 있도록 설정 - 1. renderer
  renderer.shadowMap.enabled = true;
  // rendere의 shadow 설정
  renderer.shadowMap.type = THREE.BasicShadowMap; // PCFShadowMap 이 기본값; BasicShadowMap => pixel 이 살아 있음.
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 좀더 부드러움(성능이 떨어지겠지만)

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

  const light = new THREE.DirectionalLight("orangered", 0.5); // DirectionalLight = 태양광 같은
  light.position.y = 3;
  scene.add(light);

  // * lightHelper 시각적으로 빛(조명)의 위치 확인 가능
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // * 그림자 설정 - 2. Light: 다른물체에 그림자가 생기게(castShadow)
  light.castShadow = true;
  // 그림자가 그려지는 해상도 (default 512) - 성능 주의
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  // light> shadow의 범주 설정
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 39;

  // 그림자 가장자리 blur 효과
  light.shadow.radius = 5; // 쓰고싶으면 기본값 PCFShadowMap 과 함께 쓰면됨

  // * renderer - BasicShadowMap 과 함께 아래 처럼 light > shadow 해상도를 낮춰주면 픽셀이 크게 살아있음
  // light.shadow.mapSize.width = 64;
  // light.shadow.mapSize.height = 64;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10); // 바닥역할 하도록 회전
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  // Mesh
  const planeMesh = new THREE.Mesh(planeGeometry, material1);
  const boxMesh = new THREE.Mesh(boxGeometry, material2);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material3);

  planeMesh.rotation.x = -Math.PI * 0.5;
  boxMesh.position.set(1, 1, 0);
  sphereMesh.position.set(-1, 1, 0);

  // * 그림자 설정 - 3. Mesh: Light 영향받아서 물체에 그림자가 생기게 하거나, 물체 간 그림자 영향이 있도록 함 (receiveShadow)

  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  sphereMesh.castShadow = true;
  sphereMesh.receiveShadow = true;

  // plane은 바닥이므로 다른 물체에 그림자 영향 없을테니 설정
  planeMesh.receiveShadow = true;

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
    // const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // * light animation - cos & sin 이용해서 xz 등 2차원 평면 상 원 모양으로 회전 만들기
    // light.position.x = Math.cos(time) * 5;
    // light.position.z = Math.sin(time) * 5;

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
