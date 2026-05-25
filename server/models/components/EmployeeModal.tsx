'use client';

interface EmployeeModalProps {
  isOpen: boolean;
  isEdit: boolean;
  form: any;
  setForm: (form: any) => void;
  companies: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EmployeeModal({ isOpen, isEdit, form, setForm, companies, onClose, onSubmit }: EmployeeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto text-xs text-slate-300 font-medium">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white tracking-tight">{isEdit ? 'Modify Worker Profile Parameters' : 'Deploy Worker Identity File'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-xl text-xs">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
            <div>
              <label className="block text-slate-500 mb-1">Corporate Sponsor Assignment</label>
              <select value={form.companyId} onChange={(e)=>setForm({...form, companyId:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white">
                {companies.map((c: any) => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Full Legal Worker Name</label>
              <input type="text" value={form.name || ''} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Designation Category</label>
              <input type="text" value={form.designation || ''} onChange={(e)=>setForm({...form, designation:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nationality</label>
              <input type="text" value={form.nationality || ''} onChange={(e)=>setForm({...form, nationality:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Passport No</label>
                <input type="text" value={form.passportNo || ''} onChange={(e)=>setForm({...form, passportNo:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Passport Expiry</label>
                <input type="date" value={form.passportExpiryDate || ''} onChange={(e)=>setForm({...form, passportExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Emirates ID No</label>
                <input type="text" value={form.emiratesIdNo || ''} onChange={(e)=>setForm({...form, emiratesIdNo:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">EID Expiry Date</label>
                <input type="date" value={form.emiratesIdExpiryDate || ''} onChange={(e)=>setForm({...form, emiratesIdExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Labour Card No</label>
                <input type="text" value={form.labourCardNo || ''} onChange={(e)=>setForm({...form, labourCardNo:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Labour Expiry Date</label>
                <input type="date" value={form.labourCardExpiryDate || ''} onChange={(e)=>setForm({...form, labourCardExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">ILOE Insurance Expiry</label>
              <input type="date" value={form.iloeExpiryDate || ''} onChange={(e)=>setForm({...form, iloeExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-700">Cancel</button>
            <button type="submit" className="bg-indigo-600 px-5 py-2.5 rounded-xl font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">Commit Parameters</button>
          </div>
        </form>
      </div>
    </div>
  );
}