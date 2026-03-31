import React from 'react';
import DashboardLayout from '../layout/DashboardLayout'; 
import MyProperty from '../pages/MyProperty/MyProperty';

export const MyPropertyRoutes = [
    {
        path: "/",
        element: <DashboardLayout />, 
        children: [
            {
                path: "my-property",
                element: <MyProperty />,
            },
        ],
    },
];