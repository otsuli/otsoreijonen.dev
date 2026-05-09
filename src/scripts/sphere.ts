//@ts-ignore
import * as THREE from "three";
import { sphereShaderMaterial } from "./materials";

export function createSphere(scene: THREE.Scene, x = 0, y = 0, z = 0) {
  const geometry = new THREE.SphereGeometry(8, 128, 128);
  const sphere = new THREE.Mesh(geometry, sphereShaderMaterial);
  sphere.position.set(x, y, z);
  scene.add(sphere);
}
