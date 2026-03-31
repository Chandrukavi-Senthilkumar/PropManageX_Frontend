import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; 
import { AuthRoutes } from "./auth.routes";
import { PropertyRoutes } from "./property.routes";
import { User } from './user.routes';
import { Deals } from './deals.routes';
import { Contracts } from './contract.routes';
import { InvoicePage } from './invoice.routes';

const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        const element = route.protected ? (
            <ProtectedRoute>{route.element}</ProtectedRoute>
        ) : (
            route.element
        );

        if (route.children) {
            return (
                <Route key={route.path || index} path={route.path} element={element}>
                    {renderRoutes(route.children)}
                </Route>
            );
        }

        return (
            <Route key={route.path || index} path={route.path} element={element} />
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
        { path: "/", element: <Navigate to="/Property" replace /> }
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