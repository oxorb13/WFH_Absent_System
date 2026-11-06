import React from 'react';
import type { Attendance } from '../../../types/index.js';
import { CalendarCheck, Maximize2, ShieldCheck } from 'lucide-react';

interface AttendanceMonitoringTableProps {
  attendances: Attendance[];
  loading: boolean;
  searchEmployee: string;
  onPreviewPhoto: (url: string) => void;
}

const formatDateIndo = (dateStr?: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatWIB = (dateStr: string) => {
  return (
    new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  );
};

export const AttendanceMonitoringTable: React.FC<AttendanceMonitoringTableProps> = ({
  attendances,
  loading,
  searchEmployee,
  onPreviewPhoto,
}) => {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Memuat rekapan absensi WFH...</p>
      </div>
    );
  }

  const filtered = attendances.filter((att) => {
    if (!searchEmployee) return true;
    const term = searchEmployee.toLowerCase();
    const name = att.employee?.fullName?.toLowerCase() || '';
    const code = att.employee?.employeeCode?.toLowerCase() || '';
    return name.includes(term) || code.includes(term);
  });

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-700">Belum ada data absensi untuk filter ini</p>
        <p className="text-xs text-slate-400">Pilih tanggal lain atau reset filter karyawan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[960px] text-left text-sm divide-y divide-slate-100">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
            <th className="py-4 px-6 whitespace-nowrap min-w-[130px]">Bukti Foto WFH</th>
            <th className="py-4 px-5 whitespace-nowrap min-w-[200px]">Karyawan</th>
            <th className="py-4 px-5 whitespace-nowrap min-w-[180px]">Departemen</th>
            <th className="py-4 px-5 whitespace-nowrap min-w-[150px]">Tanggal Presensi</th>
            <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Waktu Masuk</th>
            <th className="py-4 px-5 whitespace-nowrap min-w-[200px]">Catatan Aktivitas</th>
            <th className="py-4 px-6 whitespace-nowrap min-w-[140px] text-right">Status Kehadiran</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filtered.map((att) => (
            <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
              {/* Thumbnail Foto Bukti */}
              <td className="py-3 px-6 whitespace-nowrap">
                {att.photoUrl &&
                !att.photoUrl.includes('privacy') &&
                !att.photoUrl.includes('deleted') ? (
                  <button
                    type="button"
                    onClick={() => onPreviewPhoto(att.photoUrl)}
                    className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 block group shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    title="Klik untuk memperbesar foto bukti"
                  >
                    <img
                      src={att.photoUrl}
                      alt="Bukti Foto Presensi"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center text-[9px] font-black text-center p-1 shadow-sm select-none"
                    title="Foto bukti telah terverifikasi secara real-time dan langsung dihapus demi privasi karyawan"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <span>Privasi</span>
                  </div>
                )}
              </td>

              {/* Info Karyawan */}
              <td className="py-4 px-5 whitespace-nowrap">
                <p className="font-bold text-slate-900 leading-snug">
                  {att.employee?.fullName || 'Karyawan'}
                </p>
                <span className="text-xs text-slate-400 font-mono">
                  {att.employee?.employeeCode || '-'}
                </span>
              </td>

              {/* Departemen & Posisi */}
              <td className="py-4 px-5 whitespace-nowrap">
                <span className="font-semibold text-slate-800 block text-xs sm:text-sm">
                  {att.employee?.department || '-'}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {att.employee?.position || '-'}
                </span>
              </td>

              {/* Tanggal Absensi */}
              <td className="py-4 px-5 whitespace-nowrap text-xs font-semibold text-slate-700">
                {formatDateIndo(att.checkInTime)}
              </td>

              {/* Waktu Masuk */}
              <td className="py-4 px-5 whitespace-nowrap font-mono font-bold text-xs text-slate-900">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">
                  {formatWIB(att.checkInTime)}
                </span>
              </td>

              {/* Catatan / Keterangan */}
              <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-600 max-w-xs truncate font-medium">
                {att.notes || '-'}
              </td>

              {/* Status Absensi */}
              <td className="py-4 px-6 whitespace-nowrap text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    att.status === 'present'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      att.status === 'present' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                  {att.status === 'present' ? 'Tepat Waktu' : 'Terlambat'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

