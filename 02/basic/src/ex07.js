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
  renderer.setClearColor("black");
  // renderer.setClearAlpha(0.5); // 0~1 불투명도

  // Scene
  const scene = new THREE.Scene();
  // scene으로 배경 지정하는 법
  // scene.background = new THREE.Color("blue");
  scene.fog = new THREE.Fog("black", 3, 7);

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
  light.position.y = 3;
  light.position.z = 5;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // 'MeshBoxMaterial' <- seen without light
    color: "#BA55D3",
  });

  const meshes = [];
  let mesh;
  for (let i = 0; i < 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5;
    mesh.position.z = Math.random() * 5 - 2.5;
    scene.add(mesh);
    meshes.push(mesh);
  }

  scene.add(mesh);

  // 애니메이션 성능보정 - clock 사용
  const clock = new THREE.Clock();

  // 시간차 계산할 기준
  let oldTime = Date.now();

  // render
  function draw() {
    // use javascript Date()
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    meshes.forEach((item) => {
      item.rotation.y += deltaTime * 0.001;
    });
    // mesh.rotation.y += deltaTime * 0.005;
    // mesh.position.y += deltaTime * 0.001;

    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // window.requestAnimationFrame(draw); // repaint 되기 전 인자로 들어온 함수를 호출해주는 역할 뿐.
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
