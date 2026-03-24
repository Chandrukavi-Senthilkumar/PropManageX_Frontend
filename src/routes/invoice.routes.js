import DashboardLayout from "../layout/DashboardLayout";
import Invoice from "../pages/Invoice/Invoice"

export const InvoicePage=[
    {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "invoice", element: <Invoice /> },

    ]
  }
]