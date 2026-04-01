import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const borderColor =
    notification.type === 'success'
      ? 'border-green-500'
      : 'border-red-500';

  return (
    <div className="fixed top-20 right-6 z-[9999] animate-slide-in">
      <div
        className={`bg-white border-l-4 ${borderColor} shadow-xl rounded-xl px-4 py-3 w-[320px] flex items-start gap-3`}
      >
        <p className="text-sm font-medium text-slate-800 flex-1">
          {notification.message}
        </p>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;