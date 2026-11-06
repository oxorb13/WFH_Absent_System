import React from 'react';
import type { Employee } from '../../types/index.js';
import { Users, Search } from 'lucide-react';
import { EmployeeTableRow } from './EmployeeTableRow.js';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedDept: string;
  onDeptChange: (val: string) => void;
  onEdit: (emp: Employee) => void;
  onToggleActive: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  searchQuery,
  onSearchChange,
  selectedDept,
  onDeptChange,
  onEdit,
  onToggleActive,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Data Karyawan
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {employees.length} Karyawan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Kelola direktori seluruh karyawan WFH Absent App (CRUD & Manajemen Akun)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama karyawan, NIP, atau email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => onDeptChange(e.target.value)}
          className="py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
        >
          <option value="">Semua Departemen</option>
          <option value="IT & Digital">IT & Digital</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance & Accounting">Finance & Accounting</option>
          <option value="Supply Chain">Supply Chain</option>
        </select>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Memuat data master karyawan...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">Tidak ada data karyawan ditemukan</p>
          <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter departemen.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-4 px-6 whitespace-nowrap min-w-[220px]">Karyawan</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[120px]">NIP / Kode</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[220px]">Departemen & Jabatan</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[230px]">Kontak</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Tgl Bergabung</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[120px]">Status</th>
                <th className="py-4 px-6 whitespace-nowrap min-w-[110px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <EmployeeTableRow
                  key={emp.id}
                  emp={emp}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
