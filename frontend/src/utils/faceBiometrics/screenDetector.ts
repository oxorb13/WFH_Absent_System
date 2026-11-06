export interface ScreenDetectionResult {
  isPhoneScreen: boolean;
  moireDetected: boolean;
  glareDetected: boolean;
  moireScore: number; // 0 (natural skin) to 100 (heavy screen raster)
  glareScore: number; // 0 to 100
  details: string[];
}

/**
 * Computes Laplacian variance on a grayscale patch to measure high-frequency micro-texture.
 * Screen pixel grids produce high spatial frequency noise across smooth skin regions.
 */
function computeLaplacianVariance(gray: Uint8Array, w: number, h: number): number {
  if (w < 8 || h < 8) return 0;
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      // 3x3 Discrete Laplacian kernel
      const lap =
        gray[idx + 1] +
        gray[idx - 1] +
        gray[idx + w] +
        gray[idx - w] -
        4 * gray[idx];

      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

/**
 * Checks for periodic Moiré patterns by analyzing 1D row autocorrelation.
 * Screen subpixels create periodic oscillations at lags of 2-5 pixels.
 */
function detectPeriodicMoire(gray: Uint8Array, w: number, h: number): number {
  if (w < 16 || h < 16) return 0;
  let periodicHits = 0;
  let totalRows = 0;

  for (let y = Math.floor(h * 0.25); y < Math.floor(h * 0.75); y += 4) {
    const rowStart = y * w;
    let rowMean = 0;
    for (let x = 0; x < w; x++) rowMean += gray[rowStart + x];
    rowMean /= w;

    // Check autocorrelation at lag 2, 3, 4
    for (let lag = 2; lag <= 4; lag++) {
      let num = 0;
      let den = 0;
      for (let x = 0; x < w - lag; x++) {
        const diff1 = gray[rowStart + x] - rowMean;
        const diff2 = gray[rowStart + x + lag] - rowMean;
        num += diff1 * diff2;
        den += diff1 * diff1;
      }
      if (den > 0 && num / den > 0.42) {
        periodicHits++;
      }
    }
    totalRows++;
  }

  if (totalRows === 0) return 0;
  return Math.min(100, Math.round((periodicHits / (totalRows * 3)) * 100));
}

/**
 * Evaluates a facial ImageData for digital screen and photo spoofing characteristics.
 */
export function detectScreenArtifacts(faceData: ImageData): ScreenDetectionResult {
  const { width: w, height: h, data } = faceData;
  const totalPixels = w * h;
  const gray = new Uint8Array(totalPixels);

  let clippedPixels = 0;
  let brightClusters = 0;

  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Grayscale luminance
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    // Screen backlight clipping & glass glare
    if (r >= 252 && g >= 252 && b >= 252) {
      clippedPixels++;
    }
    if (gray[i] > 240) {
      brightClusters++;
    }
  }

  // Sample smooth facial skin patches (left cheek & right cheek)
  const patchW = Math.floor(w * 0.25);
  const patchH = Math.floor(h * 0.25);
  const leftCheek = new Uint8Array(patchW * patchH);

  const startX = Math.floor(w * 0.2);
  const startY = Math.floor(h * 0.45);

  for (let py = 0; py < patchH; py++) {
    for (let px = 0; px < patchW; px++) {
      leftCheek[py * patchW + px] = gray[(startY + py) * w + (startX + px)];
    }
  }

  const lapVar = computeLaplacianVariance(leftCheek, patchW, patchH);
  const moirePeriodicScore = detectPeriodicMoire(leftCheek, patchW, patchH);

  // Moiré score combining high-frequency variance & periodicity
  let moireScore = Math.min(
    100,
    Math.round(
      (Math.max(0, lapVar - 50) / 120) * 60 + moirePeriodicScore * 0.4,
    ),
  );

  // Glare / Screen Reflection score
  const clipRatio = clippedPixels / totalPixels;
  const brightRatio = brightClusters / totalPixels;
  let glareScore = Math.min(
    100,
    Math.round(clipRatio * 1500 + brightRatio * 200),
  );

  const moireDetected = moireScore >= 65 || lapVar > 165;
  const glareDetected = glareScore >= 70 || clipRatio > 0.045;

  const details: string[] = [];
  if (moireDetected) {
    details.push('Terdeteksi pola raster subpiksel layar digital (Moiré pattern)');
  }
  if (glareDetected) {
    details.push('Terdeteksi pantulan kaca layar HP / pencahayaan backlight digital');
  }

  const isPhoneScreen = moireDetected || (glareDetected && moireScore > 40);

  return {
    isPhoneScreen,
    moireDetected,
    glareDetected,
    moireScore,
    glareScore,
    details,
  };
}

