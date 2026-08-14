import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { MapPin, Compass, Cpu, BookOpen, BarChart3, Upload, Menu, X, ShieldAlert, CheckCircle2, User, LogIn, LogOut } from 'lucide-react';

export const Navbar = () => {
  const {
    demoMode,
    setDemoMode,
    targetRole,
    setTargetRole,
    TARGET_ROLES,
    activeTab,
    setActiveTab,
    matchPercentage,
    authUser,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { id: 'landing', label: 'SURVEY TERRAIN', icon: Compass },
    { id: 'resume', label: 'RESUME & SKILLS', icon: Upload },
    { id: 'roadmap', label: 'BLUEPRINT ROADMAP', icon: MapPin },
    { id: 'recommendations', label: 'RECOMMENDATIONS', icon: BookOpen },
    { id: 'dashboard', label: 'FIELD ANALYTICS', icon: BarChart3 },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 bg-[#10243E]/95 backdrop-blur border-b border-[#EDEDE3]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-[#16324F] border border-[#C89B3C] rounded flex items-center justify-center text-[#C89B3C] group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-wider text-[#EDEDE3] flex items-center gap-2">
              SKILLFORGE <span className="text-xs px-1.5 py-0.5 rounded bg-[#C89B3C]/20 border border-[#C89B3C] text-[#C89B3C] font-mono">AI v1.0</span>
            </div>
            <div className="text-[10px] font-mono text-[#A9B4C0] tracking-widest uppercase">
              CAREER CARTOGRAPHY INSTRUMENT
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#16324F] text-[#C89B3C] border border-[#C89B3C]/50 shadow-sm'
                    : 'text-[#A9B4C0] hover:text-[#EDEDE3] hover:bg-[#16324F]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C89B3C]' : 'text-[#A9B4C0]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Target Role Selector */}
          <div className="flex items-center gap-1.5 bg-[#16324F] px-2.5 py-1 rounded border border-[#EDEDE3]/15 text-xs font-mono">
            <span className="text-[#A9B4C0]">ROLE:</span>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-transparent text-[#EDEDE3] font-semibold focus:outline-none cursor-pointer"
            >
              {TARGET_ROLES.map(role => (
                <option key={role} value={role} className="bg-[#10243E] text-[#EDEDE3]">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Role Match Metric */}
          <div className="px-2.5 py-1 rounded bg-[#6B9080]/15 border border-[#6B9080]/40 text-xs font-mono text-[#6B9080] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>MATCH {matchPercentage}%</span>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 border transition-all ${
              demoMode
                ? 'bg-[#C89B3C]/15 border-[#C89B3C] text-[#C89B3C]'
                : 'bg-[#16324F] border-[#EDEDE3]/20 text-[#A9B4C0]'
            }`}
            title="Toggle between standalone Demo dataset and live FastAPI endpoints"
          >
            <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-[#C89B3C] animate-ping' : 'bg-gray-500'}`} />
            <span>{demoMode ? 'DEMO MODE: ON' : 'API MODE'}</span>
          </button>

          {/* Real Account: Log In / Account + Log Out */}
          {authUser ? (
            <div className="flex items-center gap-1.5">
              <div
                className="px-2.5 py-1 rounded bg-[#16324F] border border-[#EDEDE3]/15 text-xs font-mono text-[#EDEDE3] flex items-center gap-1.5 max-w-[140px]"
                title={authUser.email}
              >
                <User className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
                <span className="truncate">{authUser.name || authUser.email}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded bg-[#16324F] border border-[#EDEDE3]/15 text-[#A9B4C0] hover:text-[#B5563C] hover:border-[#B5563C]/50"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-2.5 py-1 rounded bg-[#16324F] border border-[#EDEDE3]/20 text-xs font-mono text-[#EDEDE3] hover:border-[#C89B3C]/50 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>LOG IN</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setDemoMode(!demoMode)}
            className="px-2 py-1 text-[10px] font-mono rounded bg-[#C89B3C]/20 border border-[#C89B3C] text-[#C89B3C]"
          >
            {demoMode ? 'DEMO' : 'API'}
          </button>
          {authUser ? (
            <button
              onClick={logout}
              className="p-2 text-[#A9B4C0] hover:text-[#B5563C] hover:bg-[#16324F] rounded border border-[#EDEDE3]/15"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="p-2 text-[#EDEDE3] hover:bg-[#16324F] rounded border border-[#EDEDE3]/15"
              title="Log in"
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#EDEDE3] hover:bg-[#16324F] rounded border border-[#EDEDE3]/15"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#10243E] border-b border-[#EDEDE3]/15 px-4 pt-2 pb-4 space-y-2 font-mono text-xs">
          <div className="py-2 border-b border-[#EDEDE3]/10">
            <label className="text-[#A9B4C0] text-[10px] uppercase tracking-wider block mb-1">Target Role Surveyed:</label>
            <select
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#16324F] text-[#EDEDE3] p-2 rounded border border-[#EDEDE3]/20"
            >
              {TARGET_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${
                  isActive ? 'bg-[#16324F] text-[#C89B3C] border border-[#C89B3C]' : 'text-[#EDEDE3]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>

    {/* Rendered OUTSIDE <header> on purpose: <header> has `backdrop-blur`
        (backdrop-filter), which per the CSS spec creates a new containing
        block for any `position: fixed` descendant. That silently broke the
        modal before — its "fixed inset-0" was being measured against the
        64px-tall header box instead of the actual browser viewport, so all
        that ever showed was a sliver up top. Keeping AuthModal as a sibling
        of <header> instead of a child fixes that at the root, rather than
        just trying to out-style it with more CSS. */}
    {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
