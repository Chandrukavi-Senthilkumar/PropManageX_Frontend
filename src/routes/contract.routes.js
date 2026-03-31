import Contract from '../pages/Contract/contract';
import DashboardLayout from '../layout/DashboardLayout';


export const Contracts=[
    {
    path: "/",
    element: <DashboardLayout />,
    protected: true,
    children: [
      { path: "contract", element: <Contract /> ,protected: true},
      // Add other internal pages here
    ]
  }
];

