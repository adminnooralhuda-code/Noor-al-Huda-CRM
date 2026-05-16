'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // User Management (Staff/Managers)
  const [loading, setLoading] = useState(true);
  
  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'employees' | 'users' | 'expiry'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Toggles
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyEdit, setIsCompanyEdit] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeEdit, setIsEmployeeEdit] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserEdit, setIsUserEdit] = useState(false);
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

  // --- CLEAN EMPLOYEE STATE (Exactly as requested, no mandatory locks) ---
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '', companyId: '', name: '', designation: '', nationality: '',
    passportNo: '', passportExpiry: '', emiratesIdNo: '', emiratesIdIssue: '', emiratesIdExpiry: '',
    labourCardNo: '', labourCardExpiry: '', iloeExpiry: '', insuranceCompany: '', insuranceExpiry: '',
    dob: '', mobile: '', email: ''
  });

  // --- USER MANAGEMENT STATE ---
  const [userForm, setUserForm] = useState({
    username: '', password: '', role: 'Staff', name: '', email: '', status: 'Active'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resComp, resEmp, resUsers] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/employees'),
        fetch('/api/users') // assuming endpoint for app users
      ]);
      if (resComp.ok) setCompanies(await resComp.json());
      if (resEmp.ok) setEmployees(await resEmp.json());
      if (resUsers.ok) setUsers(await resUsers.json());
    } catch (err) {
      console.error("Error synchronizing admin datadesk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- COMPANY ACTIONS ---
  const handleOpenCompanyAdd = () => {
    setIsCompanyEdit(false);
    setSelectedId(null);
    setCompanyForm({
      companyCode: `C-${String(companies.length + 1).padStart(3, '0')}`,
      nameEn: '', nameAr: '', dedNumber: '', establishmentDate: '', issuanceDate: '', expiryDate: '',
      legalForm: 'Establishment',
      owners: [{ isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }],
      managers: [{ role: '', nationality: '', name: '', mobile: '' }],
      activities: [''],
      hasLease: 'No', leaseNumber: '', leaseExpiry: '', leasePlace: '', companyEmail: '', companyMobile: '',
      icpCardNumber: '', eChannelUser: '', eChannelPass: '', icpIssueDate: '', icpExpiryDate: '',
      mohreNumber: '', mohreLastUpdate: '', damanPolicy: '', damanExpiry: '', damanTotalMembers: '', contactPersonDetails: ''
    });
    setIsCompanyModalOpen(true);
  };

  const handleOpenCompanyEdit = (comp: any) => {
    setIsCompanyEdit(true);
    setSelectedId(comp._id);
    setCompanyForm({ ...comp });
    setIsCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/api/companies';
    let method = isCompanyEdit ? 'PUT' : 'POST';
    if (isCompanyEdit) url += `?id=${selectedId}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(companyForm) });
    if (res.ok) { setIsCompanyModalOpen(false); fetchData(); }
  };

  const handleCompanyDelete = async (id: string) => {
    if (!confirm('CRITICAL WARNING: Delete this company permanently? All data will be lost.')) return;
    const res = await fetch(`/api/companies?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  // --- EMPLOYEE ACTIONS ---
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
    if (!confirm('Permanently wipe this employee record from systems?')) return;
    const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  // --- USER MANAGEMENT ACTIONS (Create Staff/Managers) ---
  const handleOpenUserAdd = () => {
    setIsUserEdit(false);
    setUserForm({ username: '', password: '', role: 'Staff', name: '', email: '', status: 'Active' });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/api/users';
    let method = isUserEdit ? 'PUT' : 'POST';
    if (isUserEdit) url += `?id=${selectedId}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
    if (res.ok) { setIsUserModalOpen(false); fetchData(); }
  };

  const handleUserDelete = async (id: string) => {
    if (!confirm('Revoke access and delete this user account?')) return;
    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const fixOwnersLimit = (formType: string) => {
    let currentOwners = [...companyForm.owners];
    if (formType === 'Establishment' || formType === 'Limited Liability Company- sole proprietorship Company') {
      currentOwners = [currentOwners[0] || { isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }];
    }
    setCompanyForm({ ...companyForm, legalForm: formType, owners: currentOwners });
  };

  // --- AUTOMATIC EXPIRY TRACKER LOGIC ---
  const getExpiryDays = (dateStr: string) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading Master Admin Engine...</p>
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
            <span className="bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-red-500/20">
              Root Admin Workspace (Full Authority)
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Noor al Huda CRM</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Global system search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-64 focus:outline-none focus:border-emerald-500" />
            <button onClick={() => router.push('/login')} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white transition">Log Out</button>
          </div>
        </div>

        {/* Master Tab Control Grid Menu */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-slate-800 pb-px mb-6">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'overview' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}>📊 Overview & Stats</button>
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'companies' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}>🏢 Companies ({companies.length})</button>
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'employees' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}>👷 Employees ({employees.length})</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'users' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}>👥 User Accounts</button>
          <button onClick={() => setActiveTab('expiry')} className={`px-4 py-3 text-xs font-bold transition ${activeTab === 'expiry' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}>⚠️ Expiry Tracking</button>
        </div>

        {/* ==========================================
            TAB 1: OVERVIEW & SYSTEM METRICS
            ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Total Companies Registered</p>
                <p className="text-3xl font-black text-white mt-1">{companies.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Total Workforce Monitored</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">{employees.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Active Portal Users</p>
                <p className="text-3xl font-black text-amber-400 mt-1">{users.length || 3}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-medium text-slate-400 uppercase">Critical Expiries (&lt; 30 Days)</p>
                <p className="text-3xl font-black text-red-400 mt-1">
                  {companies.filter(c => { const d = getExpiryDays(c.expiryDate); return d !== null && d <= 30; }).length +
                   employees.filter(e => { const d = getExpiryDays(e.visaExpiry); return d !== null && d <= 30; }).length}
                </p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 italic text-xs">
              📊 Admin Analytics Engine Online. Use the tabs above to manage core operations and access tracking panels.
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: COMPANIES MANAGEMENT
            ========================================== */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Master Corporate Accounts Database</h2>
              <button onClick={handleOpenCompanyAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">+ Create New Company</button>
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{comp.legalForm}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p>DED License: <span className="text-slate-200 font-mono font-medium">{comp.dedNumber || '—'}</span></p>
                      <p>Expiry: <span className="text-slate-200 font-medium">{comp.expiryDate || '—'}</span></p>
                      <p>ICP Card Number: <span className="text-slate-200 font-mono">{comp.icpCardNumber || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button onClick={() => handleOpenCompanyEdit(comp)} className="text-xs bg-slate-800 text-amber-400 px-3 py-1.5 rounded-xl hover:bg-slate-700 transition">Edit Details</button>
                    <button onClick={() => handleCompanyDelete(comp._id)} className="text-xs bg-red-950/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-950/40 transition">Wipe Profile</button>
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
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Master Employee Registries</h2>
              <button onClick={handleOpenEmployeeAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">+ Add New Employee</button>
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
                    <button onClick={() => handleEmployeeDelete(emp._id)} className="text-xs bg-red-950/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-900/30 transition">Cancel Account</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: USER MANAGEMENT (Manage Staff & Managers Access)
            ========================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Portal Access Management (Staff & Managers)</h2>
              <button onClick={handleOpenUserAdd} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl">+ Create Access User</button>
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role/Privilege</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500 italic">No custom user records exist yet.</td>
                    </tr>
                  ) : users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 font-mono">{u.username}</td>
                      <td className="p-4">{u.email || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'Manager' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4"><span className="text-emerald-400 font-medium">{u.status || 'Active'}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleUserDelete(u._id)} className="text-red-400 hover:underline">Revoke Access</button>
                      </td>
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
          1. COMPANY POPUP FORM MODAL (Admin - Full Add / Edit Fields Control Desk)
          ========================================================================= */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl my-8 h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{isCompanyEdit ? 'Modify Profile Architecture' : 'Establish New Corporate File'}</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleCompanySubmit} className="space-y-6 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <p className="font-bold text-emerald-400 border-b border-slate-800 pb-1">1. Economic License Identifiers</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Company Code</label>
                    <input type="text" readOnly value={companyForm.companyCode} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400 font-mono" />
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
                    <label className="block text-slate-400 mb-1">DED License No (CN/IN-XXXX)</label>
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
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <p className="font-bold text-emerald-400">2. Owners & Corporate Stakeholders Registry</p>
                  {companyForm.legalForm === 'limited Liability Company' && (
                    <button type="button" onClick={() => setCompanyForm({...companyForm, owners: [...companyForm.owners, { isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }]})} className="bg-slate-800 text-emerald-400 px-2 py-1 rounded text-[11px]">+ Add Stakeholder</button>
                  )}
                </div>
                {companyForm.owners.map((owner, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 text-slate-300 font-semibold">
                      <input type="checkbox" checked={owner.isCompany} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].isCompany=e.target.checked; setCompanyForm({...companyForm, owners:u})}} /> Shareholder is Corporate Company Entity
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

              {/* Scope Manual entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-bold text-emerald-400">3. Scope of Commercial Activities</p>
                  {companyForm.activities.map((act, aIdx) => (
                    <input key={aIdx} type="text" placeholder="Activity Entry Description" value={act} onChange={(e)=>{const a=[...companyForm.activities]; a[aIdx]=e.target.value; setCompanyForm({...companyForm, activities:a})}} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  ))}
                  <button type="button" onClick={()=>setCompanyForm({...companyForm, activities:[...companyForm.activities, '']})} className="text-emerald-500 font-bold hover:underline text-[11px]">+ Append Activity Option</button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-bold text-emerald-400">4. Legal Lease/Tenancy Parameters</p>
                  <select value={companyForm.hasLease} onChange={(e)=>setCompanyForm({...companyForm, hasLease:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 w-full text-white">
                    <option value="No">No / Flexidesk System Route</option>
                    <option value="Yes">Yes (Physical Lease Contract Registered)</option>
                  </select>
                  {companyForm.hasLease === 'Yes' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <input type="text" placeholder="Contract No" value={companyForm.leaseNumber} onChange={(e)=>setCompanyForm({...companyForm, leaseNumber:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white" />
                      <input type="date" value={companyForm.leaseExpiry} onChange={(e)=>setCompanyForm({...companyForm, leaseExpiry:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Portal Gov */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <p className="font-bold text-emerald-400 border-b border-slate-800 pb-1">5. Gov Portals Configurations (ICP / MoHRE / Daman)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" placeholder="ICP Est Card Number" value={companyForm.icpCardNumber} onChange={(e)=>setCompanyForm({...companyForm, icpCardNumber:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="E-Channel User" value={companyForm.eChannelUser} onChange={(e)=>setCompanyForm({...companyForm, eChannelUser:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="MOHRE Employer ID" value={companyForm.mohreNumber} onChange={(e)=>setCompanyForm({...companyForm, mohreNumber:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="Daman Policy No" value={companyForm.damanPolicy} onChange={(e)=>setCompanyForm({...companyForm, damanPolicy:e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">Dismiss</button>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Publish Portfolio Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. EMPLOYEE POPUP FORM MODAL (Admin Control - Full Fields Registry)
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                <input type="text" placeholder="Labour Card Number" value={employeeForm.labourCardNo} onChange={(e)=>setEmployeeForm({...employeeForm, labourCardNo:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                <div>
                  <label className="block text-slate-500">ILOE Expiry</label>
                  <input type="date" value={employeeForm.iloeExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, iloeExpiry:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <input type="text" placeholder="Insurance Manual logs" value={employeeForm.insuranceCompany} onChange={(e)=>setEmployeeForm({...employeeForm, insuranceCompany:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 italic text-slate-500">
                <input type="text" placeholder="Mobile (Optional)" value={employeeForm.mobile} onChange={(e)=>setEmployeeForm({...employeeForm, mobile:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white not-italic" />
                <input type="email" placeholder="Email (Optional)" value={employeeForm.email} onChange={(e)=>setEmployeeForm({...employeeForm, email:e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white not-italic" />
              </div>

              <div className="flex justify-end gap-2 pt-2 mt-4">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Publish Worker Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 3. ACCESS USER MANAGEMENT MODAL POPUP --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-md font-bold text-white mb-4">Create System Access Pass (Staff/Manager)</h3>
            <form onSubmit={handleUserSubmit} className="space-y-4 text-xs">
              <input type="text" placeholder="User Full Name" required value={userForm.name} onChange={(e)=>setUserForm({...userForm, name:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              <input type="text" placeholder="Login Username" required value={userForm.username} onChange={(e)=>setUserForm({...userForm, username:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              <input type="password" placeholder="Account Password" required value={userForm.password} onChange={(e)=>setUserForm({...userForm, password:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              <select value={userForm.role} onChange={(e)=>setUserForm({...userForm, role:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="Staff">Staff (No Company Creation)</option>
                <option value="Manager">Manager Core Dashboard</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setIsUserModalOpen(false)} className="bg-slate-800 px-4 py-2 rounded-xl text-slate-300">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Authorize Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}