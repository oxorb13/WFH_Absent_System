import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import type { Employee } from '../../types/index.js';
import { Edit2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmployeeProfileFields } from './EmployeeProfileFields.js';
import { EmployeePhotoUploader } from './EmployeePhotoUploader.js';

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });

  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
      });
      setEditPhotoFile(null);
      setEditPhotoPreview(null);
      setFormError(null);
      setFormSuccess(null);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      let uploadedPhotoUrl = employee.photoUrl;
      if (editPhotoFile) {
        const photoData = new FormData();
        photoData.append('photo', editPhotoFile);
        const uploadRes = await api.post('/employees/upload-photo', photoData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedPhotoUrl = uploadRes.data.photoUrl;
      }

      await api.put(`/employees/${employee.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        photoUrl: uploadedPhotoUrl,
      });

      setFormSuccess('Data karyawan berhasil diperbarui!');
      setTimeout(() => {
        setFormSuccess(null);
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengubah data karyawan';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Ubah Data Karyawan</h3>
              <p className="text-xs text-slate-400 font-mono">NIP: {employee.employeeCode}</p>
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
            label="Foto Master Wajah Karyawan (Biometrik WFH)"
            previewUrl={editPhotoPreview || employee.photoUrl || null}
            onFileSelect={(file) => {
              setEditPhotoFile(file);
              setEditPhotoPreview(URL.createObjectURL(file));
            }}
            helperText="Format JPG, PNG, atau WEBP. Rekomendasi foto formal tampak depan jelas."
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
              {submitting ? 'Menyimpan...' : 'Perbarui Karyawan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
