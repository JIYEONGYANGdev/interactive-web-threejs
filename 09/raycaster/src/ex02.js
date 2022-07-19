import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 클릭한 Mesh 감지

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
  const mouse = new THREE.Vector2(); // 2차원 지점
  console.log(mouse);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    toursMesh.position.y = Math.cos(time) * 2;

    boxMesh.material.color.set("plum");
    toursMesh.material.color.set("lime");

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function checkIntersects() {
    // raycaster set 메소드 조금 다름
    raycaster.setFromCamera(mouse, camera); // origin이 camera에 있다고 생각 args: (mouse, camera)

    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      console.log(item.object.name);
      break; // 처음 클릭(광선)된 아이템 출력 후 break
    }
    // 또는 index 이용하여 요소에 접근해도 되고.
    if (intersects[0]) console.log(intersects[0]);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    // console.log(e.clientX, e.clientY);
    // 2차원 좌표를 3차원 좌표로. 정중앙이 (0,0,0) 이고, y방향은 반전
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

    checkIntersects();
    // console.log(mouse);
  });

  draw();
}
