'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'companies' | 'employees'>('companies');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resComp, resEmp] = await Promise.all([fetch('/api/companies'), fetch('/api/employees')]);
        if (resComp.ok) setCompanies(await resComp.json());
        if (resEmp.ok) setEmployees(await resEmp.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950 text-white text-xs">LOADING STAFF PANEL...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md">👥 Staff Terminal</span>
            <h1 className="text-2xl font-black text-white mt-1">Noor al Huda CRM</h1>
          </div>
          <input type="text" placeholder="Quick filter..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-64" />
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === 'companies' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>🏢 Companies ({companies.length})</button>
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === 'employees' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>👷 Workforce ({employees.length})</button>
        </div>

        {activeTab === 'companies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.filter(c => (c.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase())).map(comp => (
              <div key={comp._id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 className="font-bold text-white text-sm">{comp.nameEn}</h3>
                <p className="text-xs text-slate-400 mt-1">DED License: {comp.dedNumber || '—'}</p>
                <p className="text-xs text-slate-400">Expiry Date: {comp.expiryDate || '—'}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.filter(e => (e.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
              <div key={emp._id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 className="font-bold text-white text-sm">{emp.name}</h3>
                <p className="text-xs text-indigo-400">{emp.designation}</p>
                <p className="text-xs text-slate-500 mt-2">Company: {emp.companyId?.nameEn || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}