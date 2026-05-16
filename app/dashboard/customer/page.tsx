// app/dashboard/customer/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CustomerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilterCompany, setSelectedFilterCompany] = useState('all');

  useEffect(() => {
    const userEmail = 'customer@gmail.com'; 
    
    const fetchCustomerContent = async () => {
      try {
        const res = await fetch(`/api/customer-data?email=${userEmail}`);
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerContent();
  }, []);

  const getExpiryBadge = (expiryDateStr: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">Expired</span>;
    if (diffDays <= 30) return <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">⚠️ Urgent: {diffDays} Days</span>;
    if (diffDays <= 60) return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">⏳ Warning: {diffDays} Days</span>;
    return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">✓ Safe</span>;
  };

  if (loading) return <div className="p-10 text-center text-sm text-gray-500">Loading Client Portal...</div>;

  const companiesList = data?.companies || [];
  const employeesList = data?.employees || [];

  const filteredEmployees = selectedFilterCompany === 'all' 
    ? employeesList 
    : employeesList.filter((emp: any) => emp.companyId === selectedFilterCompany);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <header className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center mb-6 border border-slate-100">
        <div>
          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-100">Corporate Portal</span>
          <h1 className="text-xl font-black text-slate-900 mt-1">Noor al Huda CRM</h1>
          <p className="text-xs text-slate-500">Welcome, <span className="font-semibold text-slate-700">{data?.customerName}</span></p>
        </div>
        <button onClick={() => window.location.href = '/login'} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Logout</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Registered Companies ({companiesList.length})</h2>
          {companiesList.length === 0 ? (
            <p className="text-xs text-gray-400 p-3 bg-white rounded-xl border">No companies linked yet.</p>
          ) : (
            companiesList.map((c: any) => (
              <div key={c._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <p className="font-bold text-sm text-slate-800">{c.companyName}</p>
                <p className="text-[10px] text-blue-600 font-mono mt-0.5">License: {c.tradeLicense}</p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visa Expiry Dashboard</h2>
            <select 
              className="bg-white px-3 py-1.5 border rounded-lg text-xs font-semibold text-slate-700 outline-none"
              value={selectedFilterCompany}
              onChange={(e) => setSelectedFilterCompany(e.target.value)}
            >
              <option value="all">All Companies Logs</option>
              {companiesList.map((c: any) => (
                <option key={c._id} value={c._id}>{c.companyName}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Passport No</th>
                  <th className="px-4 py-3 text-center">Visa Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-900">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-xs text-gray-400">No records found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp: any) => (
                    <tr key={emp._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold">{emp.employeeName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{emp.passportNumber}</td>
                      <td className="px-4 py-3 text-center">{getExpiryBadge(emp.visaExpiry)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}