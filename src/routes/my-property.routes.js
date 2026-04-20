import React from 'react';
import DashboardLayout from '../layout/DashboardLayout'; 
import MyProperty from '../pages/MyProperty/MyProperty';
import PropertyRequest from '../pages/MyProperty/AdminMaintenance';

export const MyPropertyRoutes = [
    {
        path: "/",
        element: <DashboardLayout />, 
        children: [
            {
                path: "my-property",
                element: <MyProperty />,
            },{
                path:"property-request",
                element:<PropertyRequest />
            }
        ],
    },
];