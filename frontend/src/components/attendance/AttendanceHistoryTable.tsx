import React from 'react';
import type { Attendance } from '../../types/index.js';
import { ShieldCheck } from 'lucide-react';

interface AttendanceHistoryTableProps {
  history: Attendance[];
  loading: boolean;
  onPreviewPhoto: (url: string) => void;
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

const formatWIB = (dateStr: string) => {
  const d = new Date(dateStr);
  return (
    d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB'
  );
};

export const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({
  history,
  loading,
  onPreviewPhoto,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Riwayat Presensi WFH Terakhir
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Catatan waktu dan bukti foto kehadiran Anda di WFH Absent App
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Belum ada riwayat presensi yang tersimpan.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-4 px-6 whitespace-nowrap min-w-[110px]">Foto Bukti</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[160px]">Tanggal Presensi</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Waktu Masuk</th>
                <th className="py-4 px-5 whitespace-nowrap min-w-[220px]">Catatan Aktivitas</th>
                <th className="py-4 px-6 whitespace-nowrap min-w-[140px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 whitespace-nowrap">
                    {item.photoUrl &&
                    !item.photoUrl.includes('privacy') &&
                    !item.photoUrl.includes('deleted') ? (
                      <button
                        type="button"
                        onClick={() => onPreviewPhoto(item.photoUrl)}
                        className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 block group shadow-sm hover:scale-105 transition-transform cursor-pointer"
                      >
                        <img
                          src={item.photoUrl}
                          alt="Bukti Absen"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </button>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center text-[9px] font-black text-center p-1 shadow-sm select-none"
                        title="Foto bukti telah terverifikasi secara real-time dan langsung dihapus demi privasi karyawan"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
                        <span>Privasi</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap font-bold text-slate-800 text-xs sm:text-sm">
                    {formatDateIndo(item.checkInTime)}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap font-mono font-bold text-xs text-slate-900">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">
                      {formatWIB(item.checkInTime)}
                    </span>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap text-slate-600 text-xs max-w-xs truncate font-medium">
                    {item.notes || '-'}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'present'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'present' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      ></span>
                      {item.status === 'present' ? 'Tepat Waktu' : 'Terlambat'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

