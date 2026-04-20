import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../redux/slices/adminSlice';
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  ReceiptPercentIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { authService } from '../services/authService';
import { showSuccess } from '../redux/slices/notificationSlice';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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

  // 1. Define all possible menu items
  const allMenuItems = [
    { name: 'Properties', path: '/Property', icon: BuildingOfficeIcon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst', 'BuyerAndTenant'] },
    { name: 'Deals', path: '/deals', icon: UserGroupIcon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst',] },
    { name: 'Contract', path: '/contract', icon: DocumentTextIcon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst',] }, 
    { name: 'Invoice', path: '/invoice', icon: ReceiptPercentIcon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst',] },
    { name: 'Revenue Reports', path: '/revenues', icon: ChartBarIcon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst',] },
    { name: 'My Property', path: '/my-property', icon: BuildingOffice2Icon, roles: ['BuyerAndTenant'] },
    { name: 'Property Requests', path: '/property-request', icon: BuildingOffice2Icon, roles: ['Admin','SalesAndLeasingAgent','PropertyManager','FinanceAnalyst',] },
  ];

  // 2. Filter menu items based on the current user's role
  const filteredMenuItems = allMenuItems.filter(item => 
    item.roles.includes(profile?.role)
  );

  // 3. Security Guard: Prevent "BuyerAndTenant" from staying on restricted URLs
  const restrictedPaths = ['/deals', '/contract', '/invoice', '/revenues', '/property-request'];
  const isAccessingRestricted = restrictedPaths.some(path => location.pathname.startsWith(path));

  if (!loading && profile?.role === 'BuyerAndTenant' && isAccessingRestricted) {
    return <Navigate to="/Property" replace />;
  }

  return (
    <div className="flex h-screen bg-[#FAF6F9] overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 flex flex-col`}>
        <div className="px-6 py-6 flex items-center bg-[#FAF6F9] h-[72px]">
          <div className="font-bold text-lg whitespace-nowrap overflow-hidden">
            {isSidebarOpen ? (
              <span>PropManage<span className="text-[#5B3E59]">X</span></span>
            ) : (
              <span className="text-[#5B3E59] text-2xl ml-1">P</span>
            )}
          </div>
        </div>

        <nav className="mt-6 px-3 space-y-1 flex-1">
          {filteredMenuItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                  ${active ? 'bg-[#5B3E59]/10 text-[#5B3E59]' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#FAF6F9]">
          <div className="flex items-center justify-between px-6 py-4 relative">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(showSuccess('No new notifications'))}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <BellIcon className="w-6 h-6 text-gray-700" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#F3EEF2] hover:bg-[#E9E1E8] transition shadow-sm"
                >
                  <div className="w-9 h-9 bg-[#846E83] rounded-full text-white font-bold flex items-center justify-center">
                    {profile?.adminName?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {loading ? 'Loading...' : profile?.adminName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{profile?.role}</p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-[9999] overflow-hidden bg-white">
                    {/* Only show Add User to Admins */}
                    {profile?.role === 'Admin' && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/add-user');
                        }}
                        className="w-full px-5 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors bg-white"
                      >
                        <UserPlusIcon className="w-5 h-5 text-gray-500" />
                        Add User
                      </button>
                    )}

                    <div className="h-[1px] w-full bg-gray-100"></div>

                    <button
                      onClick={async () => {
                        setIsDropdownOpen(false);
                        await authService.logout();
                      }}
                      className="w-full px-5 py-4 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors bg-white"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-500" />
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