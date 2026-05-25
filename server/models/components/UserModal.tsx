'use client';

interface UserModalProps {
  isOpen: boolean;
  form: any;
  setForm: (form: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UserModal({ isOpen, form, setForm, onClose, onSubmit }: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-xs font-medium">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <h3 className="text-base font-black text-white mb-4 tracking-tight">Issue Portal Channel Access</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">Identity Full Name</label>
            <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Authorized Login Channel (Email)</label>
            <input type="email" required value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">System Temporary Access Password</label>
            <input type="password" required value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Security Privilege Matrix</label>
            <select value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold">
              <option value="Super Admin">Super Admin Privilege</option>
              <option value="Manager">Manager Privilege</option>
              <option value="Staff">Staff Privilege</option>
              <option value="Customer">Customer Privilege</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-600/20">Authorize Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}