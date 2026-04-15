import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="relative bg-[var(--bg-soft)] overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--brand)]/25 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-[140px]" />

        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-20 items-center relative">

          {/* Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Manage Properties
              <span className="block text-[var(--brand)] mt-2">Effortlessly</span>
            </h1>

            <p className="mt-6 text-xl text-[var(--text-muted)] max-w-xl">
              A modern real‑estate platform with analytics, automation,
              and enterprise‑grade security.
            </p>

            <button
              onClick={() => navigate('/Property')}
                style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
              className="mt-10 bg-[var(--brand)]
                         hover:bg-[var(--brand-dark)]
                         text-white px-8 py-4 rounded-2xl font-bold shadow-soft transition"
            >
              Get Started Free →
            </button>
          </div>

          {/* Analytics Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--brand)]/20 blur-[120px]" />
            <div className="relative bg-white rounded-[32px] p-12 shadow-float">
              <p className="text-xs font-bold uppercase text-center text-[var(--text-muted)] mb-6">
                Portfolio Analytics
              </p>

              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  ['128', 'Properties'],
                  ['1540', 'Units'],
                  ['92%', 'Occupancy'],
                  ['₹850K', 'Revenue'],
                ].map(([val, label]) => (
                  <div key={label} className="bg-[var(--bg-soft)] p-6 rounded-2xl">
                    <p className="text-2xl font-extrabold text-[var(--brand)]">
                      {val}
                    </p>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY IMAGES */}
      <section className="bg-[var(--bg-main)] py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
          ].map((img, i) => (
            <img
              key={i}
              src={`${img}?auto=format&fit=crop&w=900&q=80`}
              alt="Property"
              className="rounded-3xl shadow-soft hover:scale-[1.03] transition-transform duration-500"
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;