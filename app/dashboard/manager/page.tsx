'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Tabs (No User Management, Instead we have 'customers')
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'employees' | 'customers' | 'expiry'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Toggles (No company add modal needed for Manager)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeEdit, setIsEmployeeEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- COMPLETE COMPREHENSIVE COMPANY STATE ---
  const [companyForm, setCompanyForm] = useState({
    companyCode: '', nameEn: '', nameAr: '',
    dedNumber: '', establishmentDate: '', issuanceDate: '', expiryDate: '',
    legalForm: 'Establishment',
    owners: [{ isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }],
    managers: [{ role: '', nationality: '', name: '', mobile: '' }],
    activities: [''],
    hasLease: 'No', leaseNumber: '', leaseExpiry: '', leasePlace: '', companyEmail: '', companyMobile: '',
    icpCardNumber: '', eChannelUser: '', eChannelPass: '', icpIssueDate: '', icpExpiryDate: '',
    mohreNumber: '', mohreLastUpdate: '',
    damanPolicy: '', damanExpiry: '', damanTotalMembers: '',
    contactPersonDetails: ''
  });

  // --- CLEAN EMPLOYEE STATE ---
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '', companyId: '', name: '', designation: '', nationality: '',
    passportNo: '', passportExpiry: '', emiratesIdNo: '', emiratesIdIssue: '', emiratesIdExpiry: '',
    labourCardNo: '', labourCardExpiry: '', iloeExpiry: '', insuranceCompany: '', insuranceExpiry: '',
    dob: '', mobile: '', email: ''
  });

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
      console.error("Error synchronizing manager desk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- COMPANY ACTIONS (View & Edit Only - NO CREATE / NO DELETE) ---
  const handleOpenCompanyEdit = (comp: any) => {
    setSelectedId(comp._id);
    setCompanyForm({ ...comp });
    setIsCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Managers can only PUT (Update) existing data
    const res = await fetch(`/api/companies?id=${selectedId}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(companyForm) 
    });
    if (res.ok) { setIsCompanyModalOpen(false); fetchData(); }
  };

  // --- EMPLOYEE ACTIONS (Full Control Allowed for Managers) ---
  const handleOpenEmployeeAdd = () => {
    setIsEmployeeEdit(false);
    setSelectedId(null);
    setEmployeeForm({
      employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      companyId: '', name: '', designation: '', nationality: '',
      passportNo: '', passportExpiry: '', emiratesIdNo: '', emiratesIdIssue: '', emiratesIdExpiry: '',
      labourCardNo: '', labourCardExpiry: '', iloeExpiry: '', insuranceCompany: '', insuranceExpiry: '', dob: '', mobile: '', email: ''
    });
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEmployeeEdit = (emp: any) => {
    setIsEmployeeEdit(true);
    setSelectedId(emp._id);
    setEmployeeForm({ ...emp });
    setIsEmployeeModalOpen(true);
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/api/employees';
    let method = isEmployeeEdit ? 'PUT' : 'POST';
    if (isEmployeeEdit) url += `?id=${selectedId}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(employeeForm) });
    if (res.ok) { setIsEmployeeModalOpen(false); fetchData(); }
  };

  const handleEmployeeDelete = async (id: string) => {
    if (!confirm('Manager Request: Proceed with employee file cancellation?')) return;
    const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const fixOwnersLimit = (formType: string) => {
    let currentOwners = [...companyForm.owners];
    if (formType === 'Establishment' || formType === 'Limited Liability Company- sole proprietorship Company') {
      currentOwners = [currentOwners[0] || { isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }];
    }
    setCompanyForm({ ...companyForm, legalForm: formType, owners: currentOwners });
  };

  const getExpiryDays = (dateStr: string) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading Manager Operational Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Navigation Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-500/20">
              Manager Control Center
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Noor al Huda CRM</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search operational files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-64 focus:outline-none focus:border-amber-500" />
            <button onClick={() => router.push('/login')} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white transition">Log Out</button>
          </div>
        </div>

        {/* Master Tab Control Grid Menu */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-slate-800 pb-px mb-6">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'overview' ? 'border-b-2 border-amber-500 text-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200'}`}>📊 Overview & Stats</button>
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'companies' ? 'border-b-2 border-amber-500 text-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200'}`}>🏢 Companies (Review)</button>
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'employees' ? 'border-b-2 border-amber-500 text-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200'}`}>👷 Employees ({employees.length})</button>
          <button onClick={() => setActiveTab('customers')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'customers' ? 'border-b-2 border-amber-500 text-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200'}`}>👥 Customers / Clients</button>
          <button onClick={() => setActiveTab('expiry')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'expiry' ? 'border-b-2 border-amber-500 text-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200'}`}>⚠️ Expiry Tracking</button>
        </div>

        {/* ==========================================
            TAB 1: OVERVIEW & SYSTEM METRICS
            ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Monitored Companies</p>
                <p className="text-3xl font-black text-white mt-1">{companies.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Active Workforce</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">{employees.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Corporate Clients</p>
                <p className="text-3xl font-black text-amber-400 mt-1">{companies.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Critical System Expiries</p>
                <p className="text-3xl font-black text-red-400 mt-1">
                  {companies.filter(c => { const d = getExpiryDays(c.expiryDate); return d !== null && d <= 30; }).length +
                   employees.filter(e => { const d = getExpiryDays(e.visaExpiry); return d !== null && d <= 30; }).length}
                </p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 italic text-xs">
              🔒 Operations Dashboard. Your account has edit access for existing files and full entry privileges for employees.
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: COMPANIES MANAGEMENT (NO CREATE / NO DELETE FOR MANAGER)
            ========================================== */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Corporate Accounts Directory (Read & Update)</h2>
              <span className="text-[10px] text-slate-500 italic bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">Contact Admin to Register New Company</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.filter(c => (c.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase())).map((comp) => (
                <div key={comp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700/80 transition">
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-3">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold font-mono">{comp.companyCode}</p>
                        <p className="font-bold text-slate-100 text-sm truncate">{comp.nameEn}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{comp.legalForm}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p>DED License: <span className="text-slate-200 font-mono font-medium">{comp.dedNumber || '—'}</span></p>
                      <p>Expiry: <span className="text-slate-200 font-medium">{comp.expiryDate || '—'}</span></p>
                      <p>ICP Card Number: <span className="text-slate-200 font-mono">{comp.icpCardNumber || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button onClick={() => handleOpenCompanyEdit(comp)} className="text-xs bg-slate-800 text-amber-400 px-4 py-1.5 rounded-xl hover:bg-slate-700 transition w-full text-center font-bold">Edit / Update Info</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: EMPLOYEES / WORKFORCE MANAGEMENT
            ========================================== */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Crew Profiles Dashboard</h2>
              <button onClick={handleOpenEmployeeAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">+ Onboard Employee</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {employees.filter(e => (e.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((emp) => (
                <div key={emp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition">
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-3">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-bold font-mono">{emp.employeeId}</p>
                        <p className="font-bold text-slate-100 text-sm truncate">{emp.name}</p>
                        <p className="text-xs text-slate-400 truncate">{emp.designation || 'General Staff'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <p>Passport: <span className="text-slate-300 font-mono">{emp.passportNo || '—'}</span></p>
                      <p>Visa Exp: <span className="text-slate-300 font-medium">{emp.visaExpiry || '—'}</span></p>
                      <p>Emirates ID: <span className="text-slate-300 font-mono">{emp.emiratesIdNo || '—'}</span></p>
                      <p>Labour Card: <span className="text-slate-300">{emp.labourCardNo || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button onClick={() => handleOpenEmployeeEdit(emp)} className="text-xs bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl hover:bg-slate-700 transition">Update</button>
                    <button onClick={() => handleEmployeeDelete(emp._id)} className="text-xs bg-red-950/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-900/30 transition">Cancel Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: CUSTOMERS / CLIENT DIRECTORY VIEW
            ========================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Company Core Contacts & Clients Desk</h2>
            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Company Email</th>
                    <th className="p-4">Mobile No</th>
                    <th className="p-4">MOHRE Code</th>
                    <th className="p-4">Legal Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {companies.map((c: any) => (
                    <tr key={c._id} className="hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-white">{c.nameEn}</td>
                      <td className="p-4 font-mono">{c.companyEmail || '—'}</td>
                      <td className="p-4">{c.companyMobile || '—'}</td>
                      <td className="p-4 font-mono">{c.mohreNumber || '—'}</td>
                      <td className="p-4 text-amber-400">{c.legalForm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: AUTOMATIC EXPIRY TRACKER CONTROLLER
            ========================================== */}
        {activeTab === 'expiry' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">⚠️ Corporate Licenses Expiry Status Tracker</h2>
              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">DED License No</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4">Days Remaining</th>
                      <th className="p-4">Status Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {companies.map(c => {
                      const days = getExpiryDays(c.expiryDate);
                      return (
                        <tr key={c._id} className="hover:bg-slate-800/20">
                          <td className="p-4 font-bold text-white">{c.nameEn}</td>
                          <td className="p-4 font-mono">{c.dedNumber || '—'}</td>
                          <td className="p-4 text-slate-400">{c.expiryDate || '—'}</td>
                          <td className="p-4 font-bold font-mono">{days !== null ? `${days} days` : '—'}</td>
                          <td className="p-4">
                            {days !== null && days <= 30 ? <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-900/30">⚠️ CRITICAL RENEW</span> : <span className="text-emerald-400 font-medium">Safe / Active</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">⚠️ Workforce Visas Expiry Status Tracker</h2>
              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="p-4">Worker Name</th>
                      <th className="p-4">Passport No</th>
                      <th className="p-4">Visa Expiry Date</th>
                      <th className="p-4">Days Remaining</th>
                      <th className="p-4">Status Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {employees.map(e => {
                      const days = getExpiryDays(e.visaExpiry);
                      return (
                        <tr key={e._id} className="hover:bg-slate-800/20">
                          <td className="p-4 font-bold text-white">{e.name}</td>
                          <td className="p-4 font-mono">{e.passportNo || '—'}</td>
                          <td className="p-4 text-slate-400">{e.visaExpiry || '—'}</td>
                          <td className="p-4 font-bold font-mono">{days !== null ? `${days} days` : '—'}</td>
                          <td className="p-4">
                            {days !== null && days <= 30 ? <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-900/30">⚠️ EXPIRED / RENEW</span> : <span className="text-emerald-400 font-medium">Safe</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          COMPANY EDIT FORM MODAL (Manager View - No Create Inputs Available)
          ========================================================================= */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl my-8 h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Update Corporate File (Manager Mode)</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleCompanySubmit} className="space-y-6 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <p className="font-bold text-amber-400 border-b border-slate-800 pb-1">1. Economic License Identifiers</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Company Code</label>
                    <input type="text" readOnly value={companyForm.companyCode} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Company Name (English)</label>
                    <input type="text" value={companyForm.nameEn} onChange={(e)=>setCompanyForm({...companyForm, nameEn:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Company Name (Arabic)</label>
                    <input type="text" value={companyForm.nameAr} onChange={(e)=>setCompanyForm({...companyForm, nameAr:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-right" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">DED License No</label>
                    <input type="text" value={companyForm.dedNumber} onChange={(e)=>setCompanyForm({...companyForm, dedNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Establishment Date</label>
                    <input type="date" value={companyForm.establishmentDate} onChange={(e)=>setCompanyForm({...companyForm, establishmentDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Issuance/Renew Date</label>
                    <input type="date" value={companyForm.issuanceDate} onChange={(e)=>setCompanyForm({...companyForm, issuanceDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">License Expiry Date</label>
                    <input type="date" value={companyForm.expiryDate} onChange={(e)=>setCompanyForm({...companyForm, expiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Legal Form Structure</label>
                  <select value={companyForm.legalForm} onChange={(e)=>fixOwnersLimit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white">
                    <option value="Establishment">Establishment (Local Emirati Owner)</option>
                    <option value="Limited Liability Company- sole proprietorship Company">LLC - Sole Proprietorship</option>
                    <option value="limited Liability Company">Limited Liability Company (LLC)</option>
                  </select>
                </div>
              </div>

              {/* Ownership */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <p className="font-bold text-amber-400 border-b border-slate-800 pb-1">2. Owners & Corporate Stakeholders Registry</p>
                {companyForm.owners.map((owner, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 text-slate-300 font-semibold">
                      <input type="checkbox" checked={owner.isCompany} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].isCompany=e.target.checked; setCompanyForm({...companyForm, owners:u})}} /> Entity is Corporate Company
                    </label>
                    {!owner.isCompany ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <input type="text" placeholder="Role" value={owner.role} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].role=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Nationality" value={owner.nationality} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].nationality=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Full Name" value={owner.name} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].name=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Emirates ID No" value={owner.emiratesId} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].emiratesId=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <input type="text" placeholder="Company No" value={owner.companyNo} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].companyNo=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Company Name" value={owner.companyName} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].companyName=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Contact Person" value={owner.contactPerson} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].contactPerson=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Gov Portals Logs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <p className="font-bold text-amber-400 border-b border-slate-800 pb-1">3. Gov Portals Sync (ICP / MoHRE / Daman)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" placeholder="ICP Est Card" value={companyForm.icpCardNumber} onChange={(e)=>setCompanyForm({...companyForm, icpCardNumber:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="E-Channel User" value={companyForm.eChannelUser} onChange={(e)=>setCompanyForm({...companyForm, eChannelUser:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="MOHRE Employer ID" value={companyForm.mohreNumber} onChange={(e)=>setCompanyForm({...companyForm, mohreNumber:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="Daman Policy No" value={companyForm.damanPolicy} onChange={(e)=>setCompanyForm({...companyForm, damanPolicy:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">Dismiss</button>
                <button type="submit" className="bg-amber-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Save Dynamic Updates</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EMPLOYEE MODAL POPUP (Manager View - Full Actions Active)
          ========================================================================= */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{isEmployeeEdit ? 'Modify Worker Profile Logs' : 'Register Crew Profile'}</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">Employee ID</label>
                  <input type="text" readOnly value={employeeForm.employeeId} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-500 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Company Attachment Link</label>
                  <select value={employeeForm.companyId} onChange={(e)=>setEmployeeForm({...employeeForm, companyId:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white">
                    <option value="">-- Independent/No Link --</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Worker Full Name</label>
                  <input type="text" value={employeeForm.name} onChange={(e)=>setEmployeeForm({...employeeForm, name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Designation Description" value={employeeForm.designation} onChange={(e)=>setEmployeeForm({...employeeForm, designation:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                <input type="text" placeholder="Nationality" value={employeeForm.nationality} onChange={(e)=>setEmployeeForm({...employeeForm, nationality:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                <input type="text" placeholder="Passport Number" value={employeeForm.passportNo} onChange={(e)=>setEmployeeForm({...employeeForm, passportNo:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500">Passport Expiry</label>
                  <input type="date" value={employeeForm.passportExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, passportExpiry:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <input type="text" placeholder="Emirates ID Number" value={employeeForm.emiratesIdNo} onChange={(e)=>setEmployeeForm({...employeeForm, emiratesIdNo:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                <div>
                  <label className="block text-slate-500">Emirates ID Expiry</label>
                  <input type="date" value={employeeForm.emiratesIdExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, emiratesIdExpiry:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Labour Card Number" value={employeeForm.labourCardNo} onChange={(e)=>setEmployeeForm({...employeeForm, labourCardNo:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                <div>
                  <label className="block text-slate-500">ILOE Expiry</label>
                  <input type="date" value={employeeForm.iloeExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, iloeExpiry:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <input type="text" placeholder="Insurance Details" value={employeeForm.insuranceCompany} onChange={(e)=>setEmployeeForm({...employeeForm, insuranceCompany:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-2 mt-4">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Publish Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}