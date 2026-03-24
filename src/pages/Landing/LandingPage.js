import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  LockClosedIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { propertyService } from '../../services/propertyService';

const LandingPage = () => {
  const [liveStats, setLiveStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await propertyService.getProperties();
        const items = response?.data?.data?.items;
        if (Array.isArray(items)) {
          const totalProperties = items.length;
          const totalUnits = items.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
          const occupiedUnits = items.reduce((sum, p) => {
            if (typeof p.occupiedUnits === 'number') return sum + p.occupiedUnits;
            if (p.units && Array.isArray(p.units)) {
              return sum + p.units.filter((u) => (u.status || '').toLowerCase() === 'leased').length;
            }
            return sum;
          }, 0);
          const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
          const totalRevenue = items.reduce((sum, p) => {
            if (typeof p.monthlyRevenue === 'number') return sum + p.monthlyRevenue;
            return sum;
          }, 0);

          setLiveStats({
            totalProperties,
            totalUnits,
            occupancyRate,
            totalRevenue,
          });
        }
      } catch (error) {
        console.error('Failed fetching live stats from API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Easy Property Management',
      description: 'Manage all your properties from one central dashboard with intuitive controls and real-time updates.',
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your portfolio performance with comprehensive reports and data visualization.',
    },
    {
      icon: UserGroupIcon,
      title: 'Tenant Management',
      description: 'Keep track of tenants, leases, and maintenance requests all in one place.',
    },
    {
      icon: LockClosedIcon,
      title: 'Bank-Level Security',
      description: 'Your data is protected with enterprise-grade encryption and security protocols.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Manager',
      content: 'PropManageX has transformed how I manage my properties. Incredibly intuitive and time-saving!',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff',
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Investor',
      content: 'Best investment management tool I\'ve used. The analytics features are outstanding.',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=0D8ABC&color=fff',
    },
    {
      name: 'Emma Davis',
      role: 'Property Owner',
      content: 'Finally, a platform that understands real estate. Highly recommended for anyone serious about property management.',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=0D8ABC&color=fff',
    },
  ];

  const navigate = useNavigate();

  const isLoggedIn = () => {
    const accessToken = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    return !!accessToken;
  };

  const handleGetStarted = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white animate-fadeIn">
      <Header />

      {/* Hero Section */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-4">
                  Manage Your Properties <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Effortlessly</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  PropManageX is the all-in-one platform for real estate professionals. Streamline operations, increase efficiency, and grow your portfolio.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">
                  Trusted by 50,000+ property professionals
                </span>
              </div>
            </div>

            {/* Right Image */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl h-96 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <BuildingOfficeIcon className="w-32 h-32 text-blue-200 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold">Property Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-28 rounded-xl animate-skeleton" />
                ))}
              </div>
              <p className="mt-4 text-center text-blue-100 text-sm">Loading live metrics...</p>
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: liveStats.totalProperties || '0', label: 'Properties Managed' },
                { number: liveStats.totalUnits || '0', label: 'Total Units' },
                { number: `${liveStats.occupancyRate || '0'}%`, label: 'Occupancy Rate' },
                { number: liveStats.totalRevenue ? `$${(liveStats.totalRevenue / 1000).toFixed(1)}K` : '$0K', label: 'Estimated Monthly Revenue' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center text-white">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600">Everything you need to manage your real estate portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 transition-all">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-600">Join thousands of satisfied property managers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Property Management?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start managing your properties smarter today. No credit card required.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all"
          >
            Get Started Free
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="mt-2 text-sm text-blue-100">(If you are not logged in, you’ll be redirected to login first.)</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
