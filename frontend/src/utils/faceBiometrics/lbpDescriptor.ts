export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function extractLbpDescriptor(
  imageData: ImageData,
  gridCols = 4,
  gridRows = 4,
): number[] {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  const gray = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    gray[i] = data[i * 4];
  }

  const cellWidth = Math.floor(width / gridCols);
  const cellHeight = Math.floor(height / gridRows);
  const numBins = 16;
  const featureVector: number[] = [];

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const hist = new Array(numBins).fill(0);
      const startX = c * cellWidth;
      const endX = Math.min(width - 1, startX + cellWidth);
      const startY = r * cellHeight;
      const endY = Math.min(height - 1, startY + cellHeight);

      let pixelCount = 0;

      for (let y = Math.max(1, startY); y < endY; y++) {
        for (let x = Math.max(1, startX); x < endX; x++) {
          const idx = y * width + x;
          const center = gray[idx];

          let code = 0;
          if (gray[idx - width - 1] >= center) code |= 1;
          if (gray[idx - width] >= center) code |= 2;
          if (gray[idx - width + 1] >= center) code |= 4;
          if (gray[idx + 1] >= center) code |= 8;
          if (gray[idx + width + 1] >= center) code |= 16;
          if (gray[idx + width] >= center) code |= 32;
          if (gray[idx + width - 1] >= center) code |= 64;
          if (gray[idx - 1] >= center) code |= 128;

          const binIndex = Math.floor(code / 16);
          hist[binIndex]++;
          pixelCount++;
        }
      }

      const factor = pixelCount > 0 ? 1 / pixelCount : 0;
      for (let b = 0; b < numBins; b++) {
        featureVector.push(hist[b] * factor);
      }
    }
  }

  return featureVector;
}

export function extractGradientOrientation(
  imageData: ImageData,
  numBins = 8,
): number[] {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const hist = new Array(numBins).fill(0);
  let totalMagnitude = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      const gx =
        data[idx + 4] -
        data[idx - 4] +
        2 * (data[idx + width * 4 + 4] - data[idx + width * 4 - 4]);
      const gy =
        data[idx + width * 4] -
        data[idx - width * 4] +
        2 * (data[idx + width * 4 + 4] - data[idx - width * 4 + 4]);

      const mag = Math.sqrt(gx * gx + gy * gy);
      if (mag > 15) {
        let angle = Math.atan2(gy, gx) * (180 / Math.PI);
        if (angle < 0) angle += 180;
        const bin = Math.min(numBins - 1, Math.floor(angle / (180 / numBins)));
        hist[bin] += mag;
        totalMagnitude += mag;
      }
    }
  }

  if (totalMagnitude === 0) return hist;
  return hist.map((v) => v / totalMagnitude);
}
