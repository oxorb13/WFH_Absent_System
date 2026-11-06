import React, { useState, useEffect, useRef, useCallback } from 'react';
import type Webcam from 'react-webcam';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.js';
import { SidebarLayout } from '../../components/SidebarLayout.js';
import type { Attendance } from '../../types/index.js';
import { useAttendanceActions } from '../../hooks/useAttendanceActions.js';
import { AttendanceHeroBanner } from '../../components/attendance/AttendanceHeroBanner.js';
import { AttendanceCheckInCard } from '../../components/attendance/AttendanceCheckInCard.js';
import { MasterPhotoCard } from '../../components/attendance/MasterPhotoCard.js';
import { AttendanceGuidelinesCard } from '../../components/attendance/AttendanceGuidelinesCard.js';
import { AttendanceHistoryTable } from '../../components/attendance/AttendanceHistoryTable.js';
import { PhotoZoomModal } from '../../components/attendance/PhotoZoomModal.js';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance?limit=10'),
      ]);

      setTodayCheckedIn(todayRes.data.hasCheckedIn);
      setTodayAttendance(todayRes.data.attendance);
      setHistory(historyRes.data.data || []);
    } catch (err: any) {
      console.error('Failed to load attendance data', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    capturedImage,
    notes,
    setNotes,
    loading,
    error,
    successMsg,
    isVerifying,
    biometricResult,
    liveness,
    handleCapture,
    handleRetake,
    handleSubmit,
  } = useAttendanceActions({
    webcamRef,
    masterPhotoUrl: user?.employee?.photoUrl,
    onSuccess: fetchData,
  });

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-12">
        <AttendanceHeroBanner
          currentTime={currentTime}
          displayName={user?.employee?.fullName || user?.username || 'Karyawan'}
          department={user?.employee?.department || ''}
          employeeCode={user?.employee?.employeeCode || '-'}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <AttendanceCheckInCard
            todayCheckedIn={todayCheckedIn}
            todayAttendance={todayAttendance}
            webcamRef={webcamRef}
            capturedImage={capturedImage}
            onCapture={handleCapture}
            onRetake={handleRetake}
            isVerifying={isVerifying}
            biometricResult={biometricResult}
            hasMasterPhoto={Boolean(user?.employee?.photoUrl)}
            liveness={liveness}
            notes={notes}
            onNotesChange={setNotes}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            successMsg={successMsg}
            onPreviewPhoto={setPreviewPhoto}
          />

          <div className="lg:col-span-5 space-y-6">
            <MasterPhotoCard
              photoUrl={user?.employee?.photoUrl}
              fullName={user?.employee?.fullName}
              employeeCode={user?.employee?.employeeCode}
            />

            <AttendanceGuidelinesCard
              totalDays={history.length}
              todayCheckedIn={todayCheckedIn}
            />
          </div>
        </div>

        <AttendanceHistoryTable
          history={history}
          loading={historyLoading}
          onPreviewPhoto={setPreviewPhoto}
        />
      </div>

      <PhotoZoomModal
        photoUrl={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
      />
    </SidebarLayout>
  );
};
