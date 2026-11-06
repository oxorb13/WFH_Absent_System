import React from 'react';
import type { Employee, Attendance } from '../../types/index.js';
import {
  getAvatarBg,
  formatWIB,
  getAbsenceBadge,
} from '../../utils/calendarBadge.util.js';

interface TimelineCalendarGridProps {
  employees: Employee[];
  attendances: Attendance[];
  calendarDays: Array<{
    date: Date;
    dayName: string;
    dayNumber: number;
    isWeekend: boolean;
    isToday: boolean;
    dateKey: string;
  }>;
}

export const TimelineCalendarGrid: React.FC<TimelineCalendarGridProps> = ({
  employees,
  attendances,
  calendarDays,
}) => {
  const gridColumnsStyle = {
    gridTemplateColumns: `180px repeat(${calendarDays.length}, minmax(52px, 1fr))`,
  };

  const minWidthStyle = {
    minWidth: `${Math.max(880, 180 + calendarDays.length * 56)}px`,
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div style={minWidthStyle}>
        {/* Header Days Row */}
        <div className="grid gap-2 mb-3 items-end" style={gridColumnsStyle}>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 pb-2">
            Employees
          </div>

          {calendarDays.map((col, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              {col.isToday ? (
                <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-2xl py-1.5 px-3 shadow-md shadow-blue-500/30 scale-105 z-10 w-full text-center">
                  <span className="text-[11px] font-semibold leading-none text-blue-100">
                    {col.dayName}
                  </span>
                  <span className="text-sm font-black leading-tight">
                    {col.dayNumber}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center py-1 w-full text-center ${
                    col.isWeekend ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <span className="text-[11px] font-medium leading-none">
                    {col.dayName}
                  </span>
                  <span className="text-xs font-bold leading-tight mt-0.5">
                    {col.dayNumber}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Employee Rows */}
        <div className="space-y-2.5">
          {employees.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada data karyawan.
            </div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                className="grid gap-2 items-center group"
                style={gridColumnsStyle}
              >
                {/* Employee Info Card */}
                <div className="flex items-center gap-3 pr-2 min-w-0">
                  {emp.photoUrl ? (
                    <img
                      src={emp.photoUrl}
                      alt={emp.fullName}
                      className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ${getAvatarBg(
                        emp.fullName,
                      )}`}
                    >
                      {emp.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-slate-900 truncate">
                      {emp.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {emp.position || emp.department || 'Staff'}
                    </p>
                  </div>
                </div>

                {/* Days Cell Grid */}
                {calendarDays.map((col, cIdx) => {
                  const att = attendances.find((a) => {
                    if (a.employeeId !== emp.id) return false;
                    const aDate = new Date(a.checkInTime).toISOString().split('T')[0];
                    return aDate === col.dateKey;
                  });

                  const badge = att ? getAbsenceBadge(att) : null;

                  return (
                    <div
                      key={cIdx}
                      className={`h-12 rounded-2xl flex items-center justify-center relative transition-all duration-200 ${
                        col.isWeekend
                          ? 'bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_6px,#e2e8f0_6px,#e2e8f0_8px)] opacity-60'
                          : col.isToday
                          ? 'bg-blue-50/50 border border-blue-200/60'
                          : 'bg-slate-50/80 hover:bg-slate-100/80'
                      }`}
                    >
                      {/* 1. Kapsul Khusus (Sakit: Biru / Cuti: Ungu / Terlambat: Amber) */}
                      {badge ? (
                        <div
                          className={`w-[94%] h-[80%] rounded-xl flex items-center justify-between px-2 text-white font-extrabold text-[10px] truncate z-10 animate-fade-in ${badge.className}`}
                          title={`${badge.label}: ${att?.notes || 'Presensi'}`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <badge.icon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{badge.label}</span>
                          </div>
                          <span className="text-[9px] font-mono bg-white/25 px-1.5 py-0.2 rounded-full font-bold ml-1">
                            {badge.sublabel}
                          </span>
                        </div>
                      ) : att ? (
                        /* 2. Hadir Tepat Waktu -> TIDAK DIBERI WARNA (Dot hijau lembut saat hover) */
                        <div
                          className="w-full h-full flex items-center justify-center group/cell cursor-default"
                          title={`Hadir Tepat Waktu: ${formatWIB(att.checkInTime)} (${att.notes || 'WFH'})`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 group-hover/cell:bg-emerald-600 group-hover/cell:scale-125 transition-all"></span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
