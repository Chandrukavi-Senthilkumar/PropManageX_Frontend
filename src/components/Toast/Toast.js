import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-[#F3EEF2]',
      icon: <CheckCircleIcon className="w-6 h-6 text-white" />,
      label: 'Success'
    },
    error: {
      bg: 'bg-red-600',
      icon: <ExclamationCircleIcon className="w-6 h-6 text-white" />,
      label: 'Error'
    }
  };

  const active = config[type];

  return (
    /* Changed positioning from bottom-center to top-right */
    <div className={`fixed top-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl animate-in slide-in-from-right-10 duration-300 ${active.bg} text-white min-w-[320px] max-w-sm`}>
      <div className="bg-white p-2 rounded-xl">
        {active.icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">{active.label}</p>
        <p className="font-bold text-sm leading-tight">{message}</p>
      </div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform p-1">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;