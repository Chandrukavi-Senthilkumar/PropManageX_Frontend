import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Properties', path: '/Property', icon: BuildingOfficeIcon },
    { name: 'Add Users', path: '/add-user', icon: UserGroupIcon },
     { name: 'Deals', path: '/deals', icon: UserGroupIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold">P</div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-gray-800">PropManage<span className="text-blue-600">X</span></span>}
        </div>

        <nav className="flex-grow mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Kavin+Chandru&background=0D8ABC&color=fff" alt="User" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-black text-gray-800 truncate">Chandru</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          
          </div>
        {/* TOP NAVIGATION BAR */}
        <div className="h-20  border-b border-gray-100 flex items-end justify-end mt-3 px-8 z-40">   
             <div className="text-sm font-bold text-red-500 hover:bg-red-50 p-2 px-4 rounded-xl transition-all">
                Logout
             </div>
         
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <section className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* This is where PropertyList.js will render */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;