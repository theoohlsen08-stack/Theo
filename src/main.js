import "./style.css";
import * as THREE from "three";
import { buildApartment } from "./apartment.js";
import { addFurniture } from "./furniture.js";
import { buildSky } from "./sky.js";
import { FirstPersonControls } from "./controls.js";
import { rooms, balcony, SPAWN } from "./data/floorplan.js";

const canvas = document.getElementById("scene");
const overlay = document.getElementById("overlay");
const crosshair = document.getElementById("crosshair");
const roomLabel = document.getElementById("room-label");
const minimapCanvas = document.getElementById("minimap");
const minimapCtx = minimapCanvas.getContext("2d");

// ---- Renderer / scene / camera ----------------------------------------

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 300);

buildSky(scene);

const ambient = new THREE.AmbientLight("#cfe0ea", 0.7);
scene.add(ambient);

const hemi = new THREE.HemisphereLight("#bcd6ea", "#7d6b52", 0.65);
scene.add(hemi);

const sun = new THREE.DirectionalLight("#fff2df", 1.7);
sun.position.set(-22, 20, 8);
sun.target.position.set(4.1, 0, 3.6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;
sun.shadow.camera.near = 5;
sun.shadow.camera.far = 55;
sun.shadow.bias = -0.0015;
scene.add(sun);
scene.add(sun.target);

const { group: apartmentGroup, colliders } = buildApartment();
scene.add(apartmentGroup);
addFurniture(scene);

// A pendant fixture (mesh only, cheap) in every room for a lived-in feel,
// but a real dynamic PointLight only where the sun doesn't reach directly
// (bathroom/hall/corridor have little or no window) — keeps the light count,
// and therefore per-pixel shading cost, low.
const pendantMat = new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.4, metalness: 0.5 });
const LIT_ROOMS = new Set(["badrum", "entre", "bastu"]);
for (const room of rooms) {
  const cx = (room.x1 + room.x2) / 2;
  const cz = (room.z1 + room.z2) / 2;
  if (LIT_ROOMS.has(room.id)) {
    const light = new THREE.PointLight("#ffe3bb", 1.1, 6, 2);
    light.position.set(cx, 2.3, cz);
    scene.add(light);
  }
  const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.12, 12), pendantMat);
  fixture.position.set(cx, 2.42, cz);
  scene.add(fixture);
}

// ---- Player controls ----------------------------------------------------

const controls = new FirstPersonControls(camera, canvas, colliders, SPAWN);
scene.add(controls.object);

overlay.addEventListener("click", () => controls.lock());
controls.onLockChange = (locked) => {
  overlay.classList.toggle("hidden", locked);
  crosshair.classList.toggle("visible", locked);
};

let minimapVisible = true;
minimapCanvas.classList.add("visible");
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyM") {
    minimapVisible = !minimapVisible;
    minimapCanvas.classList.toggle("visible", minimapVisible);
  }
});

function findRoom(x, z) {
  for (const room of rooms) {
    if (x >= room.x1 && x <= room.x2 && z >= room.z1 && z <= room.z2) return room.name;
  }
  if (x >= balcony.x1 && x <= balcony.x2 && z >= balcony.z1 && z <= balcony.z2) return "Balkong";
  return "Tegefjällsvägen 79";
}

// ---- Minimap --------------------------------------------------------------

const mapBounds = { minX: -2.0, maxX: 8.8, minZ: -0.5, maxZ: 7.9 };
function worldToMap(x, z) {
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;
  const rangeX = mapBounds.maxX - mapBounds.minX;
  const rangeZ = mapBounds.maxZ - mapBounds.minZ;
  const scale = Math.min(w / rangeX, h / rangeZ) * 0.92;
  const offX = (w - rangeX * scale) / 2;
  const offZ = (h - rangeZ * scale) / 2;
  return {
    x: offX + (x - mapBounds.minX) * scale,
    y: h - (offZ + (z - mapBounds.minZ) * scale),
    scale,
  };
}

function drawMinimap() {
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;
  minimapCtx.clearRect(0, 0, w, h);

  minimapCtx.fillStyle = "rgba(20,24,30,0.4)";
  minimapCtx.fillRect(0, 0, w, h);

  for (const room of rooms) {
    const p1 = worldToMap(room.x1, room.z1);
    const p2 = worldToMap(room.x2, room.z2);
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const rw = Math.abs(p2.x - p1.x);
    const rh = Math.abs(p2.y - p1.y);
    minimapCtx.fillStyle = room.floor.startsWith("tile") ? "rgba(180,195,200,0.55)" : "rgba(210,175,130,0.4)";
    minimapCtx.fillRect(x, y, rw, rh);
    minimapCtx.strokeStyle = "rgba(255,255,255,0.55)";
    minimapCtx.lineWidth = 1.5;
    minimapCtx.strokeRect(x, y, rw, rh);
  }
  const b1 = worldToMap(balcony.x1, balcony.z1);
  const b2 = worldToMap(balcony.x2, balcony.z2);
  minimapCtx.strokeStyle = "rgba(150,200,255,0.6)";
  minimapCtx.setLineDash([3, 3]);
  minimapCtx.strokeRect(Math.min(b1.x, b2.x), Math.min(b1.y, b2.y), Math.abs(b2.x - b1.x), Math.abs(b2.y - b1.y));
  minimapCtx.setLineDash([]);

  // Player
  const pos = controls.object.position;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const p = worldToMap(pos.x, pos.z);
  const heading = Math.atan2(dir.x, -dir.z);

  minimapCtx.save();
  minimapCtx.translate(p.x, p.y);
  minimapCtx.rotate(heading);
  minimapCtx.fillStyle = "#ffd9a0";
  minimapCtx.beginPath();
  minimapCtx.moveTo(0, -8);
  minimapCtx.lineTo(5, 6);
  minimapCtx.lineTo(-5, 6);
  minimapCtx.closePath();
  minimapCtx.fill();
  minimapCtx.restore();
}

// ---- Resize -----------------------------------------------------------

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Main loop ----------------------------------------------------------

if (import.meta.env.DEV) {
  // Test/debug hook only — statically eliminated from production builds.
  window.__debug = { controls, scene, camera, colliders };
}

const timer = new THREE.Timer();
timer.connect(document);
let lastLabel = "";

function animate(timestamp) {
  requestAnimationFrame(animate);
  timer.update(timestamp);
  const delta = Math.min(timer.getDelta(), 0.1);

  controls.update(delta);

  const pos = controls.object.position;
  const label = findRoom(pos.x, pos.z);
  if (label !== lastLabel) {
    roomLabel.textContent = label;
    lastLabel = label;
  }

  if (minimapVisible) drawMinimap();

  renderer.render(scene, camera);
}

animate();
