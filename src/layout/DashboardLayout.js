import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../redux/slices/adminSlice';
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  CheckBadgeIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { authService } from '../services/authService';
import { showSuccess } from '../redux/slices/notificationSlice';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.admin || {});

  useEffect(() => {
    if (!profile) dispatch(fetchAdminProfile());
  }, [dispatch, profile]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
    <div className="flex h-screen bg-[#FAF6F9] overflow-hidden">

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300`}
      >
        <div className="px-4 py-6 flex justify-center bg-[#FAF6F9]">
          <div className="w-12 h-12 bg-[#846E83] rounded-xl
                          flex items-center justify-center
                          text-white font-bold text-lg shadow">
            P
          </div>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                  ${active
                    ? 'bg-[#5B3E59]/10 text-[#5B3E59]'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-[#FAF6F9]">
          <div className="flex items-center justify-between px-6 py-4 relative">

            <div className="absolute left-1/2 -translate-x-1/2 font-bold text-lg">
              PropManage<span className="text-[#5B3E59]">X</span>
            </div>

            <div className="ml-auto flex items-center gap-4">

              <button
                onClick={() => dispatch(showSuccess('No new notifications'))}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <BellIcon className="w-6 h-6 text-gray-700" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2
                             rounded-2xl bg-[#F3EEF2]
                             hover:bg-[#E9E1E8]
                             transition shadow-sm"
                >
                  <div className="w-9 h-9 bg-[#846E83]
                                  rounded-full text-white
                                  font-bold flex items-center justify-center">
                    {profile?.adminName?.[0] || 'U'}
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {loading ? 'Loading...' : profile?.adminName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profile?.role}
                    </p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white
                                  border rounded-xl shadow-lg z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/add-user');
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex gap-2"
                    >
                      <UserPlusIcon className="w-5 h-5" />
                      Add User
                    </button>

                    <button
                      onClick={async () => {
                        setIsDropdownOpen(false);
                        await authService.logout();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex gap-2"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 min-h-full">
            <Outlet />
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardLayout;