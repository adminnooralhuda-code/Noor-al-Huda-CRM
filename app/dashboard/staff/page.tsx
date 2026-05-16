'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'employees' | 'companies'>('employees');

  // Modals and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeEdit, setIsEmployeeEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- COMPLEX COMPANY FORM STATE (FOR UPDATE ONLY) ---
  const [companyForm, setCompanyForm] = useState({
    companyCode: '', // Auto-generated/Fetched
    nameEn: '', nameAr: '',
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

  // --- DETAILED EMPLOYEE FORM STATE ---
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '', // Auto
    companyId: '',
    name: '', designation: '', nationality: '',
    passportNo: '', passportExpiry: '',
    emiratesIdNo: '', emiratesIdIssue: '', emiratesIdExpiry: '',
    labourCardNo: '', labourCardExpiry: '',
    iloeExpiry: '',
    insuranceCompany: '', insuranceExpiry: '',
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
      console.error("Data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- COMPANY UPDATE HANDLERS ---
  const handleOpenCompanyEdit = (comp: any) => {
    setSelectedId(comp._id);
    setCompanyForm({
      companyCode: comp.companyCode || `C-${String(companies.length + 1).padStart(3, '0')}`,
      nameEn: comp.nameEn || '', nameAr: comp.nameAr || '',
      dedNumber: comp.dedNumber || '', establishmentDate: comp.establishmentDate || '',
      issuanceDate: comp.issuanceDate || '', expiryDate: comp.expiryDate || '',
      legalForm: comp.legalForm || 'Establishment',
      owners: comp.owners || [{ isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }],
      managers: comp.managers || [{ role: '', nationality: '', name: '', mobile: '' }],
      activities: comp.activities || [''],
      hasLease: comp.hasLease || 'No', leaseNumber: comp.leaseNumber || '', leaseExpiry: comp.leaseExpiry || '', leasePlace: comp.leasePlace || '', companyEmail: comp.companyEmail || '', companyMobile: comp.companyMobile || '',
      icpCardNumber: comp.icpCardNumber || '', eChannelUser: comp.eChannelUser || '', eChannelPass: comp.eChannelPass || '', icpIssueDate: comp.icpIssueDate || '', icpExpiryDate: comp.icpExpiryDate || '',
      mohreNumber: comp.mohreNumber || '', mohreLastUpdate: comp.mohreLastUpdate || '',
      damanPolicy: comp.damanPolicy || '', damanExpiry: comp.damanExpiry || '', damanTotalMembers: comp.damanTotalMembers || '',
      contactPersonDetails: comp.contactPersonDetails || ''
    });
    setIsCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/companies?id=${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm)
      });
      if (res.ok) { setIsCompanyModalOpen(false); fetchData(); }
    } catch (err) { console.error(err); }
  };

  // --- EMPLOYEE CRUD HANDLERS ---
  const handleOpenEmployeeAdd = () => {
    setIsEmployeeEdit(false);
    setSelectedId(null);
    setEmployeeForm({
      employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      companyId: '', name: '', designation: '', nationality: '',
      passportNo: '', passportExpiry: '', emiratesIdNo: '', emiratesIdIssue: '', emiratesIdExpiry: '',
      labourCardNo: '', labourCardExpiry: '', iloeExpiry: '', insuranceCompany: '', insuranceExpiry: '',
      dob: '', mobile: '', email: ''
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
    let method = 'POST';
    if (isEmployeeEdit) { url += `?id=${selectedId}`; method = 'PUT'; }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      });
      if (res.ok) { setIsEmployeeModalOpen(false); fetchData(); }
    } catch (err) { console.error(err); }
  };

  const handleEmployeeCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel/delete this employee?')) return;
    try {
      const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  // Dynamic Owners Array Adjustments based on Legal Form Requirements
  const fixOwnersLimit = (formType: string) => {
    let currentOwners = [...companyForm.owners];
    if (formType === 'Establishment' || formType === 'Limited Liability Company- sole proprietorship Company') {
      currentOwners = [currentOwners[0] || { isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }];
    }
    setCompanyForm({ ...companyForm, legalForm: formType, owners: currentOwners });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Noor al Huda CRM</h1>
            <p className="text-xs text-slate-400 mt-0.5">Staff Portal: Manage Workers & Update Companies</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input type="text" placeholder="Search profiles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-64" />
              <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            </div>
            <button onClick={() => router.push('/login')} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white transition">Log Out</button>
          </div>
        </div>

        {/* Tab Switcher Panel */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-2.5 text-xs font-bold transition border-b-2 ${activeTab === 'employees' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            👷 Employees / Workers Registry
          </button>
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-2.5 text-xs font-bold transition border-b-2 ${activeTab === 'companies' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            🏢 Linked Client Companies (Read & Update)
          </button>
        </div>

        {/* --- EMPLOYEES RENDER VIEW --- */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Active Field Force Directory</h2>
              <button onClick={handleOpenEmployeeAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md">
                + Register New Employee
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {employees.filter(e => (e.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((emp) => (
                <div key={emp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-bold font-mono">{emp.employeeId || 'EMP-X'}</p>
                        <p className="font-bold text-slate-100 text-sm truncate">{emp.name}</p>
                        <p className="text-xs text-slate-400 truncate">{emp.designation || 'General Labor'}</p>
                      </div>
                      <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-medium">
                        {companies.find(c => c._id === emp.companyId)?.nameEn || 'Direct Client'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <p>Passport: <span className="text-slate-200 font-mono">{emp.passportNo || '—'}</span></p>
                      <p>Visa Exp: <span className="text-amber-400">{emp.visaExpiry || '—'}</span></p>
                      <p>Emirates ID: <span className="text-slate-200 font-mono">{emp.emiratesIdNo || '—'}</span></p>
                      <p>Labour Card: <span className="text-slate-200">{emp.labourCardNo || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button onClick={() => handleOpenEmployeeEdit(emp)} className="text-xs bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl hover:bg-slate-700 transition">Update</button>
                    <button onClick={() => handleEmployeeCancel(emp._id)} className="text-xs bg-red-950/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-900/20 transition">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- COMPANIES RENDER VIEW --- */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Assigned Corporate Directory (View & Adjust Only)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.filter(c => (c.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase())).map((comp) => (
                <div key={comp._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-3">
                      <div>
                        <p className="text-[10px] text-slate-500 font-mono font-bold">{comp.companyCode || 'C-XYZ'}</p>
                        <p className="font-bold text-slate-100 text-sm">{comp.nameEn}</p>
                        <p className="text-xs text-slate-400 font-serif">{comp.nameAr || 'الاسم باللغة العربية'}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{comp.legalForm}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p>DED License Number: <span className="text-slate-200 font-mono">{comp.dedNumber || '—'}</span></p>
                      <p>License Expiry Date: <span className="text-red-400">{comp.expiryDate || '—'}</span></p>
                      <p>ICP Est Card: <span className="text-slate-200 font-mono">{comp.icpCardNumber || '—'}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button onClick={() => handleOpenCompanyEdit(comp)} className="text-xs bg-slate-800 text-amber-400 px-4 py-1.5 rounded-xl hover:bg-slate-700 transition">Adjust Company Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          1. COMPANY UPDATE MODAL (With Comprehensive Ownership/Lease/ICP/MOHRE/Daman Fields)
          ========================================================================= */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl my-8 h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Modify Profile: {companyForm.companyCode}</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleCompanySubmit} className="space-y-6 text-xs">
              {/* Core Corporate Segment */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <p className="font-bold text-emerald-400 border-b border-slate-800 pb-1">1. Economic License Identifiers</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Company Name (English)</label>
                    <input type="text" value={companyForm.nameEn} onChange={(e)=>setCompanyForm({...companyForm, nameEn:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Company Name (Arabic)</label>
                    <input type="text" value={companyForm.nameAr} onChange={(e)=>setCompanyForm({...companyForm, nameAr:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-right" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">DED License No (CN/IN-XXXX)</label>
                    <input type="text" value={companyForm.dedNumber} onChange={(e)=>setCompanyForm({...companyForm, dedNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <div>
                    <label className="block text-slate-400 mb-1">Legal Form Structure</label>
                    <select value={companyForm.legalForm} onChange={(e)=>fixOwnersLimit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white">
                      <option value="Establishment">Establishment (Local Emirati)</option>
                      <option value="Limited Liability Company- sole proprietorship Company">LLC - Sole Proprietorship</option>
                      <option value="limited Liability Company">Limited Liability Company (LLC)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Ownership Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <p className="font-bold text-emerald-400">2. Shareholders / Representatives Structure</p>
                  {companyForm.legalForm === 'limited Liability Company' && (
                    <button type="button" onClick={() => setCompanyForm({...companyForm, owners: [...companyForm.owners, { isCompany: false, role: '', nationality: '', name: '', emiratesId: '', eIdExpiry: '', insuranceNo: '', insuranceExpiry: '', mobile: '', companyNo: '', companyName: '', issuePlace: '', contactPerson: '', contactNumber: '' }]})} className="bg-slate-800 text-emerald-400 px-2 py-1 rounded text-[11px]">+ Add Shareholder</button>
                  )}
                </div>
                
                {companyForm.owners.map((owner, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex items-center gap-4 bg-slate-900 p-2 rounded">
                      <label className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <input type="checkbox" checked={owner.isCompany} onChange={(e) => {
                          const updated = [...companyForm.owners];
                          updated[idx].isCompany = e.target.checked;
                          setCompanyForm({...companyForm, owners: updated});
                        }} /> This Shareholder is a Corporate Entity/Company
                      </label>
                    </div>

                    {!owner.isCompany ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" placeholder="Role/Position" value={owner.role} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].role=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Nationality" value={owner.nationality} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].nationality=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Full Name" value={owner.name} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].name=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Emirates ID No" value={owner.emiratesId} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].emiratesId=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="date" placeholder="E-ID Expiry" value={owner.eIdExpiry} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].eIdExpiry=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Insurance No (if non-local)" value={owner.insuranceNo} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].insuranceNo=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="date" placeholder="Insurance Expiry" value={owner.insuranceExpiry} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].insuranceExpiry=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Mobile Number" value={owner.mobile} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].mobile=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder="Role/Position" value={owner.role} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].role=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Company No" value={owner.companyNo} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].companyNo=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Company Name" value={owner.companyName} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].companyName=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Company Issue Place" value={owner.issuePlace} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].issuePlace=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Corporate Contact Person" value={owner.contactPerson} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].contactPerson=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                        <input type="text" placeholder="Contact Phone Number" value={owner.contactNumber} onChange={(e)=>{const u=[...companyForm.owners]; u[idx].contactNumber=e.target.value; setCompanyForm({...companyForm, owners:u})}} className="bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Managers / Activities / Lease Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="font-bold text-emerald-400">3. Scope of Activities (Manual Logs)</p>
                  {companyForm.activities.map((act, aIdx) => (
                    <div key={aIdx} className="flex gap-2">
                      <input type="text" required placeholder="Activity entry Description" value={act} onChange={(e)=>{const a=[...companyForm.activities]; a[aIdx]=e.target.value; setCompanyForm({...companyForm, activities:a})}} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                    </div>
                  ))}
                  <button type="button" onClick={()=>setCompanyForm({...companyForm, activities: [...companyForm.activities, '']})} className="text-emerald-500 font-bold hover:underline">+ Append Extra Activity Option</button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="font-bold text-emerald-400">4. Legal Lease/Tenancy Parameters</p>
                  <div>
                    <label className="block text-slate-400 mb-1">Does company possess active Lease Contract?</label>
                    <select value={companyForm.hasLease} onChange={(e)=>setCompanyForm({...companyForm, hasLease: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 w-full text-white">
                      <option value="No">No / Flexi Desk Route</option>
                      <option value="Yes">Yes (Physical Shop/Office)</option>
                    </select>
                  </div>
                  {companyForm.hasLease === 'Yes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <input type="text" placeholder="Contract No" value={companyForm.leaseNumber} onChange={(e)=>setCompanyForm({...companyForm, leaseNumber: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white" />
                      <input type="date" placeholder="Expiry Date" value={companyForm.leaseExpiry} onChange={(e)=>setCompanyForm({...companyForm, leaseExpiry: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white" />
                      <input type="text" placeholder="Premises Location" value={companyForm.leasePlace} onChange={(e)=>setCompanyForm({...companyForm, leasePlace: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* ICP & Mohre Government Portals Data */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <p className="font-bold text-emerald-400 border-b border-slate-800 pb-1">5. Immigration (ICP) & MoHRE Portals Configuration</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="ICP Est. Card Number" value={companyForm.icpCardNumber} onChange={(e)=>setCompanyForm({...companyForm, icpCardNumber: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="E-Channel Username" value={companyForm.eChannelUser} onChange={(e)=>setCompanyForm({...companyForm, eChannelUser: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="E-Channel Password" value={companyForm.eChannelPass} onChange={(e)=>setCompanyForm({...companyForm, eChannelPass: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="date" placeholder="Est Card Issue" value={companyForm.icpIssueDate} onChange={(e)=>setCompanyForm({...companyForm, icpIssueDate: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="date" placeholder="Est Card Expiry" value={companyForm.icpExpiryDate} onChange={(e)=>setCompanyForm({...companyForm, icpExpiryDate: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="MoHRE Employer Number" value={companyForm.mohreNumber} onChange={(e)=>setCompanyForm({...companyForm, mohreNumber: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="date" placeholder="MOHRE Last Update Date" value={companyForm.mohreLastUpdate} onChange={(e)=>setCompanyForm({...companyForm, mohreLastUpdate: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="text" placeholder="Daman Policy ID" value={companyForm.damanPolicy} onChange={(e)=>setCompanyForm({...companyForm, damanPolicy: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="date" placeholder="Daman Scheme Expiry" value={companyForm.damanExpiry} onChange={(e)=>setCompanyForm({...companyForm, damanExpiry: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                  <input type="number" placeholder="Total Members Logged" value={companyForm.damanTotalMembers} onChange={(e)=>setCompanyForm({...companyForm, damanTotalMembers: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
              </div>

              {/* Footers buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-300">Close</button>
                <button type="submit" className="bg-amber-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Apply Company Adjustments</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. CLEAN EMPLOYEE POPUP FORM (Add/Update Fields Exactly requested without mandatory locks)
          ========================================================================= */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{isEmployeeEdit ? 'Update Document Logs' : 'Add New Corporate Crew'}</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <label className="block text-slate-400 mb-1">Employee System ID</label>
                  <input type="text" readOnly value={employeeForm.employeeId} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Associated Company Link</label>
                  <select value={employeeForm.companyId} onChange={(e)=>setEmployeeForm({...employeeForm, companyId: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white">
                    <option value="">-- No Link / Independent --</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Employee Legal Name</label>
                  <input type="text" value={employeeForm.name} onChange={(e)=>setEmployeeForm({...employeeForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Designation</label>
                  <input type="text" value={employeeForm.designation} onChange={(e)=>setEmployeeForm({...employeeForm, designation: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nationality</label>
                  <input type="text" value={employeeForm.nationality} onChange={(e)=>setEmployeeForm({...employeeForm, nationality: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Passport Number</label>
                  <input type="text" value={employeeForm.passportNo} onChange={(e)=>setEmployeeForm({...employeeForm, passportNo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Passport Expiry Date</label>
                  <input type="date" value={employeeForm.passportExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, passportExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Emirates ID Number</label>
                  <input type="text" value={employeeForm.emiratesIdNo} onChange={(e)=>setEmployeeForm({...employeeForm, emiratesIdNo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Emirates ID Issue Date</label>
                  <input type="date" value={employeeForm.emiratesIdIssue} onChange={(e)=>setEmployeeForm({...employeeForm, emiratesIdIssue: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Emirates ID Expiry</label>
                  <input type="date" value={employeeForm.emiratesIdExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, emiratesIdExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Labour Card Number</label>
                  <input type="text" value={employeeForm.labourCardNo} onChange={(e)=>setEmployeeForm({...employeeForm, labourCardNo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Labour Card Expiry Date</label>
                  <input type="date" value={employeeForm.labourCardExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, labourCardExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800 pb-3">
                <div>
                  <label className="block text-slate-400 mb-1">ILOE Expiry Date</label>
                  <input type="date" value={employeeForm.iloeExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, iloeExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Insurance Company Name</label>
                  <input type="text" value={employeeForm.insuranceCompany} onChange={(e)=>setEmployeeForm({...employeeForm, insuranceCompany: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Insurance Expiry Date</label>
                  <input type="date" value={employeeForm.insuranceExpiry} onChange={(e)=>setEmployeeForm({...employeeForm, insuranceExpiry: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              {/* Optional Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400 italic">
                <div>
                  <label className="block text-xs not-italic text-slate-500 mb-1">Date of Birth (Optional)</label>
                  <input type="date" value={employeeForm.dob} onChange={(e)=>setEmployeeForm({...employeeForm, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs not-italic text-slate-500 mb-1">Contact Mobile (Optional)</label>
                  <input type="text" value={employeeForm.mobile} onChange={(e)=>setEmployeeForm({...employeeForm, mobile: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs not-italic text-slate-500 mb-1">Email Address (Optional)</label>
                  <input type="email" value={employeeForm.email} onChange={(e)=>setEmployeeForm({...employeeForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 mt-6">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-300">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2 font-bold rounded-xl shadow-md">Save Worker Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}