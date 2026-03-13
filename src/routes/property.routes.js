import Property from '../pages/properties/PropertyList'
import DashboardLayout from '../layout/DashboardLayout'

export const PropertyRoutes = [
     {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "Property", element: <Property /> },
      // Add other internal pages here
    ]
  }
];