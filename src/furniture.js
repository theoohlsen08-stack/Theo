import * as THREE from "three";
import { fabricTexture, saunaWoodTexture, rugTexture } from "./textures.js";

const woodMat = new THREE.MeshStandardMaterial({ color: "#caa06b", roughness: 0.6 });
const darkWoodMat = new THREE.MeshStandardMaterial({ color: "#4a3626", roughness: 0.55 });
const whiteMat = new THREE.MeshStandardMaterial({ color: "#f6f5f1", roughness: 0.7 });
const counterMat = new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.3 });
const blackMat = new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.5, metalness: 0.3 });
const metalMat = new THREE.MeshStandardMaterial({ color: "#c9cdd1", roughness: 0.3, metalness: 0.8 });
const sofaFabric = new THREE.MeshStandardMaterial({ map: fabricTexture("#5c7089"), roughness: 0.9 });
const bedFabric1 = new THREE.MeshStandardMaterial({ map: fabricTexture("#e7e2d6"), roughness: 0.9 });
const bedFabric2 = new THREE.MeshStandardMaterial({ map: fabricTexture("#c7d3d8"), roughness: 0.9 });
const bedFabric3 = new THREE.MeshStandardMaterial({ map: fabricTexture("#d8c9b8"), roughness: 0.9 });
const saunaWood = new THREE.MeshStandardMaterial({ map: saunaWoodTexture(1.5), roughness: 0.75 });
const ceramicMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.15 });
const glassTop = new THREE.MeshPhysicalMaterial({ color: "#dfeef2", transparent: true, opacity: 0.35, roughness: 0.05, transmission: 0.8 });

function group(x, z, rotY = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  return g;
}

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function cyl(rTop, rBot, h, mat, x = 0, y = 0, z = 0, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// ---- Reusable pieces -------------------------------------------------

function makeBed(w, l, fabric) {
  const g = new THREE.Group();
  const frameH = 0.28;
  g.add(box(w, frameH, l, darkWoodMat, 0, frameH / 2, 0));
  g.add(box(w * 0.94, 0.18, l * 0.94, fabric, 0, frameH + 0.09, 0));
  g.add(box(w, 0.55, 0.1, whiteMat, 0, frameH + 0.55 / 2, -l / 2 + 0.05)); // headboard
  const pillowMat = whiteMat;
  g.add(box(w * 0.38, 0.1, 0.34, pillowMat, -w * 0.22, frameH + 0.23, -l / 2 + 0.32));
  if (w > 1.2) g.add(box(w * 0.38, 0.1, 0.34, pillowMat, w * 0.22, frameH + 0.23, -l / 2 + 0.32));
  return g;
}

function makeBunkBed() {
  const g = new THREE.Group();
  const w = 0.95, l = 1.95;
  const postMat = darkWoodMat;
  const offsets = [
    [-w / 2 + 0.05, -l / 2 + 0.05],
    [w / 2 - 0.05, -l / 2 + 0.05],
    [-w / 2 + 0.05, l / 2 - 0.05],
    [w / 2 - 0.05, l / 2 - 0.05],
  ];
  for (const [x, z] of offsets) g.add(cyl(0.05, 0.05, 1.7, postMat, x, 0.85, z));
  g.add(box(w, 0.15, l, darkWoodMat, 0, 0.35, 0));
  g.add(box(w * 0.9, 0.15, l * 0.9, bedFabric2, 0, 0.45, 0));
  g.add(box(w, 0.15, l, darkWoodMat, 0, 1.35, 0));
  g.add(box(w * 0.9, 0.15, l * 0.9, bedFabric2, 0, 1.45, 0));
  g.add(box(w, 0.3, 0.08, whiteMat, 0, 1.75, -l / 2 + 0.04));
  return g;
}

function makeNightstand(x, y, z) {
  const g = group(x, z);
  g.add(box(0.4, 0.45, 0.35, woodMat, 0, 0.225, 0));
  // Emissive-only lamp shade (no dynamic PointLight) — keeps total scene
  // light count low for performance while still reading as "lit".
  g.add(cyl(0.08, 0.08, 0.22, new THREE.MeshStandardMaterial({ color: "#fff3d6", emissive: "#ffb463", emissiveIntensity: 1.1 }), 0, 0.56, 0));
  return g;
}

function makeWardrobe(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 2.0, 0.6, darkWoodMat, 0, 1.0, 0));
  for (let i = 1; i < w / 0.6; i++) {
    g.add(box(0.02, 2.0, 0.6, blackMat, -w / 2 + i * 0.6, 1.0, 0.31));
  }
  return g;
}

function makeDesk(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(1.0, 0.05, 0.55, woodMat, 0, 0.72, 0));
  g.add(box(0.05, 0.72, 0.5, darkWoodMat, -0.46, 0.36, 0));
  g.add(box(0.05, 0.72, 0.5, darkWoodMat, 0.46, 0.36, 0));
  const chair = makeChair();
  chair.position.set(0, 0, 0.45);
  chair.rotation.y = Math.PI;
  g.add(chair);
  return g;
}

function makeChair(mat = darkWoodMat) {
  const g = new THREE.Group();
  g.add(box(0.42, 0.05, 0.42, mat, 0, 0.46, 0));
  g.add(box(0.42, 0.5, 0.05, mat, 0, 0.71, -0.19));
  for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
    g.add(cyl(0.02, 0.02, 0.46, mat, x, 0.23, z));
  }
  return g;
}

function makeDiningSet(x, z) {
  const g = group(x, z);
  g.add(box(1.5, 0.06, 0.9, woodMat, 0, 0.74, 0));
  for (const [dx, dz] of [[-0.65, -0.35], [0.65, -0.35], [-0.65, 0.35], [0.65, 0.35]]) {
    g.add(cyl(0.04, 0.04, 0.74, darkWoodMat, dx, 0.37, dz));
  }
  const seats = [
    [0, -0.65, 0],
    [0, 0.65, Math.PI],
    [-0.95, 0, Math.PI / 2],
    [0.95, 0, -Math.PI / 2],
  ];
  for (const [dx, dz, rot] of seats) {
    const c = makeChair();
    c.position.set(dx, 0, dz);
    c.rotation.y = rot;
    g.add(c);
  }
  return g;
}

function makeKitchen(x, z, lengthZ) {
  // Runs along local +z, counter face toward -x (into the room)
  const g = group(x, z);
  g.add(box(0.6, 0.9, lengthZ, counterMat, 0, 0.45, 0));
  g.add(box(0.62, 0.05, lengthZ + 0.05, blackMat, 0, 0.91, 0)); // countertop lip
  for (let i = 0; i < lengthZ / 0.6; i++) {
    g.add(box(0.02, 0.85, 0.02, blackMat, -0.3, 0.45, -lengthZ / 2 + 0.3 + i * 0.6));
  }
  g.add(box(0.62, 0.7, lengthZ * 0.55, whiteMat, 0, 1.75, -lengthZ * 0.15)); // upper cabinets
  // hob + sink cutouts (visual only)
  g.add(box(0.45, 0.02, 0.3, blackMat, 0.05, 0.92, -lengthZ * 0.3));
  g.add(box(0.4, 0.05, 0.28, metalMat, 0.05, 0.92, lengthZ * 0.15));
  // extractor hood
  const hood = box(0.5, 0.3, 0.5, metalMat, 0.05, 1.55, -lengthZ * 0.3);
  g.add(hood);
  return g;
}

function makeSofa(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.4, 0.85, sofaFabric, 0, 0.2, 0));
  g.add(box(w, 0.45, 0.22, sofaFabric, 0, 0.42, -0.32));
  g.add(box(0.22, 0.55, 0.85, sofaFabric, -w / 2 + 0.11, 0.28, 0));
  g.add(box(0.22, 0.55, 0.85, sofaFabric, w / 2 - 0.11, 0.28, 0));
  const cushions = Math.round(w / 0.7);
  for (let i = 0; i < cushions; i++) {
    g.add(box(w / cushions - 0.06, 0.16, 0.75, sofaFabric, -w / 2 + w / cushions * (i + 0.5), 0.48, 0.02));
  }
  return g;
}

function makeCoffeeTable(x, z) {
  const g = group(x, z);
  g.add(box(1.0, 0.04, 0.55, glassTop, 0, 0.38, 0));
  for (const [dx, dz] of [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]]) {
    g.add(cyl(0.02, 0.02, 0.38, blackMat, dx, 0.19, dz));
  }
  return g;
}

function makeRug(w, d, x, z, color) {
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: rugTexture(color), roughness: 1 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(x, 0.01, z);
  rug.receiveShadow = true;
  return rug;
}

function makeTVConsole(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(1.4, 0.45, 0.4, darkWoodMat, 0, 0.225, 0));
  const tv = box(1.1, 0.65, 0.04, blackMat, 0, 0.78, -0.05);
  g.add(tv);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.02, 0.58),
    new THREE.MeshStandardMaterial({ color: "#0d1b26", emissive: "#13324a", emissiveIntensity: 0.5 })
  );
  screen.position.set(0, 0.78, -0.02);
  g.add(screen);
  return g;
}

function makeSaunaCabin(x, z, rotY) {
  const g = group(x, z, rotY);
  const w = 1.15, d = 1.15, h = 2.0;
  const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), saunaWood);
  walls.position.y = h / 2;
  g.add(walls);
  // carve a glass door look by overlaying a darker front panel
  const door = box(0.55, h - 0.3, 0.03, new THREE.MeshPhysicalMaterial({ color: "#20211f", transparent: true, opacity: 0.55, roughness: 0.2, transmission: 0.4 }), 0, h / 2, d / 2 + 0.005);
  g.add(door);
  // bench inside
  g.add(box(w - 0.2, 0.08, 0.4, saunaWood, 0, 0.45, -d / 2 + 0.3));
  // heater
  g.add(box(0.3, 0.5, 0.3, blackMat, 0, 0.25, 0.1));
  const glow = new THREE.PointLight("#ff6a2c", 1.2, 1.5, 2);
  glow.position.set(0, 0.5, 0.1);
  g.add(glow);
  return g;
}

function makeVanity(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(0.9, 0.02, 0.5, counterMat, 0, 0.85, 0));
  g.add(box(0.5, 0.8, 0.45, whiteMat, 0, 0.42, 0));
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.12, 20), ceramicMat);
  basin.position.set(0, 0.9, 0);
  g.add(basin);
  const mirror = box(0.55, 0.7, 0.02, new THREE.MeshStandardMaterial({ color: "#bcd3da", metalness: 0.6, roughness: 0.1 }), 0, 1.5, -0.02);
  g.add(mirror);
  const tap = cyl(0.015, 0.015, 0.2, metalMat, 0, 1.0, -0.15);
  g.add(tap);
  return g;
}

function makeToilet(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(0.38, 0.38, 0.5, ceramicMat, 0, 0.19, 0));
  g.add(cyl(0.19, 0.19, 0.42, ceramicMat, 0, 0.42, -0.05));
  g.add(box(0.42, 0.12, 0.18, ceramicMat, 0, 0.66, -0.22));
  return g;
}

function makeShower(x, z, w, d) {
  const g = group(x, z);
  const tray = box(w, 0.05, d, new THREE.MeshStandardMaterial({ color: "#dfe2e2", roughness: 0.4 }), 0, 0.025, 0);
  g.add(tray);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#dff1f5", transparent: true, opacity: 0.15, roughness: 0.05, transmission: 0.9, side: THREE.DoubleSide });
  g.add(box(w, 2.0, 0.02, glass, 0, 1.0, -d / 2));
  g.add(box(0.02, 2.0, d, glass, -w / 2, 1.0, 0));
  const head = cyl(0.06, 0.06, 0.04, metalMat, 0, 2.05, -d / 2 + 0.05);
  head.rotation.x = Math.PI / 2;
  g.add(head);
  return g;
}

function makeBench(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.42, 0.35, woodMat, 0, 0.21, 0));
  for (const [dx] of [[-w / 2 + 0.05], [w / 2 - 0.05]]) g.add(box(0.05, 0.4, 0.3, darkWoodMat, dx, 0.2, 0));
  // hooks + shoe cubbies above
  const cubby = box(w, 0.35, 0.3, whiteMat, 0, 1.7, -0.02);
  g.add(cubby);
  for (let i = 0; i < Math.floor(w / 0.35); i++) {
    const hook = cyl(0.015, 0.015, 0.08, metalMat, -w / 2 + 0.2 + i * 0.35, 1.45, 0.14);
    hook.rotation.x = Math.PI / 2;
    g.add(hook);
  }
  return g;
}

function makeOutdoorSet(x, z, rotY) {
  const g = group(x, z, rotY);
  const table = box(0.7, 0.04, 0.7, metalMat, 0, 0.7, 0);
  g.add(table);
  g.add(cyl(0.03, 0.03, 0.7, metalMat, 0, 0.35, 0));
  for (const [dx, dz] of [[-0.55, 0], [0.55, 0]]) {
    const chair = makeChair(metalMat);
    chair.position.set(dx, 0, dz);
    chair.rotation.y = dx < 0 ? Math.PI / 2 : -Math.PI / 2;
    g.add(chair);
  }
  return g;
}

function makeMirror(w, h, x, y, z, rotY) {
  const g = group(x, z, rotY);
  const m = box(w, h, 0.02, new THREE.MeshStandardMaterial({ color: "#c7dee6", metalness: 0.7, roughness: 0.08 }), 0, y, 0);
  g.add(m);
  return g;
}

// ---- Room assembly ----------------------------------------------------

export function addFurniture(scene) {
  const g = new THREE.Group();

  // Living / kitchen (0,0)-(6.0,3.2)
  g.add(makeKitchen(5.65, 1.6, 2.6));
  const dining = makeDiningSet(3.1, 1.55);
  dining.rotation.y = Math.PI / 2;
  g.add(dining);
  g.add(makeRug(2.6, 1.9, 1.55, 2.35, "#9c3b3b"));
  const sofa = makeSofa(2.0, 1.55, 2.75, Math.PI);
  g.add(sofa);
  g.add(makeCoffeeTable(1.55, 2.15));
  const tv = makeTVConsole(0.35, 1.6, Math.PI / 2);
  g.add(tv);

  // Bedroom 1 — large, master (6.0,0)-(8.6,3.2)
  const bed1 = makeBed(1.6, 2.0, bedFabric1);
  bed1.rotation.y = Math.PI / 2;
  bed1.position.set(8.15, 0, 1.6);
  g.add(bed1);
  g.add(makeNightstand(8.15, 0, 0.35));
  g.add(makeNightstand(8.15, 0, 2.85));
  g.add(makeWardrobe(1.6, 6.85, 3.05, 0));

  // Corridor (0,3.2)-(8.6,4.1) — runner rug
  g.add(makeRug(7.6, 0.7, 4.3, 3.65, "#5c6b7a"));

  // Bathroom & sauna (0,4.1)-(2.4,6.8)
  g.add(makeVanity(0.55, 4.5, Math.PI / 2));
  g.add(makeMirror(0.5, 0.7, 0.05, 1.5, 4.5, Math.PI / 2));
  g.add(makeToilet(0.4, 6.55, 0));
  g.add(makeShower(1.75, 6.15, 1.1, 1.1));
  g.add(makeSaunaCabin(1.8, 4.75, Math.PI));

  // Entry (2.4,4.1)-(4.6,6.8)
  const bench = makeBench(1.6, 3.5, 6.5, 0);
  g.add(bench);
  g.add(makeMirror(0.6, 0.9, 4.35, 1.5, 5.0, -Math.PI / 2));

  // Bedroom 2 — bunk room (4.6,4.1)-(6.6,6.8)
  const bunk = makeBunkBed();
  bunk.position.set(5.15, 0, 6.35);
  g.add(bunk);
  g.add(makeNightstand(6.15, 0, 6.35));
  g.add(makeWardrobe(1.0, 5.6, 4.35, Math.PI));

  // Bedroom 3 (6.6,4.1)-(8.6,6.8)
  const bed3 = makeBed(1.0, 2.0, bedFabric3);
  bed3.position.set(8.15, 0, 6.35);
  g.add(bed3);
  g.add(makeDesk(6.95, 4.7, Math.PI / 2));
  g.add(makeNightstand(8.15, 0, 5.25));

  // Balcony
  g.add(makeOutdoorSet(2.4, -0.75, 0));

  scene.add(g);
  return g;
}
