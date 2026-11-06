import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthFilterPopoverProps {
  selectedDate: Date;
  onSelectMonth: (newDate: Date) => void;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export const MonthFilterPopover: React.FC<MonthFilterPopoverProps> = ({
  selectedDate,
  onSelectMonth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [navYear, setNavYear] = useState(selectedDate.getFullYear());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync navYear if selectedDate changes externally
  useEffect(() => {
    setNavYear(selectedDate.getFullYear());
  }, [selectedDate]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedMonthIdx = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const handleSelect = (mIdx: number) => {
    const newDate = new Date(navYear, mIdx, 1);
    onSelectMonth(newDate);
    setIsOpen(false);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setNavYear(now.getFullYear());
    onSelectMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setIsOpen(false);
  };

  const label = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Date Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer select-none active:scale-[0.98]"
        title="Klik untuk memilih filter bulan"
      >
        <Calendar className="w-4 h-4 text-emerald-600" />
        <span className="font-extrabold text-slate-800">{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 z-50 w-72 bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Year Navigation Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setNavYear((prev) => prev - 1)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Tahun Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-black text-sm text-slate-900 tracking-tight font-mono">
              {navYear}
            </span>

            <button
              type="button"
              onClick={() => setNavYear((prev) => prev + 1)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Tahun Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTH_SHORT.map((mName, idx) => {
              const isSelected = selectedYear === navYear && selectedMonthIdx === idx;
              const isCurrent =
                new Date().getFullYear() === navYear && new Date().getMonth() === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-102 font-extrabold'
                      : isCurrent
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {mName}
                  {isCurrent && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute top-1.5 right-1.5"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Jump to Today's Month */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-medium">Bulan Aktif</span>
            <button
              type="button"
              onClick={handleCurrentMonth}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Bulan Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

