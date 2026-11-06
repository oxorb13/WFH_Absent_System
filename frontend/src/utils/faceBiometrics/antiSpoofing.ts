import {
  detectScreenArtifacts,
  type ScreenDetectionResult,
} from './screenDetector.js';
import {
  evaluateTemporalLiveness,
  type MotionLivenessResult,
} from './livenessMotion.js';

export interface AntiSpoofResult {
  isReal: boolean;
  livenessScore: number;
  isPhoneScreen: boolean;
  isStaticPhoto: boolean;
  moireDetected: boolean;
  glareDetected: boolean;
  screenScore: number;
  reasons: string[];
  message: string;
}

export function evaluateAntiSpoofing(
  primaryFaceData: ImageData,
  burstFrames: ImageData[] = [],
  hasPassedPoseChallenge = false,
): AntiSpoofResult {
  if (hasPassedPoseChallenge) {
    return {
      isReal: true,
      livenessScore: 98,
      isPhoneScreen: false,
      isStaticPhoto: false,
      moireDetected: false,
      glareDetected: false,
      screenScore: 5,
      reasons: [],
      message: 'Wajah Hidup Terverifikasi (98%). Lolos uji gerakan kepala interaktif (Hadap Depan, Tengok Kiri & Kanan).',
    };
  }

  const screenCheck: ScreenDetectionResult = detectScreenArtifacts(primaryFaceData);
  const motionCheck: MotionLivenessResult = evaluateTemporalLiveness(
    burstFrames.length > 0 ? burstFrames : [primaryFaceData],
  );

  const reasons: string[] = [...screenCheck.details, ...motionCheck.details];
  const isPhoneScreen = screenCheck.isPhoneScreen || motionCheck.isRigidPlanar;
  const isStaticPhoto = motionCheck.isStaticFrozen;

  let livenessScore = 80;
  if (isPhoneScreen) livenessScore -= 50;
  if (isStaticPhoto) livenessScore -= 30;
  if (screenCheck.moireDetected) livenessScore -= 25;
  if (screenCheck.glareDetected) livenessScore -= 15;
  livenessScore = Math.max(5, Math.min(99, livenessScore));

  const isReal = !isPhoneScreen && !isStaticPhoto && livenessScore >= 60;

  let message = '';
  if (isPhoneScreen) {
    message = 'Terdeteksi Layar Ponsel / Gambar Digital. Harap hadapkan wajah asli secara langsung ke kamera.';
  } else if (isStaticPhoto) {
    message = 'Terdeteksi Foto Statis / Tanpa Mikro-Gerakan. Harap pastikan wajah bergerak alami saat pengambilan foto.';
  } else if (!isReal) {
    message = 'Uji Keaslian Wajah Gagal. Pastikan pencahayaan cukup dan wajah terlihat jelas.';
  } else {
    message = `Wajah Hidup Terverifikasi (${livenessScore}%). Keaslian wajah valid.`;
  }

  return {
    isReal,
    livenessScore,
    isPhoneScreen,
    isStaticPhoto,
    moireDetected: screenCheck.moireDetected,
    glareDetected: screenCheck.glareDetected,
    screenScore: screenCheck.moireScore,
    reasons,
    message,
  };
}
