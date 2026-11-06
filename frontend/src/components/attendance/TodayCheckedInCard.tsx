import React from 'react';
import type { Attendance } from '../../types/index.js';
import { CheckCircle2, Maximize2, ShieldCheck } from 'lucide-react';

interface TodayCheckedInCardProps {
  attendance: Attendance | null;
  onPreviewPhoto: (url: string) => void;
}

const formatWIB = (dateStr: string) => {
  const d = new Date(dateStr);
  return (
    d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB'
  );
};

export const TodayCheckedInCard: React.FC<TodayCheckedInCardProps> = ({
  attendance,
  onPreviewPhoto,
}) => {
  const hasLivePhoto =
    attendance?.photoUrl &&
    !attendance.photoUrl.includes('privacy') &&
    !attendance.photoUrl.includes('deleted');

  return (
    <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-emerald-950">
          Presensi Hari Ini Telah Selesai!
        </h3>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Tercatat pada pukul{' '}
          <span className="font-mono font-bold">
            {attendance ? formatWIB(attendance.checkInTime) : '-'}
          </span>{' '}
          dengan status{' '}
          <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-xs">
            {attendance?.status === 'present' ? 'Tepat Waktu' : 'Terlambat'}
          </span>
        </p>
      </div>

      {hasLivePhoto ? (
        <div className="mt-6 pt-6 border-t border-emerald-200/60 max-w-sm mx-auto">
          <p className="text-xs font-bold text-emerald-800 mb-2.5 uppercase tracking-wider">
            Foto Bukti WFH Anda:
          </p>
          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-md group">
            <img
              src={attendance.photoUrl}
              alt="Bukti Absensi Hari Ini"
              className="w-full h-52 object-cover"
            />
            <button
              type="button"
              onClick={() => onPreviewPhoto(attendance.photoUrl)}
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1.5 backdrop-blur-[2px] cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" /> Lihat Ukuran Penuh
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-6 border-t border-emerald-200/60 max-w-sm mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs space-y-1 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 font-extrabold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Foto Otomatis Dihapus (Kebijakan Privasi)
            </div>
            <p className="text-[11px] text-emerald-800/90 font-medium">
              Foto selfie bukti WFH telah terverifikasi secara real-time dan langsung dihapus demi menjaga kerahasiaan & privasi Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
