import * as THREE from "three";

/* 동적으로 캔버스 조립하기 
// set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.domElement : renderer가 갖고 있는 캔버스
document.body.appendChild(renderer.domElement); // dom 조립 또는 html 내 canvas 태그 내 붙이기 (활용범위가 더 넓음)
*/
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();

// Camera
// const camera = new THREE.PerspectiveCamera(
//   75, // fov(field of view, 시야각)
//   window.innerWidth / window.innerHeight, // aspect(종횡비)
//   0.1, // near
//   1000 // far
// );

// camera.position.x = 1;
// camera.position.z = 5;
// camera.position.y = 2;

/* Orthographic Camera 직교 카메라 - 롤 같은 게임에서 보는 뷰 */
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // 절두체의 left
  window.innerWidth / window.innerHeight, // right
  1, // top
  -1, // bottom
  0.1,
  1000
);

camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5; // z를 조정하면 perspective camera 와 다름, zoom을 조정 (+updateProjectMatrix )

camera.lookAt(0, 0, 0); // xyz로 정의된 position을 바라봄
camera.zoom = 0.5; // zoom out
camera.updateProjectionMatrix(); // 카메라 속성 update

scene.add(camera);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "#BA55D3",
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// render
renderer.render(scene, camera);
