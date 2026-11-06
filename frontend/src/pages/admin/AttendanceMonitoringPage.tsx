import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios.js';
import { SidebarLayout } from '../../components/SidebarLayout.js';
import type { Employee, Attendance } from '../../types/index.js';
import { RefreshCw } from 'lucide-react';
import { AttendanceMonitoringStats } from '../../components/admin/monitoring/AttendanceMonitoringStats.js';
import { AttendanceMonitoringFilters } from '../../components/admin/monitoring/AttendanceMonitoringFilters.js';
import { AttendanceMonitoringTable } from '../../components/admin/monitoring/AttendanceMonitoringTable.js';
import { PhotoZoomModal } from '../../components/attendance/PhotoZoomModal.js';

export const AttendanceMonitoringPage: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalToday: 0,
    presentToday: 0,
    lateToday: 0,
  });

  // Modal preview photo
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/attendance/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  }, []);

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterDate) params.date = filterDate;
      if (filterEmployeeId) params.employeeId = filterEmployeeId;

      const res = await api.get('/attendance', { params });
      setAttendances(res.data.data || []);
    } catch (err) {
      console.error('Failed to load attendances', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterDate, filterEmployeeId]);

  useEffect(() => {
    fetchStats();
    fetchEmployees();
  }, [fetchStats, fetchEmployees]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
    fetchAttendances();
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 pb-12">
        {/* Header & Quick Stats */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Monitoring Absensi WFH
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Pantau verifikasi presensi kerja jarak jauh seluruh karyawan secara real-time
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
              title="Segarkan data presensi"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-400 ${
                  refreshing ? 'animate-spin text-emerald-600' : ''
                }`}
              />
              <span>Segarkan</span>
            </button>
          </div>

          <AttendanceMonitoringStats
            totalToday={stats.totalToday}
            presentToday={stats.presentToday}
            lateToday={stats.lateToday}
          />
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              Audit Trail Presensi Masuk
            </h3>

            <AttendanceMonitoringFilters
              filterDate={filterDate}
              onDateChange={setFilterDate}
              filterEmployeeId={filterEmployeeId}
              onEmployeeChange={setFilterEmployeeId}
              searchEmployee={searchEmployee}
              onSearchChange={setSearchEmployee}
              employees={employees}
            />
          </div>

          <AttendanceMonitoringTable
            attendances={attendances}
            loading={loading}
            searchEmployee={searchEmployee}
            onPreviewPhoto={setPreviewPhoto}
          />
        </div>
      </div>

      <PhotoZoomModal
        photoUrl={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
      />
    </SidebarLayout>
  );
};
