import React from 'react';
import { Building2, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginShowcase: React.FC = () => {
  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-teal-400/15 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none text-white">
              WFH ABSENT APP
            </h1>
            <p className="text-xs text-emerald-300 font-medium mt-1">
              Employee Attendance System
            </p>
          </div>
        </div>

        <div className="pt-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Modern HR Tech
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Portal Presensi & Pemantauan Karyawan.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Sistem terintegrasi untuk pencatatan kehadiran WFH dengan bukti foto webcam dan dasbor kontrol HRD real-time.
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-10 border-t border-white/10 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-emerald-200 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Verifikasi Kehadiran Foto Real-Time</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-200 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Audit Trail Aman & View-Only HRD</span>
        </div>
      </div>
    </div>
  );
};

