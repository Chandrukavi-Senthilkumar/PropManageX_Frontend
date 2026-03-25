// src/App.js

import AppRoutes from './routes/AppRoute'; // Adjust path if needed
import NotificationToast from './components/NotificationToast';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <NotificationToast />
    </div>
  );
}

export default App;