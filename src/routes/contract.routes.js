import Contract from '../pages/Contract/contract';
import DashboardLayout from '../layout/DashboardLayout';


export const Contracts=[
    {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "contract", element: <Contract /> },
      // Add other internal pages here
    ]
  }
];

