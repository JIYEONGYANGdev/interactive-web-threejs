import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// ----- 주제: PointerLockControls

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
  /* PointerLockControls 
    - update메소드가 없음. 
    - .lock() 메소드* user gesture(click, .etc,..) necessary
    javascript 의 pointer lock api 이용한 것 (requestPointerLock)
  */
  const controls = new PointerLockControls(camera, renderer.domElement);
  controls.domElement.addEventListener("click", () => {
    controls.lock(); // 클릭 시 컨트롤 동작가능
  });

  // * window 이벤트 'lock', 'unlock' 을 이용해서 유저가 클릭 시 어떤 모달을 띄운다든지 하는 액션을 줄 수 있을 듯.
  controls.addEventListener("lock", () => {
    console.log("lock!");
  });
  controls.addEventListener("unlock", () => {
    console.log("unlock!");
  });

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
    // controls.update(delta);

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
