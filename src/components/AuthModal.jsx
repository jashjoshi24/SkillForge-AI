import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

// Real account login/signup (Module A) — talks to the real backend's
// /auth/login and /auth/signup regardless of the DEMO/API mode toggle,
// since there's no meaningful "fake login" for a real feature like this.
// Once logged in, every subsequent real API call automatically carries
// the real account's token (see services/api.js authHeaders()), so
// extraction/gap-analysis/roadmap data becomes tied to this real account
// instead of the backend's anonymous dev-mode stub user.
export const AuthModal = ({ onClose }) => {
  const { login, signup, authLoading, authError } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = mode === 'login' ? await login(email, password) : await signup(email, password, name);
    if (result.success) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#16324F] border border-[#C89B3C]/50 rounded-md w-full max-w-md p-6 sm:p-8 font-mono text-xs shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#A9B4C0] hover:text-[#EDEDE3]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[#C89B3C] font-bold text-sm mb-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>{mode === 'login' ? 'LOG IN TO YOUR ACCOUNT' : 'CREATE YOUR ACCOUNT'}</span>
        </div>
        <p className="text-[#A9B4C0] text-[10.5px] leading-relaxed mb-4">
          {mode === 'login'
            ? 'This links your real SkillForge account (resume, gap analysis, roadmap) instead of the placeholder demo name. No account yet? Switch to SIGN UP below.'
            : 'Create your real SkillForge account so your resume, skill gaps and roadmap are saved under your real name, not a placeholder.'}
        </p>

        <div className="flex bg-[#10243E] rounded p-1 mb-5 border border-[#EDEDE3]/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-colors ${
              mode === 'login' ? 'bg-[#C89B3C] text-[#10243E]' : 'text-[#A9B4C0]'
            }`}
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-colors ${
              mode === 'signup' ? 'bg-[#C89B3C] text-[#10243E]' : 'text-[#A9B4C0]'
            }`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[#A9B4C0] text-[10px] uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#10243E] text-[#EDEDE3] p-2.5 rounded border border-[#EDEDE3]/20 focus:outline-none focus:border-[#C89B3C]"
                placeholder="Jordan Rivera"
              />
            </div>
          )}

          <div>
            <label className="block text-[#A9B4C0] text-[10px] uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#10243E] text-[#EDEDE3] p-2.5 rounded border border-[#EDEDE3]/20 focus:outline-none focus:border-[#C89B3C]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[#A9B4C0] text-[10px] uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#10243E] text-[#EDEDE3] p-2.5 rounded border border-[#EDEDE3]/20 focus:outline-none focus:border-[#C89B3C]"
              placeholder="At least 8 characters"
            />
          </div>

          {authError && (
            <div className="p-2.5 rounded bg-[#B5563C]/15 border border-[#B5563C]/50 text-[#B5563C] text-[11px]">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 rounded bg-[#C89B3C] hover:bg-[#b08732] disabled:opacity-60 disabled:cursor-wait text-[#10243E] font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {authLoading ? 'PLEASE WAIT...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};
