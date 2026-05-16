'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


// ഇതാണ് കറക്റ്റ് പാത്ത്! ഇത് കോപ്പി ചെയ്ത് 8, 9 ലൈനുകളിൽ പേസ്റ്റ് ചെയ്യുക 🎯
import CompanyModal from '../../../models/components/CompanyModal';
import EmployeeModal from '../../../models/components/EmployeeModal';

export default function ManagerDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'employees' | 'expiry'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Controls (മാനേജർക്ക് എഡിറ്റ് ചെയ്യാൻ മാത്രം)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Forms States
  const [companyForm, setCompanyForm] = useState<any>({ owners: [{ isCompany: false }], activities: [''] });
  const [employeeForm, setEmployeeForm] = useState<any>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resComp, resEmp] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/employees')
      ]);
      if (resComp.ok) setCompanies(await resComp.json());
      if (resEmp.ok) setEmployees(await resEmp.json());
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // EDIT HANDLERS
  const handleOpenCompanyEdit = (comp: any) => {
    setSelectedId(comp._id); 
    setCompanyForm({ ...comp }); 
    setIsCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/companies?id=${selectedId}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(companyForm) 
    });
    if (res.ok) { setIsCompanyModalOpen(false); fetchData(); }
  };

  const handleOpenEmployeeEdit = (emp: any) => {
    setSelectedId(emp._id); 
    setEmployeeForm({ ...emp, companyId: emp.companyId?._id || emp.companyId }); 
    setIsEmployeeModalOpen(true);
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/employees?id=${selectedId}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(employeeForm) 
    });
    if (res.ok) { setIsEmployeeModalOpen(false); fetchData(); }
  };

  const getExpiryDays = (dateStr: string) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const collectAllExpiries = () => {
    const list: any[] = [];
    companies.forEach(c => {
      if (c.expiryDate) list.push({ type: 'DED License', name: c.nameEn, date: c.expiryDate, days: getExpiryDays(c.expiryDate) });
    });
    employees.forEach(e => {
      if (e.emiratesIdExpiryDate) list.push({ type: `Emirates ID (${e.name})`, name: e.companyId?.nameEn || 'Individual', date: e.emiratesIdExpiryDate, days: getExpiryDays(e.emiratesIdExpiryDate) });
    });
    return list.sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950 text-white text-xs">LOADING MANAGER PORTAL...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border border-amber-500/20">💼 Manager Control Center</span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1.5">Noor al Huda CRM</h1>
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search operational files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-64 focus:outline-none" />
            <button onClick={() => router.push('/login')} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-400">Log Out</button>
          </div>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 border-b border-slate-900">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-xs font-black tracking-wider ${activeTab === 'overview' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400'}`}>📊 Overview & Stats</button>
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-3 text-xs font-black tracking-wider ${activeTab === 'companies' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400'}`}>🏢 Companies ({companies.length})</button>
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-3 text-xs font-black tracking-wider ${activeTab === 'employees' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400'}`}>👷 Employees ({employees.length})</button>
          <button onClick={() => setActiveTab('expiry')} className={`px-4 py-3 text-xs font-black tracking-wider ${activeTab === 'expiry' ? 'border-b-2 border-amber-500 text-amber-400' : 'text-slate-400'}`}>⚠️ Expiry Tracking</button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl"><p className="text-[10px] text-slate-500 uppercase font-bold">Total Companies</p><p className="text-4xl font-black text-white mt-1">{companies.length}</p></div>
            <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl"><p className="text-[10px] text-slate-500 uppercase font-bold">Total Employees</p><p className="text-4xl font-black text-amber-400 mt-1">{employees.length}</p></div>
            <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl"><p className="text-[10px] text-slate-500 uppercase font-bold">Alert Expiries</p><p className="text-4xl font-black text-rose-500 mt-1">{collectAllExpiries().filter(x => x.days !== null && x.days <= 30).length}</p></div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Corporate Accounts Directory (Read & Update)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.filter(c => (c.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase())).map((comp) => (
                <div key={comp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded">{comp.companyCode || 'C-000'}</span>
                    <h3 className="font-black text-slate-100 text-base mt-2 truncate">{comp.nameEn}</h3>
                    <p className="text-xs text-slate-400 mt-2">DED License: {comp.dedNumber || '—'}</p>
                    <p className="text-xs text-slate-400">Expiry: {comp.expiryDate || '—'}</p>
                  </div>
                  <button onClick={() => handleOpenCompanyEdit(comp)} className="mt-5 w-full bg-slate-800 text-amber-400 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">Edit / Update Info</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Workforce Registry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {employees.filter(e => (e.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((emp) => (
                <div key={emp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-slate-100 text-sm truncate">{emp.name}</h3>
                    <p className="text-[11px] text-slate-500">{emp.designation || 'Worker'}</p>
                    <p className="text-xs text-slate-400 mt-2">Sponsor: {emp.companyId?.nameEn || '—'}</p>
                  </div>
                  <button onClick={() => handleOpenEmployeeEdit(emp)} className="mt-5 w-full bg-slate-800 text-amber-400 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">Update File</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expiry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectAllExpiries().map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded font-black text-amber-400 uppercase">{item.type}</span>
                  <h4 className="font-black text-white text-sm mt-1.5 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400">End Date: {item.date}</p>
                </div>
                <div className="text-right font-bold text-xs text-amber-400">{item.days} Days Left</div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* വിളിച്ച് കണക്ട് ചെയ്യുന്ന കമ്പോണന്റുകൾ ⚡ */}
      <CompanyModal isOpen={isCompanyModalOpen} isEdit={true} form={companyForm} setForm={setCompanyForm} onClose={() => setIsCompanyModalOpen(false)} onSubmit={handleCompanySubmit} />
      <EmployeeModal isOpen={isEmployeeModalOpen} isEdit={true} form={employeeForm} setForm={setEmployeeForm} companies={companies} onClose={() => setIsEmployeeModalOpen(false)} onSubmit={handleEmployeeSubmit} />
    </div>
  );
}