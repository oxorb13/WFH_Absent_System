import type { Attendance } from '../types/index.js';
import { HeartPulse, Plane, Clock } from 'lucide-react';

export const formatWIB = (dateStr: string) => {
  return (
    new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  );
};

export const getAvatarBg = (name: string) => {
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

/**
 * Dribbble Planned Absences:
 * Normal on-time attendance has NO block color.
 * Only sick, leave, or late are highlighted!
 */
export const getAbsenceBadge = (att: Attendance) => {
  const notesLower = (att.notes || '').toLowerCase();

  // 1. SAKIT (Sick Leave) -> WARNA BIRU MUDA (Sesuai Dribbble)
  if (
    notesLower.includes('sakit') ||
    notesLower.includes('sick') ||
    notesLower.includes('flu') ||
    notesLower.includes('demam') ||
    notesLower.includes('rawat')
  ) {
    return {
      label: 'Sick Leave',
      sublabel: 'Approved',
      className:
        'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25 border border-blue-400/40',
      icon: HeartPulse,
    };
  }

  // 2. CUTI / LIBUR (Paid Leave / Vacation) -> WARNA UNGU
  if (
    notesLower.includes('cuti') ||
    notesLower.includes('leave') ||
    notesLower.includes('izin') ||
    notesLower.includes('libur')
  ) {
    return {
      label: notesLower.includes('libur') ? 'Vacation' : 'Paid Leave',
      sublabel: 'Approved',
      className:
        'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400/40',
      icon: Plane,
    };
  }

  // 3. TERLAMBAT (Late) -> WARNA AMBER / ORANYE
  if (att.status === 'late') {
    return {
      label: 'Terlambat',
      sublabel: formatWIB(att.checkInTime).slice(0, 5),
      className:
        'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25',
      icon: Clock,
    };
  }

  // 4. MASUK TEPAT WAKTU (Normal Present) -> TIDAK DIBERI WARNA (Clean)
  return null;
};

