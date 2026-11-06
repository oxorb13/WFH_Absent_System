import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AttendanceGuidelinesCardProps {
  totalDays: number;
  todayCheckedIn: boolean;
}

export const AttendanceGuidelinesCard: React.FC<AttendanceGuidelinesCardProps> = ({
  totalDays,
  todayCheckedIn,
}) => {
  return (
    <div className="space-y-6">
      {/* Guide Card in Deep Rich Theme */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-7 shadow-xl shadow-emerald-950/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold tracking-tight">
            Prosedur Presensi WFH
          </h3>
        </div>

        <ul className="text-xs sm:text-sm text-slate-200 space-y-3 leading-relaxed font-medium">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
            Presensi dilakukan <strong>1 kali sehari</strong> pada jam operasional kerja.
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
            Batas jam masuk kantor adalah pukul <strong>09:00 WIB</strong>. Lewat dari itu akan tercatat <strong>Terlambat</strong>.
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
            Posisikan wajah tepat di tengah target kamera tanpa masker agar terverifikasi jelas oleh HRD.
          </li>
        </ul>
      </div>

      {/* Quick Status Stats Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Statistik Kehadiran Saya
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Total Absensi</span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalDays}{' '}
              <span className="text-xs font-semibold text-slate-400">Hari</span>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium">Status Hari Ini</span>
            <p className="text-sm font-black text-emerald-950 mt-1 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  todayCheckedIn ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
              {todayCheckedIn ? 'Sudah Hadir' : 'Belum Absen'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

