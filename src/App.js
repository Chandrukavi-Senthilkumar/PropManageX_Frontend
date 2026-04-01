import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoute';
import NotificationToast from './components/NotificationToast';
import { clearNotification } from './redux/slices/notificationSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state) => state.notification.notification
  );

  return (
    <div className="App">
      <AppRoutes />

      <NotificationToast
        notification={notification}
        onClose={() => dispatch(clearNotification())}
      />
    </div>
  );
}

export default App;