import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";
import { PropertyRoutes } from "./property.routes";
import { User } from './user.routes';
import { Deals } from './deals.routes';
import { Contracts } from './contract.routes';
import { InvoicePage } from './invoice.routes';
import { MyPropertyRoutes } from './myproperty.routes'; 

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={route.path || index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route key={route.path || index} path={route.path} element={route.element} />
    );
  });
};

const AppRoutes = () => {
  const allRoutes = [
    ...AuthRoutes,
    ...PropertyRoutes,
    ...User,
    ...Deals,
    ...Contracts,
    ...InvoicePage,
    ...MyPropertyRoutes, 
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