import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: OrbitControls

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

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // 2nd argument: canvas object
  controls.enableDamping = true; // control을 부드럽게해주는 속성(옵션) - 역시나 update해줘야 함(draw 함수 내)
  // controls.enableZoom = false; // zoom 막음
  controls.maxDistance = 10; // 최대 거리 범위 한정 가능
  controls.minDistance = 2; // 최대 거리 범위 한정 가능
  controls.maxPolarAngle = Math.PI / 4; // control로 돌려볼 수 있는 각도, 45도
  // controls.minPolarAngle = THREE.MathUtils.degToRad(135);

  controls.target.set(2, 2, 2); // 컨트롤 기준점 설정, argument: (x,y,z 좌표)
  controls.autoRotate = true; // 컨트롤의 rotate임. 애니메이션이 아님!
  controls.autoRotateSpeed = 19;

  // Mesh - 랜덤한 컬러(material), 랜덤한 위치로 다수 생성
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      // 최소값 50 설정해서 까만배경보다는 다 눈에 보이도록
      color: `rgb(
					${50 + Math.floor(Math.random() * (255 - 50))}, 
					${50 + Math.floor(Math.random() * (255 - 50))},
					${50 + Math.floor(Math.random() * (255 - 50))}
				)
				`,
    });
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = (Math.random() - 0.5) * 5; // -2.5 ~ 2.5
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;

    scene.add(mesh);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // * 컨트롤이 부드럽게 하는 enableDamping을 매번 호출되도록 함
    controls.update();

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
