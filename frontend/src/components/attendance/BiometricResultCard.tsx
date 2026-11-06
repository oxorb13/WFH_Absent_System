import React from 'react';
import type { FaceComparisonResult } from '../../utils/faceComparison.js';
import {
  CheckCircle2,
  ShieldAlert,
  AlertCircle,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface BiometricResultCardProps {
  isVerifying: boolean;
  biometricResult: FaceComparisonResult | null;
  hasMasterPhoto: boolean;
}

export const BiometricResultCard: React.FC<BiometricResultCardProps> = ({
  isVerifying,
  biometricResult,
  hasMasterPhoto,
}) => {
  if (isVerifying) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 animate-pulse">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-700">
          Sistem sedang memverifikasi keaslian wajah (Liveness) & mencocokkan biometrik...
        </span>
      </div>
    );
  }

  if (biometricResult) {
    const isSpoof = biometricResult.antiSpoof && !biometricResult.antiSpoof.isReal;

    return (
      <div
        className={`p-4 rounded-2xl border transition-all ${
          biometricResult.isMatch
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {biometricResult.isMatch ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : isSpoof ? (
              <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center flex-shrink-0 animate-bounce">
                <Smartphone className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                {biometricResult.isMatch
                  ? `Wajah Cocok: ${biometricResult.similarity}% (Terverifikasi Biometrik)`
                  : isSpoof
                    ? 'Serangan Layar HP / Foto Terdeteksi (Presensi Ditolak)'
                    : biometricResult.details.featureScore < 65
                      ? `Kontur Wajah ${biometricResult.details.featureScore}% < 65% (Bukan Karyawan)`
                      : `Wajah Tidak Cocok: ${biometricResult.similarity}% (Presensi Ditolak)`}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5 font-medium">
                {biometricResult.message}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 ${
              biometricResult.isMatch
                ? 'bg-emerald-200/80 text-emerald-900'
                : 'bg-rose-200/80 text-rose-900'
            }`}
          >
            {isSpoof ? 'SPOOF DETECTED' : biometricResult.confidence}
          </span>
        </div>

        {/* Anti-Spoof Reasons if triggered */}
        {isSpoof && biometricResult.antiSpoof?.reasons && biometricResult.antiSpoof.reasons.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-900 text-[10px] space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              Temuan Mesin Deteksi Keaslian (Liveness):
            </span>
            <ul className="list-disc list-inside space-y-0.5 pl-1 opacity-90">
              {biometricResult.antiSpoof.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Feature Match Breakdown & Anti-Spoof Status */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-black/5 text-[10px]">
          <div>
            <span className="text-slate-400 block font-semibold">Kontur (Min 65%)</span>
            <span
              className={`font-bold ${
                biometricResult.details.featureScore >= 65
                  ? 'text-emerald-700'
                  : 'text-rose-600'
              }`}
            >
              {biometricResult.details.featureScore}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Kroma Kulit</span>
            <span className="font-bold text-slate-800">{biometricResult.details.histogramScore}%</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Struktur Cahaya</span>
            <span className="font-bold text-slate-800">{biometricResult.details.structuralScore}%</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Uji Liveness</span>
            <span className={`font-bold flex items-center gap-0.5 ${biometricResult.antiSpoof?.isReal ? 'text-emerald-700' : 'text-rose-600'}`}>
              {biometricResult.antiSpoof?.isReal ? (
                <>
                  <ShieldCheck className="w-3 h-3" />
                  {biometricResult.antiSpoof.livenessScore}%
                </>
              ) : (
                `${biometricResult.antiSpoof?.livenessScore ?? 0}%`
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (hasMasterPhoto) {
    return null;
  }

  return (
    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span>Foto master belum didaftarkan HRD. Presensi berjalan dalam mode audit visual selfie.</span>
    </div>
  );
};
