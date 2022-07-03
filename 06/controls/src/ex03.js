import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

// ----- 주제: FlyControls

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
  // * FlyControls
  const controls = new FlyControls(camera, renderer.domElement); // 마우스에 따라 control, update에 delta/time을 넣어줘야 함
  // 화살표 이동 가능(위성뷰처럼)
  // controls.rollSpeed = 0.5; // 마우스 hover 컨트롤(회전*) 스피드 조정 - 무중력처럼 떠다니며 보는 느낌, default 0.05
  controls.movementSpeed = 3; // 화살표 컨트롤 스피드 조정
  controls.dragToLook = true; // 마우스 Hover에 컨트롤 회전되지 않음. 드래그를 해야 움직임

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
    controls.update(delta);

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
