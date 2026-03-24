import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AuthLayout = () => {
  // Shared state for the email to pass through the Signup -> OTP -> Set Password flow
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 font-sans">
        {/* Main Card Container */}
        <div className="flex w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-xl min-h-[750px]">
          <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-blue-600 to-blue-700 p-16 text-white relative">
            <div>
              <h1 className="text-5xl font-bold leading-[1.1] mb-8">
                Join Us and Unlock Endless Possibilities!
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                Welcome to PropManageX, where your journey begins. Sign up now to access exclusive features, personalized recommendations, and a seamless experience.
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex gap-1 mb-3 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-blue-50 text-lg italic mb-6 leading-relaxed">
                "We love PropManageX! our designers were using it for their projects, so we already knew what kind of design they want."
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Dynamic Form Content */}
          <div className="w-full lg:w-[55%] relative flex flex-col">
            <div className="w-full max-w-md mx-auto">
              <Outlet context={{ email, setEmail }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;