'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 🛠️ Correct Relative Path
import CompanyModal from '../../../models/components/CompanyModal';
import EmployeeModal from '../../../models/components/EmployeeModal';
import UserModal from '../../../models/components/UserModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs Control
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'employees' | 'users' | 'expiry'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Open/Close States
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Modal forms states
  const [isEdit, setIsEdit] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', code: '', licenseNumber: '', licenseExpiryDate: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', designation: '', companyName: '', visaExpiry: '', laborCardExpiry: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'STAFF', password: '' });

  // 🔄 Fetch all database data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [compRes, empRes, userRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/employees'),
        fetch('/api/users')
      ]);

      if (compRes.ok) setCompanies(await compRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
      if (userRes.ok) setUsers(await userRes.json());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 📥 Submit Handlers
  const handleCompanySubmit = async (e: any) => {
    e?.preventDefault();
    setIsCompanyModalOpen(false);
    fetchAllData();
  };

  const handleEmployeeSubmit = async (e: any) => {
    e?.preventDefault();
    setIsEmployeeModalOpen(false);
    fetchAllData();
  };

  const handleUserSubmit = async (e: any) => {
    e?.preventDefault();
    setIsUserModalOpen(false);
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Loading System Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans antialiased pb-12">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
              👑 Super Admin Portal
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">Noor al Huda CRM</h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search system database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs w-64 focus:outline-none focus:border-indigo-500 text-slate-200"
            />
            <button onClick={() => router.push('/login')} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* TABS NAVIGATION */}
        <div className="flex gap-2 border-b border-slate-900 pb-px mb-8 overflow-x-auto">
          {(['overview', 'companies', 'employees', 'users', 'expiry'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold uppercase tracking-wider px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'overview' && `📊 Overview`}
              {tab === 'companies' && `🏢 Companies (${companies.length})`}
              {tab === 'employees' && `🧑‍💼 Employees (${employees.length})`}
              {tab === 'users' && `👥 App Users (${users.length})`}
              {tab === 'expiry' && `⚠️ Expiries`}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered Corporate Accounts</p>
              <h3 className="text-4xl font-black text-white mt-2 font-mono">{companies.length}</h3>
            </div>
            <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Staff & Labor Database</p>
              <h3 className="text-4xl font-black text-white mt-2 font-mono">{employees.length}</h3>
            </div>
            <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Operational Users</p>
              <h3 className="text-4xl font-black text-white mt-2 font-mono">{users.length}</h3>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Corporate Accounts Directory</h2>
              <button 
                onClick={() => { setIsEdit(false); setCompanyForm({ name: '', code: '', licenseNumber: '', licenseExpiryDate: '' }); setIsCompanyModalOpen(true); }} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                + Add New Company
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companies.map((comp: any) => (
                <div key={comp._id} className="bg-slate-950 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono bg-slate-900 text-indigo-400 px-2 py-0.5 rounded border border-slate-800">
                      {comp.code || 'C-000'}
                    </span>
                    <h4 className="text-base font-black text-white mt-3">{comp.name}</h4>
                    <p className="text-xs text-slate-400 mt-2">DED License: <span className="text-slate-200 font-mono">{comp.licenseNumber || '—'}</span></p>
                    <p className="text-xs text-slate-400">Expiry: <span className="text-amber-400 font-mono">{comp.licenseExpiryDate || '—'}</span></p>
                  </div>
                  {/* ✏️ UPDATE COMPANY ACTION */}
                  <div className="mt-5 pt-4 border-t border-slate-900/60 flex gap-2">
                    <button 
                      onClick={() => { setIsEdit(true); setCompanyForm(comp); setIsCompanyModalOpen(true); }}
                      className="flex-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-bold text-xs py-2 rounded-lg transition-colors border border-indigo-900/40"
                    >
                      ✏️ Update Company
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Human Resource Database</h2>
              {/* ➕ ADD NEW STAFF / EMPLOYEE */}
              <button 
                onClick={() => { 
                  setIsEdit(false); 
                  setEmployeeForm({ name: '', designation: '', companyName: '', visaExpiry: '', laborCardExpiry: '' }); 
                  setIsEmployeeModalOpen(true); 
                }} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                + Add Staff / Employee
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-850">
                    <th className="p-4">Name</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Company Allocation</th>
                    <th className="p-4">Visa Expiry</th>
                    <th className="p-4">Labor Card Expiry</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {employees.map((emp: any) => (
                    <tr key={emp._id} className="hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-white">{emp.name}</td>
                      <td className="p-4 text-slate-400">{emp.designation || '—'}</td>
                      <td className="p-4 text-indigo-400 font-medium">{emp.companyName || 'Unallocated'}</td>
                      <td className="p-4 font-mono text-slate-300">{emp.visaExpiry || '—'}</td>
                      <td className="p-4 font-mono text-slate-300">{emp.laborCardExpiry || '—'}</td>
                      {/* 🛠️ UPDATE & CANCEL EMPLOYEES */}
                      <td className="p-4 flex gap-2 justify-center">
                        <button 
                          onClick={() => { setIsEdit(true); setEmployeeForm(emp); setIsEmployeeModalOpen(true); }}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-amber-400 font-bold px-2.5 py-1 rounded-md transition-colors"
                        >
                          Update
                        </button>
                        <button 
                          onClick={async () => {
                            if(confirm(`Are you sure you want to cancel/remove ${emp.name}?`)) {
                              await fetch(`/api/employees/${emp._id}`, { method: 'DELETE' });
                              fetchAllData();
                            }
                          }}
                          className="bg-red-950/40 hover:bg-red-950/80 border border-red-900/40 text-red-400 font-bold px-2.5 py-1 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 👥 APP USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">System Access Credentials</h2>
              {/* ➕ FIXED: Changed setIsUserOpen to setIsUserModalOpen */}
              <button 
                onClick={() => { setIsEdit(false); setUserForm({ name: '', email: '', role: 'STAFF', password: '' }); setIsUserModalOpen(true); }} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                + Create User Account
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-850">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role Permission</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-white">{u.name || '—'}</td>
                      <td className="p-4 text-slate-300">{u.email || '—'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-amber-400 font-mono font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXPIRES TAB */}
        {activeTab === 'expiry' && (
          <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl text-center space-y-2">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Automatic Expiry Alert Matrix</p>
            <p className="text-sm text-slate-400">All imminent DED corporate licenses & labor visa deadlines will trigger warnings here.</p>
          </div>
        )}
      </main>

      {/* 💡 SYSTEM OPERATIONS MODALS (WITH TYPE CASTING TO PREVENT TYPESCRIPT ERRORS) */}
      <CompanyModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
        isEdit={isEdit} 
        form={companyForm} 
        setForm={setCompanyForm} 
        onSubmit={handleCompanySubmit} 
      />
      
      <EmployeeModal 
        isOpen={isCompanyModalOpen}
        {...({
          isOpen: isEmployeeModalOpen, 
          onClose: () => setIsEmployeeModalOpen(false), 
          isEdit: isEdit, 
          form: employeeForm, 
          setForm: setEmployeeForm, 
          onSubmit: handleEmployeeSubmit
        } as any)} 
      />
      
      <UserModal 
        isOpen={isCompanyModalOpen}
        {...({
          isOpen: isUserModalOpen, 
          onClose: () => setIsUserModalOpen(false), 
          isEdit: isEdit, 
          form: userForm, 
          setForm: setUserForm, 
          onSubmit: handleUserSubmit
        } as any)} 
      />
    </div>
  );
}