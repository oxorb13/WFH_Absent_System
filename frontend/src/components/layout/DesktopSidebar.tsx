import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

interface DesktopSidebarProps {
  isAdmin: boolean;
  navItems: NavItem[];
  userInitials: string;
  displayName: string;
  onLogout: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isAdmin,
  navItems,
  userInitials,
  displayName,
  onLogout,
}) => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 p-6 fixed inset-y-0 left-0 z-30 justify-between">
      <div className="space-y-8">
        {/* Brand Logo Header */}
        <Link
          to={isAdmin ? '/admin' : '/attendance'}
          className="flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                WFH ABSENT
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 tracking-wider">
                APP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Employee Attendance Portal</p>
          </div>
        </Link>

        {/* Navigation Section */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Menu Utama
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile Card */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm flex-shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] text-slate-400 capitalize truncate font-medium">
                  {isAdmin ? 'Admin HRD' : 'Karyawan WFH'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Keluar akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

