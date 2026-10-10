import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Repeat, 
  Leaf, 
  Search,
  ArrowRightLeft,
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Shirt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  onOpenCreateListing, 
  onOpenSustainability,
  pendingSwapsCount = 0,
  unreadMessagesCount = 0
}) {
  const { currentUser, allUsers, switchUser, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navSearch, setNavSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/listings?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/listings');
    }
  };

  const navLinks = [
    { label: 'Explore Clothes', to: '/listings', icon: Shirt },
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, authRequired: true },
    { label: 'Swaps', to: '/swaps', icon: ArrowRightLeft, badge: pendingSwapsCount, authRequired: true },
    { label: 'Messages', to: '/chat', icon: MessageSquare, badge: unreadMessagesCount, authRequired: true },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin', icon: ShieldAlert, adminRequired: true }] : [])
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-900 to-emerald-700 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-900/10">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 block leading-none">
                LOOPWEAR
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase text-emerald-700 block mt-1">
                AI Sustainable Barter
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-sm relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search Zara denim, Nike hoodies, shoes..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100/90 border border-stone-200/80 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition relative ${
                    isActive(link.to)
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Eco Impact Quick Modal Toggle */}
            {onOpenSustainability && (
              <button 
                onClick={onOpenSustainability}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
                title="View environmental savings"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Eco Calc</span>
              </button>
            )}

            {/* List an Item Button */}
            <button 
              onClick={() => {
                if (onOpenCreateListing) onOpenCreateListing();
                else navigate('/create-listing');
              }}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-800 shadow-sm transition group"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 group-hover:rotate-12 transition" />
              <span>List Item</span>
            </button>

            {/* User Dropdown / Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 bg-stone-100/90 py-1.5 px-2.5 rounded-full border border-stone-200 hover:border-emerald-600 transition"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-600"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                      <p className="text-stone-500 text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-stone-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/my-listings" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-stone-50"
                      >
                        <Shirt className="w-4 h-4 text-emerald-700" />
                        My Wardrobe
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-stone-50"
                      >
                        <User className="w-4 h-4 text-emerald-700" />
                        Profile & History
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-emerald-800 font-semibold hover:bg-emerald-50"
                        >
                          <ShieldAlert className="w-4 h-4 text-emerald-700" />
                          Admin Portal
                        </Link>
                      )}
                    </div>

                    {/* Quick Demo Switcher Section */}
                    <div className="px-4 py-2 bg-stone-50 border-t border-b border-stone-100">
                      <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Switch Demo Persona
                      </p>
                      <div className="space-y-1">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setIsUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md text-[11px] flex items-center justify-between transition ${
                              u.id === currentUser.id 
                                ? 'bg-emerald-700 text-white font-bold' 
                                : 'text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] opacity-80 uppercase font-mono">{u.role}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-emerald-600 text-xs font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-full bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-semibold transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-2 animate-in fade-in duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive(link.to)
                      ? 'bg-emerald-800 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenSustainability) onOpenSustainability();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-800 bg-emerald-50 flex items-center gap-2"
              >
                <Leaf className="w-4 h-4 text-emerald-600" />
                Sustainability Calculator
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
