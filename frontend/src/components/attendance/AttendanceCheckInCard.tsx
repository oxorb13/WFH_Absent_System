import React from 'react';
import type Webcam from 'react-webcam';
import type { Attendance } from '../../types/index.js';
import type { FaceComparisonResult } from '../../utils/faceComparison.js';
import {
  AlertCircle,
  FileText,
  ScanFace,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { WebcamCaptureCard } from './WebcamCaptureCard.js';
import { BiometricResultCard } from './BiometricResultCard.js';
import { TodayCheckedInCard } from './TodayCheckedInCard.js';
import type { useLivenessChallenge } from '../../hooks/useLivenessChallenge.js';

interface AttendanceCheckInCardProps {
  todayCheckedIn: boolean;
  todayAttendance: Attendance | null;
  webcamRef: React.RefObject<Webcam | null>;
  capturedImage: string | null;
  onCapture: () => void;
  onRetake: () => void;
  isVerifying: boolean;
  biometricResult: FaceComparisonResult | null;
  hasMasterPhoto: boolean;
  liveness?: ReturnType<typeof useLivenessChallenge>;
  notes: string;
  onNotesChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  successMsg: string | null;
  onPreviewPhoto: (url: string) => void;
}

export const AttendanceCheckInCard: React.FC<AttendanceCheckInCardProps> = ({
  todayCheckedIn,
  todayAttendance,
  webcamRef,
  capturedImage,
  onCapture,
  onRetake,
  isVerifying,
  biometricResult,
  hasMasterPhoto,
  liveness,
  notes,
  onNotesChange,
  onSubmit,
  loading,
  error,
  successMsg,
  onPreviewPhoto,
}) => {
  return (
    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
          1
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Presensi WFH & Scan Wajah
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Ambil foto selfie di meja kerja sebagai bukti kehadiran
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {todayCheckedIn ? (
        <TodayCheckedInCard
          attendance={todayAttendance}
          onPreviewPhoto={onPreviewPhoto}
        />
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <WebcamCaptureCard
            webcamRef={webcamRef}
            capturedImage={capturedImage}
            isVerifying={isVerifying}
            liveness={liveness}
            onCapture={onCapture}
            onRetake={onRetake}
          />

          <BiometricResultCard
            isVerifying={isVerifying}
            biometricResult={biometricResult}
            hasMasterPhoto={hasMasterPhoto}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Catatan Aktivitas Hari Ini (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Contoh: Mengerjakan modul API sprint 3 di ruang kerja rumah..."
              className="block w-full p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !capturedImage ||
              isVerifying ||
              Boolean(hasMasterPhoto && biometricResult && !biometricResult.isMatch)
            }
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer ${
              biometricResult && !biometricResult.isMatch
                ? 'bg-rose-100 text-rose-500 cursor-not-allowed border border-rose-200'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : biometricResult && !biometricResult.isMatch ? (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Presensi Ditolak (Wajah Tidak Sesuai Master)
              </>
            ) : (
              <>
                <ScanFace className="w-5 h-5 text-slate-950" />
                Kirim & Catat Presensi WFH
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

