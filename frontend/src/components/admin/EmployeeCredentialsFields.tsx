import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface EmployeeCredentialsFieldsProps {
  username: string;
  onUsernameChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
}

export const EmployeeCredentialsFields: React.FC<EmployeeCredentialsFieldsProps> = ({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
}) => {
  return (
    <div className="pt-3 border-t border-slate-100">
      <p className="font-extrabold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Kredensial Akun Login Karyawan
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">
            Username *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="username_karyawan"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 mb-1.5 block">
            Password Awal *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

