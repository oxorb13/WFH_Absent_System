import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface AttendanceHeroBannerProps {
  currentTime: Date;
  displayName: string;
  department: string;
  employeeCode: string;
}

const formatDateIndo = (dateObj: Date | string) => {
  const d = new Date(dateObj);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const AttendanceHeroBanner: React.FC<AttendanceHeroBannerProps> = ({
  currentTime,
  displayName,
  department,
  employeeCode,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl shadow-slate-900/10">
      <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatDateIndo(currentTime)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Halo, {displayName}! 👋
          </h1>
          <p className="text-slate-300 text-sm font-normal">
            Departemen {department || 'Karyawan'} • NIP: {employeeCode || '-'}
          </p>
        </div>

        {/* Live Clock Pill Card */}
        <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-inner self-start md:self-auto">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Waktu Server Real-Time
            </p>
            <p className="text-2xl font-black text-white tracking-tight font-mono">
              {currentTime.toLocaleTimeString('id-ID')}{' '}
              <span className="text-xs font-normal text-emerald-200">WIB</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

