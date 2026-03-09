import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";

const renderRoutes = (routes) => {
  return routes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));
};

const AppRoutes = () => {
  const allRoutes = [
    ...AuthRoutes,
  
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