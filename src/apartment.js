import * as THREE from "three";
import {
  rooms,
  walls,
  balcony,
  balconyRailing,
  CEILING_HEIGHT,
  WALL_THICKNESS,
} from "./data/floorplan.js";
import {
  parquetTexture,
  tileTexture,
  darkTileTexture,
  wallPaintTexture,
  ceilingPlankTexture,
  logWallTexture,
} from "./textures.js";

const EXTERIOR_THICKNESS = 0.22;

function makeLabelSprite(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 44px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: 0.9,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.1, 0.275, 1);
  return sprite;
}

export function buildApartment() {
  const group = new THREE.Group();
  const colliders = []; // {x1,x2,z1,z2} axis-aligned boxes in the XZ plane

  const wallMat = new THREE.MeshStandardMaterial({
    map: wallPaintTexture("#f4f1ea", 3),
    roughness: 0.92,
    metalness: 0.02,
  });
  const exteriorWallMat = new THREE.MeshStandardMaterial({
    map: wallPaintTexture("#eae6dc", 3),
    roughness: 0.95,
    metalness: 0.02,
  });
  const logWallMat = new THREE.MeshStandardMaterial({
    map: logWallTexture(2.5),
    roughness: 0.75,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: "#f7f5f0",
    roughness: 0.5,
    metalness: 0.05,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: "#bcd6e6",
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.85,
    thickness: 0.05,
    side: THREE.DoubleSide,
  });
  const frostedGlassMat = new THREE.MeshPhysicalMaterial({
    color: "#e8eef1",
    transparent: true,
    opacity: 0.55,
    roughness: 0.6,
    transmission: 0.4,
    side: THREE.DoubleSide,
  });
  const darkGlassMat = new THREE.MeshPhysicalMaterial({
    color: "#14100a",
    transparent: true,
    opacity: 0.72,
    roughness: 0.15,
    transmission: 0.35,
    side: THREE.DoubleSide,
  });
  const ceilingMat = new THREE.MeshStandardMaterial({
    map: ceilingPlankTexture(3.2),
    roughness: 0.85,
  });

  const wood = parquetTexture(5);
  const tilesGray = tileTexture(4);
  const tilesDark = darkTileTexture(4);
  const floorMats = {
    wood: new THREE.MeshStandardMaterial({ map: wood, roughness: 0.5 }),
    tile_gray: new THREE.MeshStandardMaterial({ map: tilesGray, roughness: 0.3 }),
    tile_dark: new THREE.MeshStandardMaterial({ map: tilesDark, roughness: 0.35 }),
  };

  // --- Floors, ceilings (wood-plank throughout, per photos), and labels ---
  for (const room of rooms) {
    const w = room.x2 - room.x1;
    const d = room.z2 - room.z1;
    const cx = (room.x1 + room.x2) / 2;
    const cz = (room.z1 + room.z2) / 2;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      floorMats[room.floor] ?? floorMats.wood
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0, cz);
    floor.receiveShadow = true;
    group.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(cx, CEILING_HEIGHT, cz);
    group.add(ceiling);

    const label = makeLabelSprite(room.name);
    label.position.set(cx, CEILING_HEIGHT - 0.4, cz);
    group.add(label);
  }

  // Balcony decking (exterior)
  {
    const w = balcony.x2 - balcony.x1;
    const d = balcony.z2 - balcony.z1;
    const deck = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshStandardMaterial({ color: "#8a6b4c", roughness: 0.85 })
    );
    deck.rotation.x = -Math.PI / 2;
    deck.position.set((balcony.x1 + balcony.x2) / 2, 0, (balcony.z1 + balcony.z2) / 2);
    deck.receiveShadow = true;
    group.add(deck);
  }

  // --- Wall segments ---
  for (const seg of walls) {
    if (seg.open) continue; // fully open-plan threshold: no wall, no collider

    const thickness = seg.exterior ? EXTERIOR_THICKNESS : WALL_THICKNESS;
    const half = thickness / 2;
    const mat = seg.exterior ? exteriorWallMat : seg.wood ? logWallMat : wallMat;
    const openings = [...seg.openings].sort((a, b) => a.from - b.from);

    const addSolidBox = (from, to, yFrom, yTo, material = mat) => {
      const len = to - from;
      if (len <= 0.001) return;
      const height = yTo - yFrom;
      let mesh;
      if (seg.axis === "z") {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(len, height, thickness), material);
        mesh.position.set(from + len / 2, yFrom + height / 2, seg.at);
      } else {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, height, len), material);
        mesh.position.set(seg.at, yFrom + height / 2, from + len / 2);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    };

    const addGlassPane = (from, to, sill, head, glassMaterial) => {
      const len = to - from;
      const height = head - sill;
      let mesh;
      if (seg.axis === "z") {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(len, height, 0.02), glassMaterial);
        mesh.position.set(from + len / 2, sill + height / 2, seg.at);
      } else {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.02, height, len), glassMaterial);
        mesh.position.set(seg.at, sill + height / 2, from + len / 2);
      }
      group.add(mesh);
    };

    const addWindow = (from, to, sill, head, frosted) => {
      addGlassPane(from, to, sill, head, frosted ? frostedGlassMat : glassMat);
      const frameThickness = 0.06;
      const frameDepth = thickness * 0.9;
      const mkFrameBar = (len2, axisIsZ, px, py, pz) => {
        const geo = axisIsZ
          ? new THREE.BoxGeometry(len2, frameThickness, frameDepth)
          : new THREE.BoxGeometry(frameDepth, frameThickness, len2);
        const bar = new THREE.Mesh(geo, frameMat);
        bar.position.set(px, py, pz);
        group.add(bar);
      };
      const len = to - from;
      if (seg.axis === "z") {
        mkFrameBar(len, true, from + len / 2, sill, seg.at);
        mkFrameBar(len, true, from + len / 2, head, seg.at);
      } else {
        mkFrameBar(len, false, seg.at, sill, from + len / 2);
        mkFrameBar(len, false, seg.at, head, from + len / 2);
      }
    };

    const addDoor = (from, to, head, opening) => {
      const len = to - from;
      const frameW = 0.08;
      const frameDepth = thickness;
      const doorFrameMat = opening.dark ? new THREE.MeshStandardMaterial({ color: "#c9a06a", roughness: 0.55 }) : frameMat;
      const mkVert = (px, pz) => {
        const geo =
          seg.axis === "z"
            ? new THREE.BoxGeometry(frameW, head, frameDepth)
            : new THREE.BoxGeometry(frameDepth, head, frameW);
        const bar = new THREE.Mesh(geo, doorFrameMat);
        bar.position.set(px, head / 2, pz);
        group.add(bar);
      };
      if (seg.axis === "z") {
        mkVert(from, seg.at);
        mkVert(to, seg.at);
      } else {
        mkVert(seg.at, from);
        mkVert(seg.at, to);
      }
      // Glazed doors (balcony sliding door, dark sauna glass door) get a
      // pane too, but remain fully walkable (no sill collider added below).
      if (opening.glass) {
        addGlassPane(from, to, 0.02, head - 0.02, opening.dark ? darkGlassMat : glassMat);
      }
    };

    // Solid piers between/around openings (full height)
    let cursor = seg.from;
    for (const op of openings) {
      if (op.from > cursor) addSolidBox(cursor, op.from, 0, CEILING_HEIGHT);
      cursor = Math.max(cursor, op.to);
    }
    if (cursor < seg.to) addSolidBox(cursor, seg.to, 0, CEILING_HEIGHT);

    // Colliders: full segment is solid except for door (sill===0) gaps
    cursor = seg.from;
    const colliderPieces = [];
    for (const op of openings) {
      if (op.type === "door" && op.sill === 0) {
        if (op.from > cursor) colliderPieces.push({ from: cursor, to: op.from });
        cursor = Math.max(cursor, op.to);
      }
    }
    if (cursor < seg.to) colliderPieces.push({ from: cursor, to: seg.to });
    for (const p of colliderPieces) {
      if (seg.axis === "z") {
        colliders.push({
          x1: p.from - half,
          x2: p.to + half,
          z1: seg.at - half,
          z2: seg.at + half,
        });
      } else {
        colliders.push({
          x1: seg.at - half,
          x2: seg.at + half,
          z1: p.from - half,
          z2: p.to + half,
        });
      }
    }

    // Openings: headers, sills, glass, door frames
    for (const op of openings) {
      if (op.head < CEILING_HEIGHT - 0.001) {
        addSolidBox(op.from, op.to, op.head, CEILING_HEIGHT);
      }
      if (op.type === "window") {
        if (op.sill > 0.001) addSolidBox(op.from, op.to, 0, op.sill);
        addWindow(op.from, op.to, op.sill, op.head, op.frosted);
      } else {
        addDoor(op.from, op.to, op.head, op);
      }
    }
  }

  // --- Balcony railing (glass panels on steel posts, ~1m high) ---
  const railGlassMat = new THREE.MeshPhysicalMaterial({
    color: "#dbe8ee",
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    transmission: 0.7,
    side: THREE.DoubleSide,
  });
  const postMat = new THREE.MeshStandardMaterial({ color: "#2b2b2b", metalness: 0.7, roughness: 0.4 });
  const railHeight = 1.0;
  for (const edge of balconyRailing) {
    const len = edge.to - edge.from;
    let mesh;
    if (edge.axis === "z") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(len, railHeight, 0.02), railGlassMat);
      mesh.position.set(edge.from + len / 2, railHeight / 2, edge.at);
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.02, railHeight, len), railGlassMat);
      mesh.position.set(edge.at, railHeight / 2, edge.from + len / 2);
    }
    group.add(mesh);

    const half = 0.06;
    if (edge.axis === "z") {
      colliders.push({ x1: edge.from - half, x2: edge.to + half, z1: edge.at - half, z2: edge.at + half });
    } else {
      colliders.push({ x1: edge.at - half, x2: edge.at + half, z1: edge.from - half, z2: edge.to + half });
    }

    const postSpacing = 1.0;
    const count = Math.max(2, Math.round(len / postSpacing));
    for (let i = 0; i <= count; i++) {
      const t = edge.from + (len * i) / count;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, railHeight, 8), postMat);
      if (edge.axis === "z") post.position.set(t, railHeight / 2, edge.at);
      else post.position.set(edge.at, railHeight / 2, t);
      group.add(post);
    }
  }
  for (const edge of balconyRailing) {
    const len = edge.to - edge.from;
    const cap = new THREE.Mesh(
      edge.axis === "z"
        ? new THREE.BoxGeometry(len, 0.05, 0.08)
        : new THREE.BoxGeometry(0.08, 0.05, len),
      postMat
    );
    if (edge.axis === "z") cap.position.set(edge.from + len / 2, railHeight, edge.at);
    else cap.position.set(edge.at, railHeight, edge.from + len / 2);
    group.add(cap);
  }

  return { group, colliders };
}
