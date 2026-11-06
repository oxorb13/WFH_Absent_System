import React from 'react';

interface EmployeeProfileFieldsProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  position: string;
  onPositionChange: (val: string) => void;
  employeeCode?: string;
  onEmployeeCodeChange?: (val: string) => void;
  isCreateMode?: boolean;
}

export const EmployeeProfileFields: React.FC<EmployeeProfileFieldsProps> = ({
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  department,
  onDepartmentChange,
  position,
  onPositionChange,
  employeeCode,
  onEmployeeCodeChange,
  isCreateMode = false,
}) => {
  return (
    <div className="space-y-4">
      {isCreateMode && onEmployeeCodeChange && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 mb-1.5 block">NIP / Kode *</label>
            <input
              type="text"
              required
              value={employeeCode}
              onChange={(e) => onEmployeeCodeChange(e.target.value)}
              placeholder="Contoh: EMP002"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 mb-1.5 block">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Nama Karyawan"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      )}

      {!isCreateMode && (
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">Nama Lengkap *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">Email Perusahaan *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="nama@company.com"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">Nomor WhatsApp / HP</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="08123456789"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">Departemen</label>
          <input
            type="text"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            placeholder="IT / HR / Marketing"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">Jabatan / Posisi</label>
          <input
            type="text"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            placeholder="Software Engineer"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

