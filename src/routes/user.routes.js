import AddUser from '../pages/AddUser/AddUser'
import DashboardLayout from '../layout/DashboardLayout';

export const User = [
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "add-user", element: <AddUser /> },

        ]
    }
];