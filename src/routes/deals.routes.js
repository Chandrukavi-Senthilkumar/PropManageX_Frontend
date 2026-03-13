import DashboardLayout from "../layout/DashboardLayout";
import DealPage from "../pages/SalesPipeline/SalesPipeline"

export const Deals=[
    {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "deals", element: <DealPage /> },
      // Add other internal pages here
    ]
  }
]