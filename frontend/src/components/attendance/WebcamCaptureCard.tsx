import React from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, ScanFace } from 'lucide-react';
import { LivenessChallengeOverlay } from './LivenessChallengeOverlay.js';
import type { useLivenessChallenge } from '../../hooks/useLivenessChallenge.js';

interface WebcamCaptureCardProps {
  webcamRef: React.RefObject<Webcam | null>;
  capturedImage: string | null;
  isVerifying: boolean;
  liveness?: ReturnType<typeof useLivenessChallenge>;
  onCapture: () => void;
  onRetake: () => void;
}

export const WebcamCaptureCard: React.FC<WebcamCaptureCardProps> = ({
  webcamRef,
  capturedImage,
  isVerifying,
  liveness,
  onCapture,
  onRetake,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video sm:aspect-4/3 flex items-center justify-center border-2 border-slate-800 shadow-2xl">
      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'user',
              width: { ideal: 720 },
              height: { ideal: 720 },
            }}
            className="w-full h-full object-cover"
          />

          {/* Active Liveness Challenge Overlay */}
          {liveness?.isActive ? (
            <LivenessChallengeOverlay
              currentStep={liveness.currentStep}
              centerDone={liveness.centerDone}
              leftDone={liveness.leftDone}
              rightDone={liveness.rightDone}
              currentPose={liveness.currentPose}
              promptMessage={liveness.promptMessage}
              isTooClose={liveness.isTooClose}
              onCancel={liveness.resetChallenge}
            />
          ) : (
            <>
              {/* Target Outline */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="relative w-56 h-72 sm:w-64 sm:h-80 border-2 border-dashed border-emerald-400/70 rounded-[2.5rem] shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center">
                </div>
              </div>

              {/* Start Liveness Capture Button */}
              <div className="absolute bottom-5 inset-x-0 flex justify-center z-10">
                <button
                  type="button"
                  onClick={onCapture}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-950 font-black text-sm shadow-2xl shadow-black/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-emerald-600" />
                  Mulai Presensi Selfie (Uji Liveness)
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        /* Captured Snapshot Preview */
        <div className="relative w-full h-full">
          <img
            src={capturedImage}
            alt="Hasil Foto"
            className="w-full h-full object-cover"
          />

          {isVerifying && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 text-center z-20">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                <ScanFace className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">
                  Mencocokkan Biometrik Wajah...
                </p>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Liveness lolos. Memvalidasi fitur wajah dengan foto master HRD
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onRetake}
            className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            Ambil Ulang Presensi
          </button>
        </div>
      )}
    </div>
  );
};
