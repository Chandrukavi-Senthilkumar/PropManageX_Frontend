const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#18181b] to-[#1f1f1f] text-[#9ca3af]">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div>
            <h2 className="text-white font-extrabold text-xl mb-3">
              PropManage<span className="text-[var(--brand)]">X</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed">
              Professional property management platform
              designed for analytics‑driven real estate teams.
            </p>
          </div>

          <div className="flex gap-24 text-sm">
            <div>
              <p className="font-bold text-white mb-3">Product</p>
              <p>Features</p>
              <p>Analytics</p>
              <p>Properties</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Company</p>
              <p>About</p>
              <p>Careers</p>
              <p>Support</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PropManageX. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;