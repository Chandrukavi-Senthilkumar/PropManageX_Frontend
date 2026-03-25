import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";
import { PropertyRoutes } from "./property.routes";
import { User } from './user.routes';
import { Deals } from './deals.routes'
import { Contracts } from './contract.routes'
import { InvoicePage } from './invoice.routes'
import LandingPage from '../pages/Landing/LandingPage';
import Property from '../pages/properties/PropertyList';
import AddUser from '../pages/AddUser/AddUser';
import SalesPipeline from '../pages/SalesPipeline/SalesPipeline';
import DashboardLayout from '../layout/DashboardLayout';
import PropertyDetailsPage from '../pages/PropertyDetailsView/PropertyDetailsPage';
import AccountDetailsPage from '../pages/AccountDetails/AccountDetailsPage';
import RevenueReportPage from '../pages/RevenueReport/RevenueReportPage';
import ProtectedRoute from '../components/ProtectedRoute';

const renderRoutes = (routes) => {
  return routes.map((route, index) => {

    if (route.children) {
      return (
        <Route key={route.path || index} path={route.path} element={route.element}>
          {renderRoutes(route.children)} 
        </Route>
      );
    }

    // Standard flat route
    const element = route.allowedRoles ? (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        {route.element}
      </ProtectedRoute>
    ) : route.element;

    return (
      <Route key={route.path || index} path={route.path} element={element} />
    );
  });
};

const AppRoutes = () => {
  const allRoutes = [
    { path: "/", element: <LandingPage /> },
    ...AuthRoutes,
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "dashboard", element: <div>Dashboard Home</div>, allowedRoles: ['Admin', 'FinanceAnalyst', 'Buyer', 'Tenant'] },
        { path: "Property", element: <Property />, allowedRoles: ['Admin', 'FinanceAnalyst', 'Buyer'] },
        { path: "Property/:id", element: <PropertyDetailsPage />, allowedRoles: ['Admin', 'FinanceAnalyst', 'Buyer'] },
        { path: "add-user", element: <AddUser />, allowedRoles: ['Admin'] },
        { path: "deals", element: <SalesPipeline />, allowedRoles: ['Admin', 'Buyer'] },
        { path: "contract", element: <Contracts />, allowedRoles: ['Admin', 'FinanceAnalyst'] },
        { path: "invoice", element: <InvoicePage />, allowedRoles: ['Admin', 'FinanceAnalyst', 'Tenant'] },
        { path: "account", element: <AccountDetailsPage />, allowedRoles: ['Admin', 'FinanceAnalyst', 'Buyer', 'Tenant'] },
        { path: "revenues", element: <RevenueReportPage />, allowedRoles: ['Admin', 'FinanceAnalyst'] },
        // Add other routes here
      ]
    }
  ];

  return (
    <div className="containerStyle">
      <div className="innerContainerStyle">
        <Routes>
          {renderRoutes(allRoutes)}
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;