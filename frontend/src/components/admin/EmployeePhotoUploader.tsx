import React from 'react';
import { Camera } from 'lucide-react';

interface EmployeePhotoUploaderProps {
  label: string;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  helperText?: string;
}

export const EmployeePhotoUploader: React.FC<EmployeePhotoUploaderProps> = ({
  label,
  previewUrl,
  onFileSelect,
  helperText = 'Foto wajah tampak depan. Digunakan sistem untuk mencocokkan biometrik wajah saat absensi WFH.',
}) => {
  return (
    <div className="pt-2">
      <label className="font-bold text-slate-700 mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview Wajah Master"
            className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-slate-200 text-slate-400 flex flex-col items-center justify-center text-[10px] font-bold flex-shrink-0">
            <Camera className="w-5 h-5 mb-0.5 text-slate-400" />
            <span>Foto</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
            className="w-full text-xs text-slate-600 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            {helperText}
          </p>
        </div>
      </div>
    </div>
  );
};

