import DashboardLayout from "../layout/DashboardLayout";
import DealPage from "../pages/DealListPage/DealListPage"

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