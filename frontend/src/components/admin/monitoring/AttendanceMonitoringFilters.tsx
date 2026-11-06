import React from 'react';
import type { Employee } from '../../../types/index.js';
import { Calendar, Search } from 'lucide-react';

interface AttendanceMonitoringFiltersProps {
  filterDate: string;
  onDateChange: (val: string) => void;
  filterEmployeeId: string;
  onEmployeeChange: (val: string) => void;
  searchEmployee: string;
  onSearchChange: (val: string) => void;
  employees: Employee[];
}

export const AttendanceMonitoringFilters: React.FC<AttendanceMonitoringFiltersProps> = ({
  filterDate,
  onDateChange,
  filterEmployeeId,
  onEmployeeChange,
  searchEmployee,
  onSearchChange,
  employees,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Filter */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
        <Calendar className="w-4 h-4 text-slate-400" />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-transparent text-sm text-slate-700 font-semibold focus:outline-none cursor-pointer"
        />
        {filterDate && (
          <button
            onClick={() => onDateChange('')}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Employee Filter */}
      <select
        value={filterEmployeeId}
        onChange={(e) => onEmployeeChange(e.target.value)}
        className="py-2.5 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
      >
        <option value="">Semua Karyawan</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>
            {e.fullName} ({e.employeeCode})
          </option>
        ))}
      </select>

      {/* Quick search input */}
      <div className="relative w-full sm:w-60">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchEmployee}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama karyawan..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        />
      </div>
    </div>
  );
};

