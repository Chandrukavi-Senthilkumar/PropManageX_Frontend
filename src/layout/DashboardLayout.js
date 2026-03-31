import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../redux/slices/adminSlice'; 
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { authService } from '../services/authService';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.admin || {});

  useEffect(() => {
    if (!profile) {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Properties', path: '/Property', icon: BuildingOfficeIcon },
    { name: 'Deals', path: '/deals', icon: UserGroupIcon },
    { name: 'Contract', path: '/contract', icon: UserGroupIcon },
    { name: 'Invoice', path: '/invoice', icon: UserGroupIcon },
    { name: 'Revenue Reports', path: '/revenues', icon: CheckBadgeIcon },
    { name: 'My Property', path: '/my-property', icon: BuildingOffice2Icon }, 
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50 shadow-sm`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-lg">P</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight text-slate-900">PropManage<span className="text-blue-600">X</span></span>}
        </div>
        <nav className="flex-grow mt-8 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${isActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex items-center justify-center text-white font-black uppercase tracking-tighter">
                  {profile?.adminName ? (
                    <img src={`https://ui-avatars.com/api/?name=${profile.adminName}&background=0D8ABC&color=fff`} alt="Profile" />
                  ) : ( "..." )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {loading ? "Loading..." : profile?.adminName || "User"}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight">
                    {profile?.role || "Administrator"}
                  </p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{profile?.adminName}</p>
                    <p className="text-xs text-slate-500 truncate">{profile?.adminEmail}</p>
                  </div>

                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/add-user'); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors"
                  >
                    <UserPlusIcon className="w-5 h-5 text-slate-400" />
                    Add User
                  </button>

                  <button
                    onClick={async () => {
                      setIsDropdownOpen(false);
                      await authService.logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="flex-grow overflow-y-auto p-6">
          {/* Outlet is where MyProperty will render */}
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout; 