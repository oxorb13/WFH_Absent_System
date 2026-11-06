import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { SidebarLayout } from '../../components/SidebarLayout.js';
import type { Employee, Attendance } from '../../types/index.js';
import { PlannedAbsencesTimeline } from '../../components/admin/PlannedAbsencesTimeline.js';
import { EmployeeTable } from '../../components/admin/EmployeeTable.js';
import { AddEmployeeModal } from '../../components/admin/AddEmployeeModal.js';
import { EditEmployeeModal } from '../../components/admin/EditEmployeeModal.js';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Summary Stats
  const [empStats, setEmpStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });
  const [attStats, setAttStats] = useState({
    totalToday: 0,
    presentToday: 0,
    lateToday: 0,
  });

  // Employees data & filters
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Attendance data for Planned Absences timeline
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Fetch summary stats
  const fetchStats = useCallback(async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        api.get('/employees/stats'),
        api.get('/attendance/stats'),
      ]);
      setEmpStats(empRes.data);
      setAttStats(attRes.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  }, []);

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    try {
      setEmpLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedDept) params.department = selectedDept;

      const res = await api.get('/employees', { params });
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setEmpLoading(false);
    }
  }, [searchQuery, selectedDept]);

  // Fetch attendance list for Planned Absences timeline
  const fetchAttendance = useCallback(async () => {
    try {
      const res = await api.get('/attendance', { params: { limit: 500 } });
      setAttendances(res.data.data || []);
    } catch (err) {
      console.error('Failed to load attendances', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchEmployees();
    fetchAttendance();
  }, [fetchStats, fetchEmployees, fetchAttendance]);

  // Toggle active status (Soft delete / reactivate)
  const handleToggleActive = async (emp: Employee) => {
    const confirmAction = window.confirm(
      `Apakah Anda yakin ingin ${
        emp.isActive === 1 ? 'menonaktifkan' : 'mengaktifkan kembali'
      } karyawan ${emp.fullName}?`,
    );
    if (!confirmAction) return;

    try {
      await api.delete(`/employees/${emp.id}`);
      fetchEmployees();
      fetchStats();
    } catch (err) {
      alert('Gagal mengubah status karyawan');
    }
  };

  // Cycle department filter for Planned Absences
  const handleCycleDeptFilter = () => {
    const depts = [
      '',
      'IT & Digital',
      'Human Resources',
      'Marketing',
      'Finance & Accounting',
    ];
    const currentIdx = depts.indexOf(selectedDept);
    setSelectedDept(depts[(currentIdx + 1) % depts.length]);
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-12">
        {/* Planned Absences Timeline Board */}
        <PlannedAbsencesTimeline
          employees={employees}
          attendances={attendances}
          totalEmployees={empStats.totalEmployees}
          presentToday={attStats.presentToday}
          lateToday={attStats.lateToday}
          selectedDept={selectedDept}
          onFilterDept={handleCycleDeptFilter}
          onViewAll={() => navigate('/admin/attendance')}
          onAddEmployee={() => setIsAddModalOpen(true)}
        />

        {/* Master Data Karyawan Table */}
        <EmployeeTable
          employees={employees}
          loading={empLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          onEdit={(emp) => {
            setEditingEmployee(emp);
            setIsEditModalOpen(true);
          }}
          onToggleActive={handleToggleActive}
        />
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchEmployees();
          fetchStats();
        }}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={editingEmployee}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onSuccess={() => {
          fetchEmployees();
          fetchStats();
        }}
      />
    </SidebarLayout>
  );
};
