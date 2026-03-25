import DashboardLayout from "../layout/DashboardLayout";
import Invoice from "../pages/Invoice/Invoice"
import RevenueReports from "../pages/RevenueReport/RevenueReportPage";

export const InvoicePage=[
    {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "invoice", element: <Invoice /> },
      {path:"revenues" ,element:<RevenueReports />}

    ]
  }
]