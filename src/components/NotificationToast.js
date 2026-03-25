import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../redux/slices/propertySlice';

const NotificationToast = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.property.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const baseStyles = 'fixed bottom-4 right-4 px-5 py-3 rounded-xl shadow-xl text-sm font-bold z-[999] transition-all';
  const typeStyles =
    notification.type === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div className={`${baseStyles} ${typeStyles}`}>
      {notification.message}
      <button
        onClick={() => dispatch(clearNotification())}
        className="ml-4 font-normal underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default NotificationToast;
