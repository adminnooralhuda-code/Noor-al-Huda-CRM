'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // നാം താഴെ ഉണ്ടാക്കാൻ പോകുന്ന Login API-ലേക്ക് ഡാറ്റ അയക്കുന്നു
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid Credentials');
      }

      // റോളുകൾ നോക്കി കൃത്യമായ ഡാഷ്‌ബോർഡിലേക്ക് തിരിച്ചുവിടുന്നു
      if (data.role === 'Admin') {
        router.push('/dashboard/admin');
      } else if (data.role === 'Manager') {
        router.push('/dashboard/manager');
      } else {
        setError('Unauthorized Access');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="text-center mb-6">
          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-500/20">
            Noor Al Huda CRM
          </span>
          <h2 className="text-xl font-extrabold text-white mt-2">Portal Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your gateway access keys</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
              placeholder="e.g., admin_noor"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Secret Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold p-3 rounded-xl transition duration-200 shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Verifying Identity...' : 'Unlock Secure Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}