import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getUserRole, setUserRole, UserRole, USE_MOCK, getMockCustomerList } from '../api';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRoleState] = useState<UserRole>(getUserRole());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mockCustomers = getMockCustomerList();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setUserRole(newRole);
    setRoleState(newRole);
    // Reload current window or notify so all components re-query if needed
    window.dispatchEvent(new Event('role_changed'));
  };

  const handleCustomerJump = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`/customer/${selectedId}`);
    }
  };

  // Extract current customer id from path if on /customer/:id
  const currentCustomerId = location.pathname.startsWith('/customer/')
    ? location.pathname.split('/')[2]
    : 'G-004817';

  const navLinks = [
    { to: `/customer/${currentCustomerId}`, label: 'Collections 360' },
    { to: '/ask', label: 'Collections Ask' },
    { to: '/nba', label: 'NBA Queue' },
    { to: '/governance', label: 'Governance & Trust' },
  ];

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-40 shadow-md border-b-2 border-b-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <NavLink to={`/customer/${currentCustomerId}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-brand-orange to-brand-amber flex items-center justify-center font-serif font-black text-brand-navy text-lg shadow">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-brand-amber transition-colors">
                  Apex Collections 360
                </span>
                <span className="text-[10px] text-slate-300 font-mono tracking-wider uppercase">
                  Governed AI Prototype
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-brand-amber font-semibold shadow-inner'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Controls: Customer Jump & Role Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Customer Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">
              <label htmlFor="customer-select" className="text-[11px] text-slate-300 uppercase font-semibold">
                Cust:
              </label>
              <select
                id="customer-select"
                value={currentCustomerId}
                onChange={handleCustomerJump}
                className="bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                title="Quick switch customer"
              >
                {mockCustomers.map((c) => (
                  <option key={c.golden_id} value={c.golden_id} className="bg-slate-900 text-white">
                    {c.golden_id} ({c.display_name.split(' ')[0]} - {c.bucket})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher (Essential for 409 Hardship Demo) */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">
              <label htmlFor="role-select" className="text-[11px] text-slate-300 uppercase font-semibold">
                Role:
              </label>
              <select
                id="role-select"
                value={role}
                onChange={handleRoleChange}
                className="bg-transparent text-xs text-brand-amber font-semibold focus:outline-none cursor-pointer"
                title="Toggle User Role (agent | specialist | supervisor)"
              >
                <option value="agent" className="bg-slate-900 text-white">Agent</option>
                <option value="specialist" className="bg-slate-900 text-white">Specialist (Hardship Auth)</option>
                <option value="supervisor" className="bg-slate-900 text-white">Supervisor</option>
              </select>
            </div>

            {/* Mock / Live Indicator */}
            <Badge variant={USE_MOCK ? 'warn' : 'current'} size="sm">
              {USE_MOCK ? 'Mock' : 'Live'}
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <select
              value={role}
              onChange={handleRoleChange}
              className="bg-slate-800 text-[11px] text-brand-amber px-2 py-1 rounded border border-slate-700"
            >
              <option value="agent">Agent</option>
              <option value="specialist">Specialist</option>
              <option value="supervisor">Supervisor</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 px-4 pt-2 pb-4 border-t border-slate-800 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-slate-800 text-brand-amber font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Select Customer:</label>
            <select
              value={currentCustomerId}
              onChange={(e) => {
                handleCustomerJump(e);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-700"
            >
              {mockCustomers.map((c) => (
                <option key={c.golden_id} value={c.golden_id}>
                  {c.golden_id} - {c.display_name} ({c.bucket})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
