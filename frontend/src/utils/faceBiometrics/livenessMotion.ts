export interface MotionLivenessResult {
  isLiveMotion: boolean;
  isStaticFrozen: boolean;
  isRigidPlanar: boolean;
  livenessScore: number; // 0 to 100%
  details: string[];
}

/**
 * Computes Mean Absolute Error (MAE) between two grayscale frame buffers
 */
function computeFrameDifference(f1: Uint8Array, f2: Uint8Array): number {
  let diff = 0;
  for (let i = 0; i < f1.length; i++) {
    diff += Math.abs(f1[i] - f2[i]);
  }
  return diff / f1.length;
}

/**
 * Computes displacement vector for a sub-region between two frames
 */
function estimateQuadrantShift(
  f1: Uint8Array,
  f2: Uint8Array,
  w: number,
  startX: number,
  startY: number,
  qw: number,
  qh: number,
): { dx: number; dy: number } {
  let bestDx = 0;
  let bestDy = 0;
  let minDiff = Infinity;

  // Search small neighborhood [-2, 2] pixels
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      let diff = 0;
      let count = 0;
      for (let y = startY + 2; y < startY + qh - 2; y += 2) {
        for (let x = startX + 2; x < startX + qw - 2; x += 2) {
          const idx1 = y * w + x;
          const idx2 = (y + dy) * w + (x + dx);
          diff += Math.abs(f1[idx1] - f2[idx2]);
          count++;
        }
      }
      if (count > 0 && diff / count < minDiff) {
        minDiff = diff / count;
        bestDx = dx;
        bestDy = dy;
      }
    }
  }
  return { dx: bestDx, dy: bestDy };
}

/**
 * Evaluates temporal frames for living human micro-motion vs. static/screen spoofing.
 */
export function evaluateTemporalLiveness(
  frames: ImageData[],
): MotionLivenessResult {
  if (frames.length < 2) {
    return {
      isLiveMotion: true,
      isStaticFrozen: false,
      isRigidPlanar: false,
      livenessScore: 80,
      details: ['Hanya 1 frame tersedia, melewati uji temporal.'],
    };
  }

  const w = frames[0].width;
  const h = frames[0].height;
  const total = w * h;

  // Convert frames to grayscale buffers
  const grayFrames = frames.map((f) => {
    const buf = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      buf[i] = Math.round(
        0.299 * f.data[p] + 0.587 * f.data[p + 1] + 0.114 * f.data[p + 2],
      );
    }
    return buf;
  });

  // 1. Frame Freeze Check (MAE between Frame 0 and Frame 1)
  const mae = computeFrameDifference(grayFrames[0], grayFrames[1]);
  const isStaticFrozen = mae < 0.28; // Completely frozen static image

  // 2. Rigid Planar Movement Check (divide into 4 quadrants)
  const qw = Math.floor(w / 2);
  const qh = Math.floor(h / 2);

  const q1 = estimateQuadrantShift(grayFrames[0], grayFrames[1], w, 0, 0, qw, qh);
  const q2 = estimateQuadrantShift(grayFrames[0], grayFrames[1], w, qw, 0, qw, qh);
  const q3 = estimateQuadrantShift(grayFrames[0], grayFrames[1], w, 0, qh, qw, qh);
  const q4 = estimateQuadrantShift(grayFrames[0], grayFrames[1], w, qw, qh, qw, qh);

  const shifts = [q1, q2, q3, q4];
  const avgDx = shifts.reduce((acc, s) => acc + s.dx, 0) / 4;
  const avgDy = shifts.reduce((acc, s) => acc + s.dy, 0) / 4;

  let varMotion = 0;
  for (const s of shifts) {
    const ddx = s.dx - avgDx;
    const ddy = s.dy - avgDy;
    varMotion += ddx * ddx + ddy * ddy;
  }
  varMotion /= 4;

  const totalShift = Math.sqrt(avgDx * avgDx + avgDy * avgDy);

  // A handheld phone shaking has non-zero shift but 0 variance between quadrants (pure rigid 2D)
  const isRigidPlanar = totalShift > 0.6 && varMotion < 0.05 && mae > 0.4 && mae < 3.5;

  const details: string[] = [];
  if (isStaticFrozen) {
    details.push('Tidak terdeteksi mikromovimen alami (foto mati / frame statis)');
  }
  if (isRigidPlanar) {
    details.push('Terdeteksi pergerakan bidang datar 2D kaku (layar HP/kertas digerakkan)');
  }

  // Calculate Liveness score
  let livenessScore = 88;
  if (isStaticFrozen) {
    livenessScore = 15;
  } else if (isRigidPlanar) {
    livenessScore = 28;
  } else {
    // Normal living face micro-motion (MAE around 0.6 to 6.0 with non-rigid deformation)
    const naturalMotionBonus = Math.min(10, Math.round(varMotion * 12));
    livenessScore = Math.min(99, 85 + naturalMotionBonus);
  }

  const isLiveMotion = !isStaticFrozen && !isRigidPlanar && livenessScore >= 60;

  return {
    isLiveMotion,
    isStaticFrozen,
    isRigidPlanar,
    livenessScore,
    details,
  };
}
