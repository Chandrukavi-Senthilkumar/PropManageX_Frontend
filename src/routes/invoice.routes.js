import DashboardLayout from "../layout/DashboardLayout";
import Invoice from "../pages/Invoice/Invoice"
import RevenueReports from "../pages/RevenueReport/RevenueReportPage";

export const InvoicePage=[
    {
    path: "/",
    element: <DashboardLayout />,
    protected: true,
    children: [
      { path: "invoice", element: <Invoice />, protected: true },
      { path: "revenues", element: <RevenueReports />, protected: true }

    ]
  }
]