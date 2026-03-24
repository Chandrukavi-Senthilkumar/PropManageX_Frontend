import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";
import { PropertyRoutes } from "./property.routes";
import { User } from './user.routes';
import { Deals } from './deals.routes'
import LandingPage from '../pages/Landing/LandingPage';

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
    return (
      <Route key={route.path || index} path={route.path} element={route.element} />
    );
  });
};

const AppRoutes = () => {
  const allRoutes = [
    { path: "/", element: <LandingPage /> },
    ...AuthRoutes,
    ...PropertyRoutes,
    ...User,
    ...Deals
    
    // Add other route files here as you grow
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