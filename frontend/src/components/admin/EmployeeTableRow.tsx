import React from 'react';
import type { Employee } from '../../types/index.js';
import { Edit2, Power, Mail, Phone } from 'lucide-react';

interface EmployeeTableRowProps {
  emp: Employee;
  onEdit: (emp: Employee) => void;
  onToggleActive: (emp: Employee) => void;
}

const getAvatarBg = (name: string) => {
  const colors = [
    'bg-emerald-100 text-emerald-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDateIndo = (dateStr?: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  emp,
  onEdit,
  onToggleActive,
}) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      {/* Avatar & Full Name */}
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="flex items-center gap-3">
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
          <div>
            <p className="font-bold text-slate-900 leading-snug">{emp.fullName}</p>
            {emp.user?.username && (
              <span className="text-xs text-slate-400 font-mono font-normal">
                @{emp.user.username}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Employee Code */}
      <td className="py-4 px-5 whitespace-nowrap font-mono font-bold text-xs text-slate-700">
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
          {emp.employeeCode}
        </span>
      </td>

      {/* Department & Position */}
      <td className="py-4 px-5 whitespace-nowrap">
        <span className="font-semibold text-slate-800 block text-xs sm:text-sm">
          {emp.department || '-'}
        </span>
        <span className="text-xs text-slate-400 font-normal">
          {emp.position || '-'}
        </span>
      </td>

      {/* Contacts */}
      <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>{emp.email}</span>
        </div>
        {emp.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{emp.phone}</span>
          </div>
        )}
      </td>

      {/* Join Date */}
      <td className="py-4 px-5 whitespace-nowrap text-xs font-semibold text-slate-700">
        {formatDateIndo(emp.joinDate)}
      </td>

      {/* Status Pill */}
      <td className="py-4 px-5 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            emp.isActive === 1
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              emp.isActive === 1 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          ></span>
          {emp.isActive === 1 ? 'Aktif' : 'Non-Aktif'}
        </span>
      </td>

      {/* Action Buttons */}
      <td className="py-4 px-6 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(emp)}
            className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
            title="Edit Data Karyawan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(emp)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              emp.isActive === 1
                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={emp.isActive === 1 ? 'Non-aktifkan Karyawan' : 'Aktifkan Kembali'}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

