import Signuup from '../pages/signup/SignupPage'
import VerifyOtpPage from '../pages/VerifyOtpPage/VerifyOtpPage'
import SetPasswordPage from '../pages/signup/SetPasswordPage';

const AuthRoutes = [
  { path: "/signup", element: <Signuup /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> },
  { path: "/set-password", element: <SetPasswordPage /> }
];
export { AuthRoutes };