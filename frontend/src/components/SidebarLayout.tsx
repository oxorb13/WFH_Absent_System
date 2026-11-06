import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Users, CalendarCheck } from 'lucide-react';
import { DesktopSidebar } from './layout/DesktopSidebar.js';
import { MobileNavigation } from './layout/MobileNavigation.js';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin
    ? [
        {
          label: 'Master Karyawan',
          path: '/admin',
          icon: Users,
          badge: 'CRUD',
        },
        {
          label: 'Monitoring Absensi',
          path: '/admin/attendance',
          icon: CalendarCheck,
          badge: 'Live',
        },
      ]
    : [
        {
          label: 'Presensi WFH',
          path: '/attendance',
          icon: CalendarCheck,
          badge: 'Daily',
        },
      ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const displayName = user?.employee?.fullName || user?.username || 'User';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Desktop Sidebar Component */}
      <DesktopSidebar
        isAdmin={isAdmin}
        navItems={navItems}
        userInitials={getInitials(displayName)}
        displayName={displayName}
        onLogout={handleLogout}
      />

      {/* Mobile Top Header & Navigation Drawer */}
      <MobileNavigation
        isAdmin={isAdmin}
        navItems={navItems}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-transparent">
          <div></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-sm">
              {isAdmin ? 'ADMIN HRD' : 'EMPLOYEE'}
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 px-4 sm:px-8 py-6 lg:py-4 pt-20 lg:pt-2 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
