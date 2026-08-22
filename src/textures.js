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
