import * as THREE from "three";
import {
  fabricTexture,
  saunaWoodTexture,
  rugTexture,
  subwayTileTexture,
  checkerTexture,
  plaidTexture,
} from "./textures.js";

const woodMat = new THREE.MeshStandardMaterial({ color: "#caa06b", roughness: 0.6 });
const darkWoodMat = new THREE.MeshStandardMaterial({ color: "#4a3626", roughness: 0.55 });
const midWoodMat = new THREE.MeshStandardMaterial({ color: "#8a6a48", roughness: 0.5 });
const whiteMat = new THREE.MeshStandardMaterial({ color: "#f6f5f1", roughness: 0.7 });
const counterMat = new THREE.MeshStandardMaterial({ color: "#9a9a96", roughness: 0.35 });
const grayCabinetMat = new THREE.MeshStandardMaterial({ color: "#8b8f92", roughness: 0.45 });
const blackMat = new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.5, metalness: 0.3 });
// Kept low-metalness (no environment map is set up for real reflections —
// high metalness + low roughness with only point/directional lights blows
// out to a washed-white panel instead of looking metallic).
const metalMat = new THREE.MeshStandardMaterial({ color: "#c3c7ca", roughness: 0.4, metalness: 0.25 });
const steelMat = new THREE.MeshStandardMaterial({ color: "#cdd0d1", roughness: 0.35, metalness: 0.25 });
const sofaFabric = new THREE.MeshStandardMaterial({ map: fabricTexture("#7a7d82"), roughness: 0.9 });
const bedFabric2 = new THREE.MeshStandardMaterial({ map: fabricTexture("#c9c6bd"), roughness: 0.9 });
const bedFabric3 = new THREE.MeshStandardMaterial({ map: fabricTexture("#c9c6bd"), roughness: 0.9 });
const plaidMat = new THREE.MeshStandardMaterial({ map: plaidTexture(), roughness: 0.95 });
const furMat = new THREE.MeshStandardMaterial({ color: "#e7e2d6", roughness: 1 });
const saunaWood = new THREE.MeshStandardMaterial({ map: saunaWoodTexture(1.5), roughness: 0.75 });
const saunaWoodWall = new THREE.MeshStandardMaterial({ map: saunaWoodTexture(2.2), roughness: 0.8 });
const ceramicMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.15 });
const glassTop = new THREE.MeshPhysicalMaterial({ color: "#dfeef2", transparent: true, opacity: 0.35, roughness: 0.05, transmission: 0.8 });
const subwayMat = new THREE.MeshStandardMaterial({ map: subwayTileTexture(2.5), roughness: 0.25 });
const antlerMat = new THREE.MeshStandardMaterial({ color: "#efe9dd", roughness: 0.55 });
const checkerMat = new THREE.MeshStandardMaterial({ map: checkerTexture("#1c1c1c", "#efe9df", 6), roughness: 0.95, side: THREE.DoubleSide });
const navyCurtainMat = new THREE.MeshStandardMaterial({ map: fabricTexture("#2b3038"), roughness: 0.95, side: THREE.DoubleSide });

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

function picture(w, h, color, x, y, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w + 0.05, h + 0.05, 0.02, darkWoodMat, 0, y, 0));
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
  canvas.position.set(0, y, 0.015);
  g.add(canvas);
  return g;
}

function floatingCabinet(w, x, y, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.3, 0.28, midWoodMat, 0, y, 0));
  g.add(box(w - 0.03, 0.02, 0.29, blackMat, 0, y - 0.14, 0));
  return g;
}

function wallLamp(x, y, z, rotY) {
  const g = group(x, z, rotY);
  g.add(cyl(0.02, 0.02, 0.18, blackMat, 0, y, 0.05).rotateX(Math.PI / 2));
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.1, 12, 1, true), blackMat);
  shade.position.set(0, y, 0.16);
  shade.rotation.x = Math.PI / 2.4;
  g.add(shade);
  const light = new THREE.PointLight("#ffdca0", 0.5, 2, 2);
  light.position.set(0, y, 0.2);
  g.add(light);
  return g;
}

function crossedSkis(x, y, z, rotY) {
  const g = group(x, z, rotY);
  const ski = (rot, dz) => {
    const s = box(0.09, 1.5, 0.02, woodMat, 0, y, dz);
    s.rotation.z = rot;
    return s;
  };
  g.add(ski(0.28, -0.05));
  g.add(ski(-0.28, 0.05));
  return g;
}

function antlerChandelier(x, y, z) {
  const g = group(x, z);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), antlerMat);
  core.position.y = y;
  g.add(core);
  let seed = Math.round(x * 97 + z * 13) || 3;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const tilt = 0.3 + rand() * 0.5;
    const len = 0.22 + rand() * 0.18;
    const branch = new THREE.Mesh(new THREE.ConeGeometry(0.018, len, 5), antlerMat);
    branch.position.set(Math.cos(angle) * len * 0.4, y - tilt * 0.1, Math.sin(angle) * len * 0.4);
    branch.rotation.z = Math.cos(angle) * 1.3;
    branch.rotation.x = Math.sin(angle) * 1.3 + 1.4;
    g.add(branch);
  }
  const chain = cyl(0.008, 0.008, 0.45, blackMat, 0, y + 0.25, 0);
  g.add(chain);
  const light = new THREE.PointLight("#fff0d8", 1.0, 5, 2);
  light.position.set(0, y - 0.1, 0);
  g.add(light);
  return g;
}

function curtainPair(width, height, x, y, z, rotY, mat = navyCurtainMat) {
  const g = group(x, z, rotY);
  const panelW = width * 0.32;
  g.add(box(panelW, height, 0.02, mat, -width / 2 + panelW / 2 - 0.05, y, 0));
  g.add(box(panelW, height, 0.02, mat, width / 2 - panelW / 2 + 0.05, y, 0));
  g.add(box(width + 0.1, 0.04, 0.03, blackMat, 0, y + height / 2, 0));
  return g;
}

// ---- Reusable pieces -------------------------------------------------

function makeBed(w, l, fabric, { plaid = false, fur = false } = {}) {
  const g = new THREE.Group();
  const frameH = 0.28;
  g.add(box(w, frameH, l, darkWoodMat, 0, frameH / 2, 0));
  g.add(box(w * 0.94, 0.18, l * 0.94, fabric, 0, frameH + 0.09, 0));
  g.add(box(w, 0.55, 0.1, whiteMat, 0, frameH + 0.55 / 2, -l / 2 + 0.05));
  if (plaid) {
    g.add(box(w * 0.9, 0.03, l * 0.55, plaidMat, 0, frameH + 0.2, l * 0.15));
  }
  if (fur) {
    g.add(box(w * 0.92, 0.06, l * 0.4, furMat, 0, frameH + 0.21, l * 0.35));
  }
  const pillowMat = whiteMat;
  g.add(box(w * 0.38, 0.1, 0.34, pillowMat, -w * 0.22, frameH + 0.23, -l / 2 + 0.32));
  if (w > 1.2) g.add(box(w * 0.38, 0.1, 0.34, pillowMat, w * 0.22, frameH + 0.23, -l / 2 + 0.32));
  return g;
}

function makeNightstand(x, y, z, dark = true) {
  const g = group(x, z);
  g.add(box(0.4, 0.45, 0.35, dark ? darkWoodMat : whiteMat, 0, 0.225, 0));
  return g;
}

function makeChestOfDrawers(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.55, 0.42, whiteMat, 0, 0.275, 0));
  for (let i = 0; i < 2; i++) {
    g.add(box(w - 0.06, 0.02, 0.03, blackMat, 0, 0.15 + i * 0.25, 0.21));
  }
  return g;
}

function makeWardrobe(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 2.0, 0.6, whiteMat, 0, 1.0, 0));
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.4, 1.7), new THREE.MeshStandardMaterial({ color: "#aec4cc", metalness: 0.1, roughness: 0.25 }));
  mirror.position.set(-w * 0.2, 1.0, 0.31);
  g.add(mirror);
  return g;
}

function makeChair(mat = whiteMat, crossback = true) {
  const g = new THREE.Group();
  g.add(box(0.42, 0.05, 0.42, mat, 0, 0.46, 0));
  if (crossback) {
    g.add(box(0.42, 0.4, 0.04, mat, 0, 0.68, -0.19));
    const bar = box(0.5, 0.04, 0.04, mat, 0, 0.7, -0.19);
    bar.rotation.z = 0.6;
    g.add(bar);
    const bar2 = box(0.5, 0.04, 0.04, mat, 0, 0.7, -0.19);
    bar2.rotation.z = -0.6;
    g.add(bar2);
  } else {
    g.add(box(0.42, 0.5, 0.05, mat, 0, 0.71, -0.19));
  }
  for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
    g.add(cyl(0.02, 0.02, 0.46, darkWoodMat, x, 0.23, z));
  }
  return g;
}

function makeRoundDiningSet(x, z) {
  const g = group(x, z);
  g.add(cyl(0.55, 0.55, 0.05, whiteMat, 0, 0.74, 0, 24));
  g.add(cyl(0.08, 0.1, 0.7, whiteMat, 0, 0.37, 0));
  g.add(cyl(0.3, 0.3, 0.03, darkWoodMat, 0, 0.03, 0, 24));
  const seats = 4;
  for (let i = 0; i < seats; i++) {
    const angle = (i / seats) * Math.PI * 2 + Math.PI / 4;
    const c = makeChair(whiteMat, true);
    c.position.set(Math.cos(angle) * 0.85, 0, Math.sin(angle) * 0.85);
    c.rotation.y = -angle + Math.PI / 2;
    g.add(c);
  }
  return g;
}

function makeKitchenRun(x, z, lengthZ, rotY) {
  // Single-wall run of base + upper cabinets facing -X (into the room).
  const g = group(x, z, rotY);
  g.add(box(0.6, 0.9, lengthZ, grayCabinetMat, 0, 0.45, 0));
  for (let i = 0; i < lengthZ / 0.55; i++) {
    g.add(box(0.02, 0.85, 0.02, blackMat, -0.3, 0.45, -lengthZ / 2 + 0.28 + i * 0.55));
  }
  g.add(box(0.63, 0.05, lengthZ + 0.02, counterMat, 0, 0.925, 0));
  g.add(box(0.35, lengthZ - 0.1, 0.01, subwayMat, -0.315, 1.15, 0).rotateY(Math.PI / 2));
  g.add(box(0.6, 0.75, lengthZ * 0.6, grayCabinetMat, 0, 1.75, -lengthZ * 0.15));
  const hood = box(0.5, 0.15, 0.5, metalMat, 0.05, 1.42, -lengthZ * 0.32);
  g.add(hood);
  g.add(box(0.5, 0.02, 0.35, blackMat, 0.05, 0.95, -lengthZ * 0.32));
  const fridge = box(0.62, 1.85, 0.62, steelMat, 0, 0.925, lengthZ / 2 + 0.32);
  g.add(fridge);
  g.add(box(0.6, 0.02, 0.6, blackMat, 0, 1.5, lengthZ / 2 + 0.32));
  const sinkBasin = box(0.4, 0.03, 0.28, metalMat, 0.05, 0.93, 0.02);
  g.add(sinkBasin);
  const tap = cyl(0.012, 0.012, 0.2, metalMat, 0.05, 1.02, -0.12);
  g.add(tap);
  const oven = box(0.55, 0.55, 0.02, steelMat, 0.29, 0.35, lengthZ * 0.35 - 0.02);
  g.add(oven);
  return g;
}

function makeSofa(w, d, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.4, d, sofaFabric, 0, 0.2, 0));
  g.add(box(w, 0.45, 0.22, sofaFabric, 0, 0.42, -d / 2 + 0.11));
  g.add(box(0.22, 0.55, d, sofaFabric, -w / 2 + 0.11, 0.28, 0));
  g.add(box(0.22, 0.55, d, sofaFabric, w / 2 - 0.11, 0.28, 0));
  const cushions = Math.max(2, Math.round(w / 0.7));
  for (let i = 0; i < cushions; i++) {
    g.add(box(w / cushions - 0.06, 0.16, d - 0.5, sofaFabric, -w / 2 + (w / cushions) * (i + 0.5), 0.48, 0.02));
  }
  return g;
}

function makeChaise(w, d, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.4, d, sofaFabric, 0, 0.2, 0));
  g.add(box(w, 0.42, 0.22, sofaFabric, 0, 0.4, -d / 2 + 0.11));
  g.add(box(0.22, 0.55, d, sofaFabric, -w / 2 + 0.11, 0.28, 0));
  g.add(box(w - 0.2, 0.14, d - 0.3, sofaFabric, 0.06, 0.48, 0.05));
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

function makeRoundRug(r, x, z, color = "#c7c4bc") {
  const rug = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshStandardMaterial({ color, roughness: 1 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(x, 0.01, z);
  rug.receiveShadow = true;
  return rug;
}

function makeTVConsole(x, z, rotY) {
  const g = group(x, z, rotY);
  const post = box(0.08, 1.1, 0.25, blackMat, 0, 0.55, 0);
  g.add(post);
  g.add(box(0.35, 0.05, 0.3, blackMat, 0, 0.15, 0));
  const tv = box(1.05, 0.62, 0.04, blackMat, 0, 1.15, -0.02);
  g.add(tv);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 0.55),
    new THREE.MeshStandardMaterial({ color: "#0d1b26", emissive: "#13324a", emissiveIntensity: 0.5 })
  );
  screen.position.set(0, 1.15, 0);
  g.add(screen);
  const stool = group(0.5, 0.3);
  stool.add(box(0.32, 0.4, 0.32, midWoodMat, 0, 0.2, 0));
  g.add(stool);
  return g;
}

function makeSaunaCabin(x, z) {
  const g = group(x, z);
  // Interior wood cladding lining the room's own walls (visual only).
  g.add(box(1.2, 2.0, 0.03, saunaWoodWall, 0, 1.0, 1.09));
  g.add(box(1.2, 2.0, 0.03, saunaWoodWall, 0, 1.0, -1.09));
  g.add(box(0.03, 2.0, 2.2, saunaWoodWall, 0.59, 1.0, 0));
  g.add(box(0.03, 2.0, 2.2, saunaWoodWall, -0.59, 1.0, 0));
  g.add(box(1.2, 0.06, 2.2, saunaWood, 0, 0.5, 0));
  // Bench
  g.add(box(1.1, 0.08, 0.5, saunaWood, 0, 0.48, -0.75));
  g.add(box(1.1, 0.08, 0.5, saunaWood, 0, 0.85, -0.75));
  // Heater
  g.add(box(0.32, 0.5, 0.32, blackMat, 0.35, 0.25, 0.75));
  const glow = new THREE.PointLight("#ff6a2c", 1.3, 1.8, 2);
  glow.position.set(0.35, 0.5, 0.75);
  g.add(glow);
  const bucket = cyl(0.09, 0.07, 0.14, midWoodMat, -0.4, 0.94, -0.75);
  g.add(bucket);
  return g;
}

function makeVanity(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.02, 0.5, counterMat, 0, 0.85, 0));
  g.add(box(w * 0.7, 0.8, 0.45, whiteMat, -w * 0.15, 0.42, 0));
  const basin = box(w * 0.55, 0.1, 0.4, ceramicMat, 0.05, 0.9, 0);
  g.add(basin);
  const mirrorCab = box(w * 0.6, 0.7, 0.1, new THREE.MeshStandardMaterial({ color: "#aec4cc", metalness: 0.1, roughness: 0.25 }), 0, 1.5, -0.02);
  g.add(mirrorCab);
  const light = new THREE.PointLight("#eaf6ff", 0.6, 2, 2);
  light.position.set(0, 1.85, 0.1);
  g.add(light);
  const tap = cyl(0.015, 0.015, 0.2, metalMat, 0.05, 1.0, -0.15);
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

function makeShower(x, z, w, d, rotY) {
  const g = group(x, z, rotY);
  const tray = box(w, 0.05, d, new THREE.MeshStandardMaterial({ color: "#c7cbcb", roughness: 0.4 }), 0, 0.025, 0);
  g.add(tray);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#dff1f5", transparent: true, opacity: 0.15, roughness: 0.05, transmission: 0.9, side: THREE.DoubleSide });
  g.add(box(w, 2.0, 0.02, glass, 0, 1.0, -d / 2));
  g.add(box(0.02, 2.0, d, glass, -w / 2, 1.0, 0));
  g.add(box(0.02, 2.0, d, glass, w / 2, 1.0, 0));
  const head = cyl(0.07, 0.07, 0.04, metalMat, 0, 2.05, -d / 2 + 0.06);
  head.rotation.x = Math.PI / 2;
  g.add(head);
  const arm = cyl(0.012, 0.012, 0.25, metalMat, 0, 1.95, -d / 2 + 0.12);
  arm.rotation.x = Math.PI / 2;
  g.add(arm);
  return g;
}

function makeWasher(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(0.6, 0.85, 0.6, whiteMat, 0, 0.425, 0));
  const door = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), new THREE.MeshStandardMaterial({ color: "#1c1c1e", roughness: 0.2, metalness: 0.2 }));
  door.position.set(0, 0.42, 0.31);
  door.rotation.y = Math.PI;
  g.add(door);
  g.add(cyl(0.21, 0.21, 0.02, metalMat, 0, 0.42, 0.3));
  return g;
}

function makeBench(w, x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.42, 0.35, grayCabinetMat, 0, 0.21, 0));
  for (const dx of [-w / 2 + 0.05, w / 2 - 0.05]) g.add(box(0.05, 0.4, 0.3, darkWoodMat, dx, 0.2, 0));
  return g;
}

function makeCubbies(w, x, y, z, rotY) {
  const g = group(x, z, rotY);
  const rows = 4;
  for (let i = 0; i < rows; i++) {
    g.add(box(w, 0.03, 0.22, whiteMat, 0, y - i * 0.28, 0));
    g.add(box(w, 0.22, 0.02, whiteMat, 0, y - i * 0.28 - 0.11, -0.1));
  }
  g.add(box(0.03, rows * 0.28, 0.22, whiteMat, -w / 2, y - (rows * 0.28) / 2 + 0.14, 0));
  return g;
}

function makeCoatHooks(w, x, y, z, rotY, count = 5) {
  const g = group(x, z, rotY);
  g.add(box(w, 0.06, 0.03, whiteMat, 0, y, 0));
  for (let i = 0; i < count; i++) {
    const hx = -w / 2 + (w / count) * (i + 0.5);
    const hook = cyl(0.012, 0.012, 0.07, blackMat, hx, y - 0.06, 0.02);
    hook.rotation.x = Math.PI / 2.3;
    g.add(hook);
  }
  return g;
}

function makeOutdoorSet(x, z, rotY) {
  const g = group(x, z, rotY);
  g.add(box(0.7, 0.04, 0.7, metalMat, 0, 0.7, 0));
  g.add(cyl(0.03, 0.03, 0.7, metalMat, 0, 0.35, 0));
  for (const [dx, dz] of [[-0.55, 0], [0.55, 0]]) {
    const chair = makeChair(metalMat, false);
    chair.position.set(dx, 0, dz);
    chair.rotation.y = dx < 0 ? Math.PI / 2 : -Math.PI / 2;
    g.add(chair);
  }
  return g;
}

function candleHolder(x, y, z, h = 0.2) {
  const g = group(x, z);
  g.add(cyl(0.02, 0.03, h, blackMat, 0, y + h / 2, 0));
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshStandardMaterial({ color: "#ffdca0", emissive: "#ffb347", emissiveIntensity: 1 }));
  flame.position.set(0, y + h + 0.02, 0);
  g.add(flame);
  return g;
}

// ---- Room assembly ----------------------------------------------------

export function addFurniture(scene) {
  const g = new THREE.Group();

  // ---- Allrum (0,1.6)-(4.9,4.7) — open living/dining, wood accent wall south ----
  const sofa = makeSofa(2.0, 0.85, 1.6, 2.55, 0);
  g.add(sofa);
  const chaise = makeChaise(0.85, 1.5, 0.55, 3.35, Math.PI / 2);
  g.add(chaise);
  g.add(makeRoundRug(1.15, 1.75, 2.9, "#c7c4bc"));
  g.add(makeCoffeeTable(1.75, 2.75));
  g.add(antlerChandelier(1.7, 2.25, 2.7));

  const dining = makeRoundDiningSet(3.9, 3.15);
  g.add(dining);
  g.add(antlerChandelier(3.9, 2.3, 3.15));

  // TV between the Sovrum1 and Sovrum2 doors on the wood wall (z≈4.7).
  g.add(makeTVConsole(3.0, 4.55, Math.PI));
  // Ski + "let's snow" decor west of the Sovrum1 door.
  g.add(crossedSkis(0.6, 1.6, 4.62, Math.PI));
  g.add(picture(0.4, 0.55, "#dfe4e6", 0.15, 1.55, 4.6, Math.PI * 0.52));

  // White wardrobe near the window, south end.
  g.add(makeWardrobe(1.0, 0.35, 2.15, Math.PI / 2));

  // Window dressing on the west wall (big view window + balcony door).
  g.add(curtainPair(1.15, 2.0, 0.1, 1.15, 0.85, Math.PI / 2));
  g.add(candleHolder(0.12, 0.95, 1.15, 0.25));
  g.add(candleHolder(0.12, 0.95, 1.35, 0.15));
  g.add(picture(0.55, 0.75, "#e9ecec", 0.05, 1.7, 3.0, Math.PI / 2));

  // ---- Kök (4.9,2.2)-(8.2,4.7) — single-wall run on the east façade ----
  const kitchen = makeKitchenRun(7.9, 3.45, 2.1, -Math.PI / 2);
  g.add(kitchen);
  g.add(makeRug(0.7, 1.1, 6.0, 4.3, "#33363a"));

  // ---- Entré (0,0)-(4.9,1.6) ----
  g.add(makeWardrobe(1.0, 0.5, 0.55, Math.PI / 2));
  g.add(makeCoatHooks(1.5, 0.95, 1.6, 0.15, 0, 4));
  g.add(makeBench(1.4, 4.1, 0.3, 0));
  g.add(makeCubbies(0.22, 4.78, 1.55, 0.9, Math.PI / 2));
  g.add(picture(0.55, 0.8, "#dfe1de", 4.78, 1.5, 0.3, -Math.PI / 2));
  g.add(makeRug(1.6, 0.9, 2.5, 0.35, "#161616"));

  // ---- Badrum (4.9,0)-(7.0,2.2) ----
  g.add(makeVanity(0.9, 5.35, 0.85, Math.PI / 2));
  g.add(makeToilet(6.75, 0.35, Math.PI));
  g.add(makeShower(6.75, 1.75, 1.0, 0.85, 0));
  g.add(makeWasher(6.7, 0.35, Math.PI / 2));
  g.add(makeRug(0.6, 0.5, 5.9, 1.3, "#2c2c2e"));

  // ---- Bastu (7.0,0)-(8.2,2.2) ----
  g.add(makeSaunaCabin(7.6, 1.1));

  // ---- Sovrum 1 (0,4.7)-(3.2,7.3) — headboard on west wall, wood wall south with skis ----
  const bed1 = makeBed(1.6, 2.0, bedFabric2, { plaid: true, fur: true });
  bed1.rotation.y = Math.PI / 2;
  bed1.position.set(1.05, 0, 5.85);
  g.add(bed1);
  g.add(makeNightstand(0.35, 0, 5.05));
  g.add(wallLamp(0.06, 1.3, 5.35, Math.PI / 2));
  g.add(wallLamp(0.06, 1.3, 6.35, Math.PI / 2));
  g.add(picture(0.9, 0.35, "#d8d3c6", 0.06, 1.7, 5.85, Math.PI / 2));
  g.add(floatingCabinet(0.9, 0.06, 2.2, 5.85, Math.PI / 2));
  g.add(crossedSkis(2.75, 1.7, 4.62, Math.PI));
  g.add(picture(0.35, 0.45, "#dfe4e6", 2.35, 1.4, 4.62, Math.PI));
  g.add(curtainPair(1.3, 1.8, 1.6, 1.05, 7.24, Math.PI, checkerMat));

  // ---- Sovrum 2 (3.2,4.7)-(5.7,7.3) — single bed under window, gray wall ----
  const bed2 = makeBed(1.0, 2.0, bedFabric2, { fur: true });
  bed2.rotation.y = Math.PI;
  bed2.position.set(4.45, 0, 6.25);
  g.add(bed2);
  g.add(makeChestOfDrawers(0.7, 5.35, 5.6, -Math.PI / 2));
  g.add(floatingCabinet(1.0, 4.45, 2.25, 7.24, 0));
  g.add(picture(0.4, 0.5, "#cfd6d2", 3.35, 1.4, 5.5, Math.PI / 2));
  g.add(curtainPair(1.3, 1.8, 4.45, 1.05, 7.24, Math.PI, checkerMat));

  // ---- Sovrum 3 (5.7,4.7)-(8.2,7.3) — single bed under window, bear art ----
  const bed3 = makeBed(1.0, 2.0, bedFabric3, { fur: true });
  bed3.rotation.y = Math.PI;
  bed3.position.set(6.95, 0, 6.25);
  g.add(bed3);
  g.add(makeChestOfDrawers(0.7, 8.05, 5.6, Math.PI / 2));
  g.add(floatingCabinet(1.0, 6.95, 2.25, 7.24, 0));
  g.add(picture(0.55, 0.65, "#8a8f86", 8.05, 1.55, 5.1, Math.PI / 2));
  g.add(curtainPair(1.3, 1.8, 6.95, 1.05, 7.24, Math.PI, checkerMat));

  // ---- Balcony ----
  g.add(makeOutdoorSet(-0.75, 3.1, 0));

  scene.add(g);
  return g;
}
