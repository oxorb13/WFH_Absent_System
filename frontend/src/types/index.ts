export type UserRole = 'admin' | 'employee';

export interface Employee {
  id: number;
  userId?: number;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  position?: string | null;
  photoUrl?: string | null;
  joinDate?: string | null;
  isActive: number;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    username: string;
    role: UserRole;
  };
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  employee?: Employee | null;
}

export type AttendanceStatus = 'present' | 'late';

export interface Attendance {
  id: number;
  employeeId: number;
  checkInTime: string;
  photoUrl: string;
  notes?: string | null;
  status: AttendanceStatus;
  createdAt?: string;
  employee?: Employee;
}

