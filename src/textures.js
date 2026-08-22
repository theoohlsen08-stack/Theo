import * as THREE from "three";

function canvasTexture(size, draw, { repeatX = 1, repeatY = 1 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function parquetTexture(repeat = 4) {
  return canvasTexture(
    256,
    (ctx, size) => {
      const plankW = size / 8;
      const tones = ["#b98354", "#c28f5f", "#ad7847", "#c79768"];
      for (let x = 0; x < size; x += plankW) {
        for (let y = 0; y < size; y += plankW * 2) {
          const offset = (Math.floor(x / plankW) % 2) * plankW;
          ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
          ctx.fillRect(x, y + offset - plankW, plankW - 2, plankW * 2 - 2);
        }
      }
      ctx.strokeStyle = "rgba(60,35,15,0.25)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= size; x += plankW) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function tileTexture(repeat = 3) {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = "#eef0ee";
      ctx.fillRect(0, 0, size, size);
      const grid = 4;
      const cell = size / grid;
      ctx.strokeStyle = "#c7cbc7";
      ctx.lineWidth = 3;
      for (let i = 0; i <= grid; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(size, i * cell);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) {
          ctx.fillRect(i * cell + 4, j * cell + 4, cell - 8, cell * 0.25);
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function saunaWoodTexture(repeat = 2) {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = "#d9b98a";
      ctx.fillRect(0, 0, size, size);
      const plank = size / 10;
      for (let x = 0; x < size; x += plank) {
        ctx.fillStyle = `rgba(150,105,60,${0.15 + Math.random() * 0.1})`;
        ctx.fillRect(x, 0, plank - 2, size);
        for (let k = 0; k < 6; k++) {
          ctx.strokeStyle = "rgba(120,80,45,0.15)";
          ctx.beginPath();
          const yy = Math.random() * size;
          ctx.moveTo(x, yy);
          ctx.bezierCurveTo(x + plank * 0.3, yy + 10, x + plank * 0.6, yy - 10, x + plank, yy);
          ctx.stroke();
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function wallPaintTexture(hex = "#f2efe9", repeat = 2) {
  return canvasTexture(
    128,
    (ctx, size) => {
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 8;
        imgData.data[i] += n;
        imgData.data[i + 1] += n;
        imgData.data[i + 2] += n;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function fabricTexture(hex = "#8a97a6", repeat = 2) {
  return canvasTexture(
    64,
    (ctx, size) => {
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let x = 0; x < size; x += 4) {
        ctx.fillRect(x, 0, 1, size);
      }
      for (let y = 0; y < size; y += 4) {
        ctx.fillRect(0, y, size, 1);
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function snowTexture(repeat = 30) {
  return canvasTexture(
    128,
    (ctx, size) => {
      ctx.fillStyle = "#eef2f6";
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 400; i++) {
        const v = 220 + Math.random() * 35;
        ctx.fillStyle = `rgb(${v},${v},${v + 4})`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

export function rugTexture(hex = "#9c3b3b") {
  return canvasTexture(128, (ctx, size) => {
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, size - 20, size - 20);
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, size - 40, size - 40);
  });
}

// Pale pine tongue-and-groove ceiling boards, as seen throughout the
// apartment's photos (entry, living room, bedrooms all share this ceiling).
export function ceilingPlankTexture(repeat = 3) {
  return canvasTexture(
    256,
    (ctx, size) => {
      const plank = size / 9;
      const tones = ["#e8d9bd", "#e2d0af", "#ecdec4", "#dfcca8"];
      for (let y = 0; y < size; y += plank) {
        ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
        ctx.fillRect(0, y, size, plank - 3);
        ctx.fillStyle = "rgba(90,65,35,0.15)";
        ctx.fillRect(0, y + plank - 3, size, 3);
        for (let k = 0; k < 3; k++) {
          ctx.strokeStyle = "rgba(120,90,55,0.1)";
          ctx.beginPath();
          const xx = Math.random() * size;
          ctx.moveTo(xx, y);
          ctx.bezierCurveTo(xx + 15, y + plank * 0.3, xx - 15, y + plank * 0.6, xx, y + plank - 3);
          ctx.stroke();
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

// Honey-brown horizontal log/plank accent wall (the feature wall behind the
// bedroom doors in the living room, and behind the bed in Sovrum 1).
export function logWallTexture(repeat = 3) {
  return canvasTexture(
    256,
    (ctx, size) => {
      const plank = size / 7;
      const tones = ["#a8794f", "#b3865a", "#9c6f47", "#ad7f52"];
      for (let y = 0; y < size; y += plank) {
        ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
        ctx.fillRect(0, y, size, plank - 4);
        // rounded log highlight/shadow
        const grad = ctx.createLinearGradient(0, y, 0, y + plank - 4);
        grad.addColorStop(0, "rgba(255,235,205,0.18)");
        grad.addColorStop(0.5, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(70,40,15,0.22)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, size, plank - 4);
        ctx.fillStyle = "rgba(50,30,10,0.35)";
        ctx.fillRect(0, y + plank - 4, size, 4);
        for (let k = 0; k < 4; k++) {
          ctx.strokeStyle = "rgba(60,35,12,0.18)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          const xx = Math.random() * size;
          const ry = y + plank * 0.5;
          ctx.ellipse(xx, ry, 8 + Math.random() * 10, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

// White subway/brick tile — kitchen backsplash and bathroom walls.
export function subwayTileTexture(repeat = 3) {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = "#e9e6df";
      ctx.fillRect(0, 0, size, size);
      const rows = 8;
      const rowH = size / rows;
      for (let r = 0; r < rows; r++) {
        const offset = r % 2 === 0 ? 0 : rowH * 1.5;
        const y = r * rowH;
        for (let x = -rowH * 2; x < size + rowH * 2; x += rowH * 3) {
          const bx = x + offset;
          ctx.fillStyle = "#fbfaf7";
          ctx.fillRect(bx + 1.5, y + 1.5, rowH * 3 - 3, rowH - 3);
          ctx.strokeStyle = "rgba(150,150,140,0.4)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx + 1.5, y + 1.5, rowH * 3 - 3, rowH - 3);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillRect(bx + 3, y + 2.5, rowH * 3 - 6, (rowH - 3) * 0.3);
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}

// Buffalo-check curtain fabric (black/white or navy/cream gingham-style),
// as seen in Sovrum 2 and Sovrum 3.
export function checkerTexture(colorA = "#1c1c1c", colorB = "#eeeae2", squares = 6) {
  return canvasTexture(
    120,
    (ctx, size) => {
      const cell = size / squares;
      for (let i = 0; i < squares; i++) {
        for (let j = 0; j < squares; j++) {
          ctx.fillStyle = (i + j) % 2 === 0 ? colorA : colorB;
          ctx.fillRect(i * cell, j * cell, cell, cell);
        }
      }
    },
    { repeatX: 1, repeatY: 2.2 }
  );
}

// Simple tartan/plaid throw pattern — Sovrum 1's bedding.
export function plaidTexture() {
  return canvasTexture(128, (ctx, size) => {
    ctx.fillStyle = "#2b3a4a";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(180,60,50,0.55)";
    ctx.lineWidth = 5;
    for (let i = 0; i < size; i += 22) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(230,220,190,0.5)";
    ctx.lineWidth = 2;
    for (let i = 11; i < size; i += 22) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
    }
  });
}

// Dark charcoal floor tile — Entré.
export function darkTileTexture(repeat = 4) {
  return canvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = "#3a3a3c";
      ctx.fillRect(0, 0, size, size);
      const grid = 5;
      const cell = size / grid;
      ctx.strokeStyle = "#232325";
      ctx.lineWidth = 3;
      for (let i = 0; i <= grid; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(size, i * cell);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) {
          ctx.fillRect(i * cell + 4, j * cell + 4, cell - 8, cell * 0.3);
        }
      }
    },
    { repeatX: repeat, repeatY: repeat }
  );
}
