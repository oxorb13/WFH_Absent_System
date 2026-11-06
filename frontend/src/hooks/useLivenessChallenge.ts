import { useState, useRef, useCallback, useEffect } from 'react';
import type Webcam from 'react-webcam';
import {
  detectHeadPose,
  type HeadPose,
} from '../utils/faceBiometrics/headPoseDetector.js';

export type LivenessStep =
  | 'IDLE'
  | 'LOOK_CENTER'
  | 'LOOK_LEFT'
  | 'LOOK_RIGHT'
  | 'SUCCESS'
  | 'FAILED';

interface UseLivenessChallengeProps {
  webcamRef: React.RefObject<Webcam | null>;
  onChallengeComplete: (snapshotUrl: string) => void;
}

export function useLivenessChallenge({
  webcamRef,
  onChallengeComplete,
}: UseLivenessChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<LivenessStep>('IDLE');
  const [centerDone, setCenterDone] = useState(false);
  const [leftDone, setLeftDone] = useState(false);
  const [rightDone, setRightDone] = useState(false);
  const [currentPose, setCurrentPose] = useState<HeadPose>('UNKNOWN');
  const [promptMessage, setPromptMessage] = useState('');
  const [isTooClose, setIsTooClose] = useState(false);

  const frontSnapshotRef = useRef<string | null>(null);
  const stableCountRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const startChallenge = useCallback(() => {
    setIsActive(true);
    setCurrentStep('LOOK_CENTER');
    setCenterDone(false);
    setLeftDone(false);
    setRightDone(false);
    setIsTooClose(false);
    frontSnapshotRef.current = null;
    stableCountRef.current = 0;
    setPromptMessage('Posisikan wajah menghadap lurus ke kamera');
  }, []);

  const resetChallenge = useCallback(() => {
    setIsActive(false);
    setCurrentStep('IDLE');
    setCenterDone(false);
    setLeftDone(false);
    setRightDone(false);
    setIsTooClose(false);
    frontSnapshotRef.current = null;
    stableCountRef.current = 0;
    setPromptMessage('');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let isSubscribed = true;
    let lastTick = performance.now();

    const loop = () => {
      if (!isSubscribed) return;
      const now = performance.now();

      // Analyze at ~10 FPS for optimal performance & responsiveness
      if (now - lastTick >= 90 && webcamRef.current?.video) {
        lastTick = now;
        const video = webcamRef.current.video;
        const res = detectHeadPose(video);
        setCurrentPose(res.pose);

        // Face too close: warn and skip processing this tick
        if (res.pose === 'TOO_CLOSE') {
          setIsTooClose(true);
          stableCountRef.current = 0;
          animationFrameRef.current = requestAnimationFrame(loop);
          return;
        }

        setIsTooClose(false);

        if (res.faceDetected) {
          // STEP 1: Center Baseline Face
          if (!frontSnapshotRef.current) {
            if (res.pose === 'CENTER') {
              stableCountRef.current++;
              if (stableCountRef.current >= 3) {
                // Capture pristine front-facing selfie
                const shot = webcamRef.current.getScreenshot();
                if (shot) {
                  frontSnapshotRef.current = shot;
                  setCenterDone(true);
                  setCurrentStep('LOOK_LEFT');
                  setPromptMessage('Tengokkan kepala Anda ke Kiri 👈');
                  stableCountRef.current = 0;
                }
              }
            } else {
              stableCountRef.current = 0;
            }
          }
          // STEP 2 & 3: Turn Left & Turn Right (flexible order)
          else if (!leftDone || !rightDone) {
            if (res.pose === 'LEFT' && !leftDone) {
              setLeftDone(true);
              if (!rightDone) {
                setCurrentStep('LOOK_RIGHT');
                setPromptMessage('Bagus! Sekarang tengokkan kepala ke Kanan 👉');
              }
            } else if (res.pose === 'RIGHT' && !rightDone) {
              setRightDone(true);
              if (!leftDone) {
                setCurrentStep('LOOK_LEFT');
                setPromptMessage('Bagus! Sekarang tengokkan kepala ke Kiri 👈');
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, leftDone, rightDone, webcamRef]);

  // When all steps are done: trigger complete
  useEffect(() => {
    if (centerDone && leftDone && rightDone && frontSnapshotRef.current && isActive) {
      setCurrentStep('SUCCESS');
      setPromptMessage('Liveness Selesai! Wajah hidup terverifikasi ✅');
      setIsActive(false);
      const snapshot = frontSnapshotRef.current;
      setTimeout(() => {
        onChallengeComplete(snapshot);
      }, 400);
    }
  }, [centerDone, leftDone, rightDone, isActive, onChallengeComplete]);

  return {
    isActive,
    currentStep,
    centerDone,
    leftDone,
    rightDone,
    currentPose,
    promptMessage,
    isTooClose,
    startChallenge,
    resetChallenge,
  };
}
