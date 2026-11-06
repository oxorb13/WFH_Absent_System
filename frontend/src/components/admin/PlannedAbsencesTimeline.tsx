import React, { useState, useMemo } from 'react';
import type { Employee, Attendance } from '../../types/index.js';
import {
  SlidersHorizontal,
  ArrowUpRight,
  UserPlus,
} from 'lucide-react';
import { TimelineCalendarGrid } from './TimelineCalendarGrid.js';
import { MonthFilterPopover } from './MonthFilterPopover.js';

interface PlannedAbsencesTimelineProps {
  employees: Employee[];
  attendances: Attendance[];
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  selectedDept: string;
  onFilterDept: () => void;
  onViewAll: () => void;
  onAddEmployee: () => void;
}

export const PlannedAbsencesTimeline: React.FC<PlannedAbsencesTimelineProps> = ({
  employees,
  attendances,
  totalEmployees,
  presentToday,
  lateToday,
  selectedDept,
  onFilterDept,
  onViewAll,
  onAddEmployee,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate all days of the selected month
  const calendarDays = useMemo(() => {
    const days = [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const isToday = isCurrentMonth && today.getDate() === dayNum;

      const mm = String(month + 1).padStart(2, '0');
      const dd = String(dayNum).padStart(2, '0');
      const dateKey = `${year}-${mm}-${dd}`;

      days.push({
        date: d,
        dayName,
        dayNumber: dayNum,
        isWeekend,
        isToday,
        dateKey,
      });
    }
    return days;
  }, [selectedDate]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Planned Absences
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {totalEmployees || employees.length} Karyawan Terdaftar • {presentToday} Hadir Hari Ini{' '}
            {lateToday > 0 ? `(${lateToday} Terlambat)` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Month Filter Popover Pill */}
          <MonthFilterPopover
            selectedDate={selectedDate}
            onSelectMonth={setSelectedDate}
          />

          {/* Filter Department Button */}
          <button
            onClick={onFilterDept}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold shadow-sm transition-all cursor-pointer ${
              selectedDept
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
            }`}
            title="Filter Departemen"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>{selectedDept || 'Filter'}</span>
          </button>

          {/* View All Button */}
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            title="Lihat Semua Absensi"
          >
            <span>View all</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Tambah Karyawan Button */}
          <button
            onClick={onAddEmployee}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all ml-1 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </div>

      {/* Grid Timeline Component */}
      <TimelineCalendarGrid
        employees={employees}
        attendances={attendances}
        calendarDays={calendarDays}
      />
    </div>
  );
};
