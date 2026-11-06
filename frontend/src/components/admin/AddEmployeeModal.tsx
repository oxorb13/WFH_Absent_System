import React, { useState } from 'react';
import api from '../../api/axios.js';
import { UserPlus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmployeeProfileFields } from './EmployeeProfileFields.js';
import { EmployeePhotoUploader } from './EmployeePhotoUploader.js';
import { EmployeeCredentialsFields } from './EmployeeCredentialsFields.js';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'IT & Digital',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
    username: '',
    password: '',
  });

  const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);
  const [addPhotoPreview, setAddPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      let uploadedPhotoUrl = '';
      if (addPhotoFile) {
        const photoData = new FormData();
        photoData.append('photo', addPhotoFile);
        const uploadRes = await api.post('/employees/upload-photo', photoData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedPhotoUrl = uploadRes.data.photoUrl;
      }

      await api.post('/employees', {
        ...formData,
        photoUrl: uploadedPhotoUrl || undefined,
      });

      setFormSuccess('Karyawan baru dan foto master biometrik berhasil disimpan!');
      setTimeout(() => {
        setFormSuccess(null);
        setFormData({
          employeeCode: '',
          fullName: '',
          email: '',
          phone: '',
          department: 'IT & Digital',
          position: '',
          joinDate: new Date().toISOString().split('T')[0],
          username: '',
          password: '',
        });
        setAddPhotoFile(null);
        setAddPhotoPreview(null);
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menambahkan karyawan';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-xl w-full p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Tambah Karyawan Baru</h3>
              <p className="text-xs text-slate-400">Buat data profil & akun login otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <EmployeeProfileFields
            isCreateMode
            employeeCode={formData.employeeCode}
            onEmployeeCodeChange={(val) => setFormData({ ...formData, employeeCode: val })}
            fullName={formData.fullName}
            onFullNameChange={(val) => setFormData({ ...formData, fullName: val })}
            email={formData.email}
            onEmailChange={(val) => setFormData({ ...formData, email: val })}
            phone={formData.phone}
            onPhoneChange={(val) => setFormData({ ...formData, phone: val })}
            department={formData.department}
            onDepartmentChange={(val) => setFormData({ ...formData, department: val })}
            position={formData.position}
            onPositionChange={(val) => setFormData({ ...formData, position: val })}
          />

          <EmployeePhotoUploader
            label="Foto Master Wajah Karyawan (Untuk Verifikasi Biometrik)"
            previewUrl={addPhotoPreview}
            onFileSelect={(file) => {
              setAddPhotoFile(file);
              setAddPhotoPreview(URL.createObjectURL(file));
            }}
          />

          <EmployeeCredentialsFields
            username={formData.username}
            onUsernameChange={(val) => setFormData({ ...formData, username: val })}
            password={formData.password}
            onPasswordChange={(val) => setFormData({ ...formData, password: val })}
          />

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Karyawan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
