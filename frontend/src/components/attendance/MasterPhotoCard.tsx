import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface MasterPhotoCardProps {
  photoUrl?: string | null;
  fullName?: string;
  employeeCode?: string;
}

export const MasterPhotoCard: React.FC<MasterPhotoCardProps> = ({
  photoUrl,
  fullName,
  employeeCode,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
      {photoUrl ? (
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <img
            src={photoUrl}
            alt="Master Referensi Wajah"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-xs text-slate-900 truncate">
              {fullName}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              {employeeCode}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acuan Pencocokan Biometrik (1:1)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Belum Ada Foto Master
          </p>
          <p className="text-[11px] text-amber-700/80 leading-relaxed">
            HRD belum mengunggah foto master Anda. Presensi tetap dapat dilakukan menggunakan mode verifikasi audit selfie.
          </p>
        </div>
      )}
    </div>
  );
};
