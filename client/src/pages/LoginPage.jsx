import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Repeat, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email address or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(identifier.trim(), password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(result.message || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // One-click demo test account filler
  const handleQuickFill = (email, pwd) => {
    setIdentifier(email);
    setPassword(pwd);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf9f6]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl shadow-stone-900/5">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-900 to-emerald-700 flex items-center justify-center text-emerald-300">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900">
              LOOPWEAR
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Sign in to manage your clothing listings and swap proposals
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email or Username */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. rahul@example.com or rahul_s"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 border-stone-300 focus:ring-emerald-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wide shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Loopwear</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Easy Evaluation */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center mb-2.5">
            Quick Demo Logins (Click to autofill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('rahul@example.com', 'Rahul@123')}
              className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 text-stone-700 transition text-left"
            >
              <p className="font-bold truncate">Rahul Sharma</p>
              <p className="text-[10px] text-stone-500">rahul@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ananya@example.com', 'Ananya@123')}
              className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 text-stone-700 transition text-left"
            >
              <p className="font-bold truncate">Ananya Verma</p>
              <p className="text-[10px] text-stone-500">ananya@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('priya@example.com', 'Priya@123')}
              className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 text-stone-700 transition text-left"
            >
              <p className="font-bold truncate">Priya Patel</p>
              <p className="text-[10px] text-stone-500">priya@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@loopwear.com', 'Admin@12345')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition text-left"
            >
              <p className="font-bold truncate">Administrator</p>
              <p className="text-[10px] text-emerald-700">admin@loopwear.com</p>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-800 hover:text-emerald-700 underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
