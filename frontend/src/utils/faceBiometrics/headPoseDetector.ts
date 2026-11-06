export type HeadPose = 'CENTER' | 'LEFT' | 'RIGHT' | 'TOO_CLOSE' | 'UNKNOWN';

export interface HeadPoseResult {
  pose: HeadPose;
  yawScore: number;
  confidence: number;
  faceDetected: boolean;
  box?: { x: number; y: number; width: number; height: number };
}

let sampleCanvas: HTMLCanvasElement | null = null;
let sampleCtx: CanvasRenderingContext2D | null = null;

function getSampleContext(w = 160, h = 120): CanvasRenderingContext2D | null {
  if (!sampleCanvas) {
    sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = w;
    sampleCanvas.height = h;
    sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  }
  return sampleCtx;
}

export function detectHeadPose(video: HTMLVideoElement): HeadPoseResult {
  const w = 160;
  const h = 120;
  const ctx = getSampleContext(w, h);
  if (!ctx || !video.videoWidth || !video.videoHeight) {
    return { pose: 'UNKNOWN', yawScore: 0, confidence: 0, faceDetected: false };
  }

  ctx.drawImage(video, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let skinCount = 0;
  let sumX = 0;
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173) {
        skinCount++;
        sumX += x;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (skinCount < 60 || maxX - minX < 20 || maxY - minY < 20) {
    return { pose: 'UNKNOWN', yawScore: 0, confidence: 0, faceDetected: false };
  }

  const faceW = maxX - minX;
  const faceRatio = faceW / w;
  const coverageRatio = skinCount / (w * h);

  if (coverageRatio > 0.90 && faceRatio > 0.95) {
    return {
      pose: 'TOO_CLOSE',
      yawScore: 0,
      confidence: 0,
      faceDetected: true,
      box: { x: minX, y: minY, width: faceW, height: maxY - minY },
    };
  }

  const faceMidX = (minX + maxX) / 2;
  const skinCentroidX = sumX / skinCount;

  let leftSkin = 0;
  let rightSkin = 0;
  let darkCount = 0;
  let darkSumX = 0;

  const featureMaxY = minY + (maxY - minY) * 0.65;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173) {
        if (x < faceMidX) leftSkin++;
        else rightSkin++;
      }

      if (y <= featureMaxY) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 75) {
          darkCount++;
          darkSumX += x;
        }
      }
    }
  }

  const totalSkinInBox = leftSkin + rightSkin || 1;
  const skinAsymmetry = (rightSkin - leftSkin) / totalSkinInBox;
  const centroidShift = (skinCentroidX - faceMidX) / (faceW || 1);

  let featureShift = 0;
  if (darkCount > 15) {
    const darkCentroidX = darkSumX / darkCount;
    featureShift = (darkCentroidX - faceMidX) / (faceW || 1);
  }

  const isFaceLarge = faceRatio > 0.55;
  const sensitivityMultiplier = isFaceLarge ? 320 : 220;
  const rawYaw = (skinAsymmetry * 0.45 + centroidShift * 0.35 + featureShift * 0.2) * sensitivityMultiplier;
  const yawScore = Math.max(-100, Math.min(100, Math.round(rawYaw)));

  let pose: HeadPose = 'CENTER';
  const centerThresh = isFaceLarge ? 8 : 14;
  const turnThresh = isFaceLarge ? 10 : 18;

  if (yawScore <= -turnThresh) {
    pose = 'LEFT';
  } else if (yawScore >= turnThresh) {
    pose = 'RIGHT';
  } else if (Math.abs(yawScore) <= centerThresh) {
    pose = 'CENTER';
  }

  const confidence = Math.min(99, Math.round(Math.abs(yawScore) > 20 ? Math.abs(yawScore) : 85));

  return {
    pose,
    yawScore,
    confidence,
    faceDetected: true,
    box: { x: minX, y: minY, width: faceW, height: maxY - minY },
  };
}
