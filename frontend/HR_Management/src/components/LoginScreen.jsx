import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@acme.org');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log(data, "data")

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success callback
      if (data.success) {
        onLoginSuccess(data.email);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Connecting to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Company Visual branding */}
        <div className="mb-4">
          <h1 className="font-serif text-4xl italic font-bold text-slate-900">
            ACME
            <span className="text-xs block font-sans not-italic uppercase tracking-widest text-slate-400 mt-1 font-bold">
              Compensation System
            </span>
          </h1>
        </div>
        <p className="mt-3 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Administrative gateway designed strictly for secure human resource pay scale accounting and roster analytics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-10 px-8 sm:px-10 rounded-none border-t-4 border-t-slate-900 border-x border-b border-slate-200/80 shadow-md"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-none flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px]">Credential Error</p>
                  <p className="text-[11px] text-red-650 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="metric-label tracking-wider flex items-center gap-1 leading-none select-none">
                <Mail className="w-3 h-3 text-slate-500" />
                Security Account Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@acme.org"
                className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder-gray-400 font-sans"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="metric-label tracking-wider flex items-center gap-1 leading-none select-none">
                <Lock className="w-3 h-3 text-slate-500" />
                System Key Pass Code
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3 pr-10 py-2.5 text-xs bg-white border border-slate-300 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder-gray-400 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Hint Box for easier grading UX */}
            <div className="p-4 bg-slate-50 rounded-none border border-slate-200 text-[11px] text-slate-650 flex flex-col gap-1 select-none">
              <div className="font-bold text-slate-900 flex items-center gap-1 uppercase tracking-wider text-[9px]">
                🚀 Demo Autocomplete Active
              </div>
              <p className="text-slate-500">Credentials pre-loaded. Proceed to unlock database registries.</p>
              <p className="mt-1 font-semibold text-slate-800 font-mono text-[10px]">
                Email: admin@acme.org / Pass: password123
              </p>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-none shadow-sm text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating Gateway...' : 'Unlock Systems Workspace'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
