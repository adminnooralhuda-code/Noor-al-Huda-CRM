'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // കൃത്യമായി യൂസർനെയിമും പാസ്‌വേഡും അയക്കുന്നു
      });

      const data = await res.json();

      if (!res.ok) {
        // എറർ ഉണ്ടെങ്കിൽ അത് കൃത്യമായി കാണിക്കുന്നു
        setError(data.message || 'Unauthorized Access');
        setLoading(false);
        return;
      }

      // ലോഗിൻ വിജയകരമായാൽ റോൾ അനുസരിച്ച് ഡാഷ്‌ബോർഡിലേക്ക് തിരിച്ചുവിടുന്നു
      const userRole = data.user?.role || 'staff';
      router.push(`/dashboard/${userRole}`);
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] p-4">
      <div className="bg-[#0c1524] border border-[#1e2d42] p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <span className="bg-[#f2a900]/10 text-[#f2a900] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Noor Al Huda CRM
          </span>
          <h2 className="text-2xl font-bold text-white mt-3 tracking-tight">Portal Authentication</h2>
          <p className="text-slate-400 text-sm mt-1">Enter your gateway access keys</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center mb-4 flex items-center justify-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#050b14] border border-[#1e2d42] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#f2a900] transition"
              placeholder="admin@nooralhuda.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Secret Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050b14] border border-[#1e2d42] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#f2a900] transition"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e07a00] hover:bg-[#f2a900] text-black font-bold py-3 rounded-lg transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Unlocking Space...' : 'Unlock Secure Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}