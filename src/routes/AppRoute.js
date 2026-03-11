import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    // If the route has children, we need to wrap them
    if (route.children) {
      return (
        <Route key={route.path || index} path={route.path} element={route.element}>
          {renderRoutes(route.children)} {/* Recursion: This handles the nested pages */}
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
    ...AuthRoutes,
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