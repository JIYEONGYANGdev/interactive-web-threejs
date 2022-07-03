import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Geometry 기본

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
  const controls = new OrbitControls(camera, renderer.domElement); // arguments(camera, canvas)

  // Mesh
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  // const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: "blue",
    side: THREE.DoubleSide,
    flatShading: true, // wireframe아니어도 vertext보이도록
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // console.log(geometry); // attributes: { position, uv, ..} // position: vertex 위치를 Float32Array형식으로 담고 있음
  // console.log(geometry.attributes.position.array); // vertex의 3배 값. x,y,z 3차원 좌표이니까.
  const positionArray = geometry.attributes.position.array;

  // * mesh 일체가 진동하는 것처럼 보이는이유: 모든 지점에 같은 시간단위를 가지고 랜덤값 부여, 일체가 아닌 각 vertex가 각각 랜덤하게 좌표이동하도록 하려면?
  // 고정된 랜덤 범위가 반복되도록
  const randomArray = [];

  for (let i = 0; i < positionArray.length; i += 3) {
    // 정점(Vertex) 한개의 x,y,z좌표를 랜덤으로 조정
    // 한 좌표(array의 3개 요소 그룹)에 대해 조작해야. (i+=3)
    // position[i] : x좌표, postion[i+1]: y좌표, position[i+2]: z좌표
    // positionArray[i] = positionArray[i] + Math.random(); // 치우친 느낌이 날 수 있음, 0~1 실수 양수를 랜덤으로 더하니 양수방향으로만 삐죽빼죽
    // positionArray[i] = positionArray[i] + (Math.random() - 0.5); // -0.5 ~ 0.5 값을 랜덤으로 더하도록 보정
    positionArray[i] += (Math.random() - 0.5) * 0.2; // 변화를 작게하여 부드럽게
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }

  console.log(randomArray.length);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 3; // 처음 시작된 0부터 경과된 시간, 계속 증가하는 수

    // 애니메이션처럼 보이기 위해 draw 함수 안에서 - x,y,z 조작
    for (let i = 0; i < positionArray.length; i += 3) {
      // sine graph 이용(x가 각도변화, y는 값) -1 ~ 1 사이의 값을 진동반복 : Math.sin(각도)
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.002; // getElapsedTime:경과시간 이용
      positionArray[i] += Math.sin(time + randomArray[i + 1] * 100) * 0.002; // getElapsedTime:경과시간 이용
      positionArray[i] += Math.sin(time + randomArray[i + 2] * 100) * 0.002; // getElapsedTime:경과시간 이용
      // * 0.00이런식으로 배수하는 방법. Math.sin() 인자인 각도를 변화시키는 방법==time을 더 높이던가(* 수)
      // * loop 밖에서 정의 한 고정된 랜덤randomArray[i]을 이용해서 적용시켜주면 고정된 랜덤 가지고 반복운동
    }

    geometry.attributes.position.needsUpdate = true; // * update 설정해줘야 animation처럼 동작(보임)

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
