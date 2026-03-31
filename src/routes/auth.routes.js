// src/routes/auth.routes.js
import AuthLayout from '../layout/AuthLayout';
import SignupPage from '../pages/signup/SignupPage';
import VerifyOtpPage from '../pages/VerifyOtpPage/VerifyOtpPage';
import SetPasswordPage from '../pages/signup/SetPasswordPage';
import Login from '../pages/login/LoginPage';
import Landingpage from '../pages/Landing/LandingPage';
import ForgotPassword from '../pages/login/ForgotPassword';

export const AuthRoutes = [
  {
    path: "/",
    element: <Landingpage />, // Landing page usually stands alone
  },
  {
    element: <AuthLayout />, // WRAPPER START
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <SignupPage />
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />
      },
      {
        path: "/set-password", 
        element: <SetPasswordPage />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      }
    ]
  }
];