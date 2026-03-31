// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthImage from '../assets/casagrand.jpeg';

const AuthLayout = () => {
  return (
    // Changed: h-screen and overflow-hidden to lock the page scroll
    <div className="h-screen w-full bg-[#F3F4F6] flex items-center justify-center p-4 lg:p-10 font-sans overflow-hidden">
      
      {/* Main Container: Changed to h-full to fill the locked screen padding */}
      <div className="w-full max-w-[1400px] h-full bg-white rounded-[40px] shadow-2xl flex overflow-hidden relative border border-gray-100">
        
        {/* LEFT SIDE: Form Content */}
        {/* Changed: overflow-y-auto ensures that if the form is long, ONLY this side scrolls */}
        <div className="w-full lg:w-[45%] flex flex-col p-8 lg:p-20 overflow-y-auto custom-scrollbar">
          {/* Optional: Add Logo/Home Link here if needed */}
          <Outlet />
        </div>

        {/* RIGHT SIDE: Visual Backdrop */}
        <div className="hidden lg:flex lg:w-[55%] p-6 relative h-full">
          {/* The Squircle Container */}
          <div className="relative w-full h-full overflow-hidden rounded-tr-[120px] rounded-bl-[120px] rounded-tl-[40px] rounded-br-[40px]">
            
            {/* The Background Image */}
            <img 
              src={AuthImage}
              alt="Property Backdrop" 
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2000ms]"
            />
            
            {/* Darkening Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Top Right Floating Text */}
            <div className="absolute top-12 right-12 text-right max-w-[320px] z-10">
              <p className="text-white font-bold text-2xl leading-tight drop-shadow-lg">
                Browse thousands of properties to buy, sell, or rent with trusted agents.
              </p>
            </div>


          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;