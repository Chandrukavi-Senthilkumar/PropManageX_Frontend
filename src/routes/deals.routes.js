import DashboardLayout from "../layout/DashboardLayout";
import DealPage from "../pages/DealListPage/DealListPage"

export const Deals=[
    {
    path: "/",
    element: <DashboardLayout />,
    protected: true,
    children: [
      { path: "deals", element: <DealPage /> ,protected: true},
      // Add other internal pages here
    ]
  }
]