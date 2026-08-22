import * as THREE from "three";
import { snowTexture } from "./textures.js";

function skyGradientTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, "#6fa8dc");
  grad.addColorStop(0.35, "#a9cbe8");
  grad.addColorStop(0.62, "#dcebf2");
  grad.addColorStop(0.75, "#f3ead9");
  grad.addColorStop(1.0, "#f7f4ee");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeMountainRidge(radius, height, segments, colorNear, colorFar, seed) {
  const shape = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const h = height * (0.45 + 0.55 * Math.pow(rand(), 1.4));
    shape.push({ angle, h });
  }
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const colNear = new THREE.Color(colorNear);
  const colFar = new THREE.Color(colorFar);
  for (let i = 0; i < segments; i++) {
    const a0 = shape[i].angle;
    const a1 = shape[i + 1].angle;
    const h0 = shape[i].h;
    const h1 = shape[i + 1].h;
    const x0 = Math.sin(a0) * radius, z0 = Math.cos(a0) * radius;
    const x1 = Math.sin(a1) * radius, z1 = Math.cos(a1) * radius;
    // two triangles: base->peak
    positions.push(x0, 0, z0, x1, 0, z1, x0, h0, z0);
    positions.push(x1, 0, z1, x1, h1, z1, x0, h0, z0);
    for (let k = 0; k < 6; k++) {
      colors.push(colNear.r, colNear.g, colNear.b);
    }
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    side: THREE.DoubleSide,
    fog: true,
  });
  return new THREE.Mesh(geo, mat);
}

export function buildSky(scene) {
  const skyTex = skyGradientTexture();
  const skyGeo = new THREE.SphereGeometry(180, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const mountains = new THREE.Group();
  mountains.add(makeMountainRidge(140, 55, 28, "#9fb3c4", "#c9d7e0", 7));
  mountains.add(makeMountainRidge(95, 38, 24, "#8ea3b0", "#9fb3c4", 23));
  const nearRidge = makeMountainRidge(60, 26, 20, "#7d93a1", "#8ea3b0", 51);
  mountains.add(nearRidge);
  scene.add(mountains);

  // Snowy ground extending outward around the building footprint.
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(150, 48),
    new THREE.MeshStandardMaterial({ map: snowTexture(40), roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  // Distant pines for scale/depth near the near ridge. Instanced (2 draw
  // calls total) since there are dozens of them and each is trivial geometry.
  const pineMat = new THREE.MeshStandardMaterial({ color: "#38513f", roughness: 1 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: "#3b2a1d", roughness: 1 });
  const TREE_COUNT = 40;
  const trunkMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.12, 1, 6), trunkMat, TREE_COUNT);
  const coneMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7), pineMat, TREE_COUNT);
  trunkMesh.castShadow = false;
  coneMesh.castShadow = true;
  let seed = 99;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const dummy = new THREE.Object3D();
  for (let i = 0; i < TREE_COUNT; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 22 + rand() * 30;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const h = 2.5 + rand() * 3;
    const trunkH = h * 0.25;

    dummy.position.set(x, trunkH / 2, z);
    dummy.scale.set(1, trunkH, 1);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);

    dummy.position.set(x, trunkH + (h * 0.75) / 2, z);
    dummy.scale.set(h * 0.28, h, h * 0.28);
    dummy.updateMatrix();
    coneMesh.setMatrixAt(i, dummy.matrix);
  }
  scene.add(trunkMesh, coneMesh);

  scene.fog = new THREE.Fog("#dcebf2", 30, 170);

  return { sky, mountains };
}
