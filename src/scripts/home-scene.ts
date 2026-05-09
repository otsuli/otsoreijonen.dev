//@ts-ignore
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSphere } from "./sphere";
import { sphereShaderMaterial } from "./materials";

export const scene = new THREE.Scene();

const canvas = document.getElementById("bg") as HTMLCanvasElement;
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
); // Arguments are: FOV, aspect ratio, near clipping plane (view frustum), far clipping plane (view frustum)
const renderer = new THREE.WebGLRenderer({ canvas });
// const controls = new OrbitControls(camera, renderer.domElement); // listens to dom events and updates the camera position accordingly

function initScene() {
  // Set up renderer properties
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000); // black background

  // Position camera along z-axis
  camera.position.setZ(30);

  const pointLight = new THREE.PointLight(0xffffff); // 0x means it's a hexadecimal value, ffffff is white
  pointLight.position.set(10, 10, 10);

  const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(pointLight, ambientLight);

  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;

  createSphere(scene, 0, 0, -5);
}

// Handle window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animiate() {
  requestAnimationFrame(animiate); // mechanism that tells the browser that you want to perform an animation
  sphereShaderMaterial.uniforms.iTime.value += 0.01;
  // controls.update();
  renderer.render(scene, camera);
}

initScene();
animiate();