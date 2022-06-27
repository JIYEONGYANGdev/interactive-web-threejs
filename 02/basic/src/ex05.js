import * as THREE from "three";

export default function example() {
  /* 동적으로 캔버스 조립하기 
// set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.domElement : renderer가 갖고 있는 캔버스
document.body.appendChild(renderer.domElement); // dom 조립 또는 html 내 canvas 태그 내 붙이기 (활용범위가 더 넓음)
*/
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  // renderer로 배경 지정하는 방법
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#00ff00");
  renderer.setClearAlpha(0.5); // 0~1 불투명도

  // Scene
  const scene = new THREE.Scene();
  // scene으로 배경 지정하는 법
  scene.background = new THREE.Color("blue");

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75, // fov(field of view, 시야각)
    window.innerWidth / window.innerHeight, // aspect(종횡비)
    0.1, // near
    1000 // far
  );

  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5; // z를 조정하면 perspective camera 와 다름, zoom을 조정 (+updateProjectMatrix )

  scene.add(camera);

  // set light
  const light = new THREE.DirectionalLight(0xffffff, 1); // 2nd argument: ligntness 0.1~
  light.position.x = 2;
  light.position.z = 5;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // 'MeshBoxMaterial' <- seen without light
    color: "#BA55D3",
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 애니메이션 성능보정 - clock 사용
  const clock = new THREE.Clock();

  // render
  function draw() {
    // console.log(clock.getElapsedTime());

    const time = clock.getElapsedTime(); //실행시점으로부터 총 시간
    const delta = clock.getDelta(); // 실행 간격 시간 차(draw가 실행되는 시간 간격 차), getElapsedTime과 둘 다 같이 사용하지 않는 것이 좋음.

    // mesh.rotation.y += 0.1; // radian 각도값. 360° === 2π
    // mesh.rotation.y += THREE.MathUtils.degToRad(1); // exchange radian to degree
    mesh.rotation.y = 2 * time; // 애니메이션이 딱딱하게 분리되어 보일 순 있으나 (1초에 10번 찍히는 성능 vs 1초에 5번만 찍히는 성능) 동일한 시간에 동일한 거리를 가는 것은 보장이 됨(속도)
    mesh.position.y += 0.01; // exchange radian to degree

    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // window 내장 메소드
    // window.requestAnimationFrame(draw); // repaint 되기 전 인자로 들어온 함수를 호출해주는 역할 뿐.

    // THREE renderer 내부 method - webXR : AR,VR project using three.js
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    // fix camera
    camera.aspect = window.innerWidth / window.innerHeight;
    // update
    camera.updateProjectionMatrix();
    // render updated source
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
