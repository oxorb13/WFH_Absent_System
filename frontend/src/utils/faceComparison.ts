import {
  loadImage,
  getEqualizedFaceImageData,
} from './faceBiometrics/faceDetector.js';
import {
  extractLbpDescriptor,
  extractGradientOrientation,
  cosineSimilarity,
} from './faceBiometrics/lbpDescriptor.js';
import {
  evaluateAntiSpoofing,
  type AntiSpoofResult,
} from './faceBiometrics/antiSpoofing.js';

export interface FaceComparisonResult {
  isMatch: boolean;
  similarity: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  details: {
    structuralScore: number;
    histogramScore: number;
    featureScore: number;
  };
  antiSpoof?: AntiSpoofResult;
  message: string;
}

export async function compareFaceWithReference(
  liveSnapshotUrl: string,
  referencePhotoUrl: string,
  threshold = 75.0,
  burstFrames: ImageData[] = [],
  hasPassedPoseChallenge = false,
  minContourThreshold = 65.0,
): Promise<FaceComparisonResult> {
  try {
    const [liveImg, refImg] = await Promise.all([
      loadImage(liveSnapshotUrl),
      loadImage(referencePhotoUrl),
    ]);

    const liveFace = getEqualizedFaceImageData(liveImg, 128);
    const refFace = getEqualizedFaceImageData(refImg, 128);

    const antiSpoof = evaluateAntiSpoofing(liveFace, burstFrames, hasPassedPoseChallenge);

    // ekstraksi fitur tekstur & gradien
    const liveLbp = extractLbpDescriptor(liveFace, 4, 4);
    const refLbp = extractLbpDescriptor(refFace, 4, 4);
    const rawLbpSim = Math.max(0, cosineSimilarity(liveLbp, refLbp));

    const liveHog = extractGradientOrientation(liveFace, 8);
    const refHog = extractGradientOrientation(refFace, 8);
    const rawHogSim = Math.max(0, cosineSimilarity(liveHog, refHog));

    const totalPixels = 128 * 128;
    let pixelDiff = 0;
    for (let i = 0; i < totalPixels; i++) {
      pixelDiff += Math.abs(liveFace.data[i * 4] - refFace.data[i * 4]);
    }
    const maxDiff = totalPixels * 255;
    const rawPixelSim = Math.max(0, 1 - pixelDiff / maxDiff);

    const featureScore = Math.min(99, Math.round(rawLbpSim * 1000) / 10);
    const histogramScore = Math.min(99, Math.round(rawHogSim * 1000) / 10);
    const structuralScore = Math.min(99, Math.round(rawPixelSim * 1000) / 10);

    const weightedBase = rawLbpSim * 0.55 + rawHogSim * 0.3 + rawPixelSim * 0.15;
    let calibratedSim = 0;
    if (weightedBase >= 0.5) {
      calibratedSim = 60 + ((weightedBase - 0.5) / 0.45) * 35;
    } else {
      calibratedSim = (weightedBase / 0.5) * 55;
    }

    const similarity = Math.min(97.8, Math.max(15.0, Math.round(calibratedSim * 10) / 10));
    const isContourValid = featureScore >= minContourThreshold;
    const isMatch = antiSpoof.isReal && similarity >= threshold && isContourValid;

    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (isMatch && similarity >= 82 && featureScore >= 80) confidence = 'HIGH';
    else if (isMatch) confidence = 'MEDIUM';

    let message = '';
    if (!antiSpoof.isReal) {
      message = antiSpoof.message;
    } else if (!isContourValid) {
      message = `Wajah Tidak Cocok. Kontur wajah (${featureScore}%) belum mencapai batas minimal ${minContourThreshold}%. Terdeteksi kemiripan parsial namun bukan karyawan bersangkutan.`;
    } else if (isMatch) {
      message = `Wajah Terverifikasi (${similarity}% | Kontur: ${featureScore}%). Fitur biometrik cocok dengan foto master HRD & lolos uji liveness.`;
    } else {
      message = `Wajah Tidak Cocok (${similarity}%). Verifikasi tidak mencapai ambang batas ${threshold}%. Posisikan wajah di tengah kamera.`;
    }

    return {
      isMatch,
      similarity,
      confidence,
      details: {
        featureScore,
        histogramScore,
        structuralScore,
      },
      antiSpoof,
      message,
    };
  } catch (err: any) {
    console.error('Error during biometric comparison:', err);
    return {
      isMatch: false,
      similarity: 0,
      confidence: 'LOW',
      details: { featureScore: 0, histogramScore: 0, structuralScore: 0 },
      message: 'Gagal memproses perbandingan biometrik wajah.',
    };
  }
}
