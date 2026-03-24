import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { authService } from '../services/authService';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userRole, setUserRole] = useState('Visitor');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthentication = () => {
    const token = localStorage.getItem('accessToken') || document.cookie.match(/(^|;)\s*accessToken\s*=\s*([^;]+)/)?.pop();
    return !!token;
  };

  const fetchProfile = async () => {
    if (!checkAuthentication()) {
      setIsAuthenticated(false);
      setUserName('Guest');
      setUserRole('Visitor');
      return;
    }

    setIsLoadingProfile(true);
    try {
      const response = await authService.getCurrentUser();
      const data = response?.data;
      if (Array.isArray(data) && data.length > 0) {
        const current = data[0];
        setUserName(current.AdminName || current.name || 'Administrator');
        setUserRole(current.Role || current.role || 'Manager');
        setProfileDetails(current);
        setIsAuthenticated(true);
        localStorage.setItem('userName', current.AdminName || current.name || 'Administrator');
        localStorage.setItem('userRole', current.Role || current.role || 'Manager');
      } else {
        setUserName('Guest');
        setUserRole('Visitor');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.warn('Could not fetch profile:', error);
      setUserName('Guest');
      setUserRole('Visitor');
      setIsAuthenticated(false);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Properties', path: '/Property', icon: BuildingOfficeIcon },
    { name: 'Add Users', path: '/add-user', icon: UserGroupIcon },
    { name: 'Deals', path: '/deals', icon: CheckBadgeIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive 
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

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-md overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`} alt="User" />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-600">{userRole}</p>
                </div>
              )}
            </div>

            {isSidebarOpen && !isAuthenticated && (
              <button
                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded transition-colors"
              >
                Login to view profile
              </button>
            )}

            {isSidebarOpen && isAuthenticated && (
              <>
                <button
                  onClick={fetchProfile}
                  className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded transition-colors mb-2"
                >
                  Refresh Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    setIsAuthenticated(false);
                    setUserName('Guest');
                    setUserRole('Visitor');
                    navigate('/login', { state: { from: '/dashboard' } });
                  }}
                  className="w-full text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}

            {isSidebarOpen && isAuthenticated && profileDetails && (
              <button
                onClick={() => {
                  alert(`Name: ${profileDetails.AdminName || profileDetails.name}\nRole: ${profileDetails.Role || profileDetails.role}\nEmail: ${profileDetails.AdminEmail || profileDetails.email}\nPhone: ${profileDetails.PhoneNumber || profileDetails.phoneNumber}`);
                }}
                className="w-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white py-2 rounded transition-colors mt-2"
              >
                View account details
              </button>
            )}

            {isSidebarOpen && isLoadingProfile && (
              <p className="text-[10px] text-slate-500 mt-2">Loading profile...</p>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVIGATION BAR */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" />
            </div>
          </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <section className="flex-grow overflow-y-auto p-6 animate-fadeIn">
          <Outlet /> {/* This is where PropertyList.js will render */}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;