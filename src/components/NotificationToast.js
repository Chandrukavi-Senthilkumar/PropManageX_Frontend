import React, { useEffect } from 'react';

/**
 * @param {Object|null} notification
 * @param {{ type: 'success' | 'error', message: string }} notification
 * @param {Function} onClose
 */
const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const baseStyles =
    'fixed bottom-4 right-4 px-5 py-3 rounded-xl shadow-xl text-sm font-bold z-[999] transition-all';

  const typeStyles =
    notification.type === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div className={`${baseStyles} ${typeStyles}`}>
      {notification.message}
      <button
        onClick={onClose}
        className="ml-4 font-normal underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default NotificationToast;
