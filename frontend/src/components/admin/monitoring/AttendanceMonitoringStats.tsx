import React from 'react';
import { Users, CheckCircle2, Clock } from 'lucide-react';

interface AttendanceMonitoringStatsProps {
  totalToday: number;
  presentToday: number;
  lateToday: number;
}

export const AttendanceMonitoringStats: React.FC<AttendanceMonitoringStatsProps> = ({
  totalToday,
  presentToday,
  lateToday,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
      {/* Total Card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-100/90 hover:bg-slate-50 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Presensi Hari Ini
          </p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">
            {totalToday} <span className="text-xs font-semibold text-slate-400">Karyawan</span>
          </p>
        </div>
      </div>

      {/* On-Time Card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 hover:bg-emerald-50/80 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Hadir Tepat Waktu
          </p>
          <p className="text-2xl font-black text-emerald-950 mt-0.5">
            {presentToday} <span className="text-xs font-semibold text-emerald-600">Karyawan</span>
          </p>
        </div>
      </div>

      {/* Late Card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 hover:bg-amber-50/80 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            Terlambat (&gt; 09:00 WIB)
          </p>
          <p className="text-2xl font-black text-amber-950 mt-0.5">
            {lateToday} <span className="text-xs font-semibold text-amber-600">Karyawan</span>
          </p>
        </div>
      </div>
    </div>
  );
};

