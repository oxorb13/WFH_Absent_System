export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Gagal memuat gambar: ' + e));
    img.src = src;
  });
}

export function detectFaceRegion(img: HTMLImageElement): BoundingBox {
  const w = img.naturalWidth || img.width || 320;
  const h = img.naturalHeight || img.height || 240;

  const sampleW = 80;
  const sampleH = Math.round((h / w) * sampleW);
  const canvas = document.createElement('canvas');
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { x: 0, y: 0, width: w, height: h };

  ctx.drawImage(img, 0, 0, sampleW, sampleH);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

  let skinPixelCount = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = sampleW;
  let maxX = 0;
  let minY = sampleH;
  let maxY = 0;

  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const idx = (y * sampleW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173) {
        skinPixelCount++;
        sumX += x;
        sumY += y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (skinPixelCount < 40) {
    const minDim = Math.min(w, h);
    return {
      x: (w - minDim) / 2,
      y: (h - minDim) / 2,
      width: minDim,
      height: minDim,
    };
  }

  const scaleX = w / sampleW;
  const scaleY = h / sampleH;

  const centerX = (sumX / skinPixelCount) * scaleX;
  const centerY = (sumY / skinPixelCount) * scaleY;
  const faceW = (maxX - minX + 8) * scaleX;
  const faceH = (maxY - minY + 8) * scaleY;

  const size = Math.max(faceW, faceH) * 1.25;
  const halfSize = size / 2;

  const x = Math.max(0, Math.min(w - size, centerX - halfSize));
  const y = Math.max(0, Math.min(h - size, centerY - halfSize));

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(Math.min(size, w)),
    height: Math.round(Math.min(size, h)),
  };
}

export function getEqualizedFaceImageData(
  img: HTMLImageElement,
  size = 128,
): ImageData {
  const box = detectFaceRegion(img);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(
    img,
    box.x,
    box.y,
    box.width,
    box.height,
    0,
    0,
    size,
    size,
  );

  const imgData = ctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;

  const totalPixels = size * size;
  const hist = new Uint32Array(256);
  const gray = new Uint8Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const gVal = Math.round(
      0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2],
    );
    gray[i] = gVal;
    hist[gVal]++;
  }

  const cdf = new Float32Array(256);
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += hist[i];
    cdf[i] = sum / totalPixels;
  }

  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const equalizedVal = Math.round(cdf[gray[i]] * 255);
    pixels[p] = equalizedVal;
    pixels[p + 1] = equalizedVal;
    pixels[p + 2] = equalizedVal;
  }

  return imgData;
}
