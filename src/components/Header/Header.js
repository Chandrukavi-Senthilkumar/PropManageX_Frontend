import { Link } from 'react-router-dom';

const Header = () => {
  const nav = [
    { name: 'Features', href: '#features' },
    { name: 'Analytics', href: '/revenues' },
    { name: 'Properties', href: '/Property' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="bg-[#faf6f9]">
      {/* TOP NAV */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#5B3E59] rounded-2xl
                          text-white font-black flex items-center justify-center">
            P
          </div>
          <span className="font-extrabold text-xl text-[#1F2937]">
            PropManage<span className="text-[#5B3E59]">X</span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-10">
          {nav.map(item => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-[#6B7280] font-medium
                         hover:text-[#1F2937] transition"
            >
              {item.name}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0
                           bg-[#5B3E59] transition-all
                           group-hover:w-full"
              />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/login"
            style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
 
          className="bg-[#5B3E59] hover:bg-[#4A3248]
                     text-white px-6 py-3 rounded-2xl
                     font-semibold transition"
        >
          Get Started
        </Link>

      </div>

      {/* ✅ BLACK DIVIDER LINE (AS PER YOUR IMAGE) */}
      <div className="h-px bg-black/80" />
    </header>
  );
};

export default Header;
