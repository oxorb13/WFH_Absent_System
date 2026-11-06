import React from 'react';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Focus,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import type { LivenessStep } from '../../hooks/useLivenessChallenge.js';
import type { HeadPose } from '../../utils/faceBiometrics/headPoseDetector.js';

interface LivenessChallengeOverlayProps {
  currentStep: LivenessStep;
  centerDone: boolean;
  leftDone: boolean;
  rightDone: boolean;
  currentPose: HeadPose;
  promptMessage: string;
  isTooClose: boolean;
  onCancel: () => void;
}

export const LivenessChallengeOverlay: React.FC<LivenessChallengeOverlayProps> = ({
  currentStep,
  centerDone,
  leftDone,
  rightDone,
  promptMessage,
  isTooClose,
  onCancel,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 pointer-events-auto bg-slate-950/40 backdrop-blur-[2px]">
      {/* Top Bar with Step Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
          {/* Step 1: Center */}
          <div
            className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full transition-all ${
              centerDone
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : currentStep === 'LOOK_CENTER'
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'text-slate-400'
            }`}
          >
            {centerDone ? <Check className="w-3 h-3" /> : '1'}
            <span>Tengah</span>
          </div>

          <span className="text-slate-600 text-xs">›</span>

          {/* Step 2: Left */}
          <div
            className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full transition-all ${
              leftDone
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : currentStep === 'LOOK_LEFT'
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'text-slate-400'
            }`}
          >
            {leftDone ? <Check className="w-3 h-3" /> : '2'}
            <span>Tengok Kiri</span>
          </div>

          <span className="text-slate-600 text-xs">›</span>

          {/* Step 3: Right */}
          <div
            className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full transition-all ${
              rightDone
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : currentStep === 'LOOK_RIGHT'
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'text-slate-400'
            }`}
          >
            {rightDone ? <Check className="w-3 h-3" /> : '3'}
            <span>Tengok Kanan</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Too Close Warning Banner */}
      {isTooClose && (
        <div className="flex items-center justify-center gap-2 mx-2 px-4 py-2 rounded-xl bg-red-500/90 text-white text-xs font-black shadow-lg animate-pulse border border-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Terlalu dekat! Mundurkan wajah dari kamera</span>
        </div>
      )}

      {/* Center Dynamic Face Target & Arrow Indicator */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-none">
        <div className="relative w-48 h-60 sm:w-56 sm:h-72 border-2 border-dashed border-emerald-400/80 rounded-[3rem] shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center transition-all">
          {currentStep === 'LOOK_CENTER' && (
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/50 shadow-lg">
                <Focus className="w-6 h-6" />
              </div>
            </div>
          )}

          {currentStep === 'LOOK_LEFT' && (
            <div className="flex flex-col items-center gap-2 -translate-x-4 transition-transform animate-pulse">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/50 shadow-xl shadow-amber-500/20">
                <ArrowLeft className="w-8 h-8 animate-ping" />
              </div>
            </div>
          )}

          {currentStep === 'LOOK_RIGHT' && (
            <div className="flex flex-col items-center gap-2 translate-x-4 transition-transform animate-pulse">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/50 shadow-xl shadow-amber-500/20">
                <ArrowRight className="w-8 h-8 animate-ping" />
              </div>
            </div>
          )}

          {currentStep === 'SUCCESS' && (
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/50 shadow-xl">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Instruction Banner */}
      <div className="flex justify-center pb-2">
        <div className="px-5 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-white text-xs sm:text-sm font-black shadow-2xl text-center flex items-center gap-2 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          {promptMessage}
        </div>
      </div>
    </div>
  );
};

