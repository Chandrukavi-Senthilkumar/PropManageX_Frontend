// src/App.js

import AppRoutes from './routes/AppRoute'; // Adjust path if needed
import './App.css';

function App() {
  return (
    <div className="App">
      {/* If you have a Navbar, place it here so it shows on all pages */}
      <AppRoutes />
    </div>
  );
}

export default App;