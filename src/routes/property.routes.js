import { Navigate } from 'react-router-dom';
import Property from '../pages/properties/PropertyList';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardLayout from '../layout/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

export const PropertyRoutes = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'Property', element: <Property /> },
    ],
  },
  {
    path: '/Property',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Property /> },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/" replace />,
  },
];