// src/routes/auth.routes.js
import SignupPage from '../pages/signup/SignupPage';
import VerifyOtpPage from '../pages/VerifyOtpPage/VerifyOtpPage';
import SetPasswordPage from '../pages/signup/SetPasswordPage';
import Login from '../pages/login/LoginPage';
import Landingpage from '../pages/Landing/LandingPage';

export const AuthRoutes = [
      {
        path: "/signup", // Matches /signup
        element: <SignupPage />
      },
      {
        path: "/verify-otp", // Matches /verify-otp
        element: <VerifyOtpPage />
      },
      {
        path: "/set-password", 
        element: <SetPasswordPage />
      },{
        path:"/login",
        element:<Login/>
      },{
        path:"/",
        element:<Landingpage/>
      }
  
  
];