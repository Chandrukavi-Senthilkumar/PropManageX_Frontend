import React from 'react';
// Import the actual page component
import PropertyDetailsPage from '../pages/PropertyDetailsView/PropertyDetailsPage'; 
import DashboardLayout from '../layout/DashboardLayout';
import PropertyList from '../pages/properties/PropertyList'; // Assuming you have a list page

export const PropertyRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      // The main list of properties
      { path: "Property", element: <PropertyList /> }, 
      
      // The specific details page using the ID
      { path: "Property/:id", element: <PropertyDetailsPage /> } 
    ]
  }
];