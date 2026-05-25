'use client';

interface CompanyModalProps {
  isOpen: boolean;
  isEdit: boolean;
  form: any;
  setForm: (form: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CompanyModal({ isOpen, isEdit, form, setForm, onClose, onSubmit }: CompanyModalProps) {
  if (!isOpen) return null;

  const handleLegalFormChange = (formType: string) => {
    let initialOwners = [...form.owners];
    if (formType === 'Establishment' || formType === 'Limited Liability Company- sole proprietorship Company') {
      initialOwners = [initialOwners[0] || { isCompany: false }];
    }
    setForm({ ...form, legalForm: formType, owners: initialOwners });
  };

  const addOwnerField = () => {
    setForm({
      ...form,
      owners: [...form.owners, { isCompany: false, rolePosition: '', nationality: '', name: '', emiratesId: '', emiratesIdExpiry: '', insuranceNumber: '', insuranceExpiry: '', mobileNo: '', companyNo: '', companyName: '', companyIssuePlace: '', companyContactPerson: '', contactNumber: '' }]
    });
  };

  const removeOwnerField = (index: number) => {
    const updated = form.owners.filter((_: any, i: number) => i !== index);
    setForm({ ...form, owners: updated });
  };

  const updateOwnerData = (index: number, key: string, value: any) => {
    const updatedOwners = [...form.owners];
    updatedOwners[index][key] = value;
    setForm({ ...form, owners: updatedOwners });
  };

  const addActivityField = () => {
    setForm({ ...form, activities: [...(form.activities || []), ''] });
  };

  const updateActivityField = (index: number, val: string) => {
    const updated = [...(form.activities || [''])];
    updated[index] = val;
    setForm({ ...form, activities: updated });
  };

  const removeActivityField = (index: number) => {
    if ((form.activities || []).length <= 1) return; 
    const updated = form.activities.filter((_: any, i: number) => i !== index);
    setForm({ ...form, activities: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto selection:bg-indigo-500 selection:text-white text-xs text-slate-300 font-medium">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl p-6 shadow-2xl my-8 h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white tracking-tight">{isEdit ? 'Modify Corporate Parameters' : 'Deploy Corporate Architecture'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-xl text-xs">✕</button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* BLOCK 1: CORE PARAMS */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px] border-b border-slate-800 pb-1.5">1. Core Legal Identifiers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Company Name (English)</label>
                <input type="text" value={form.nameEn || ''} onChange={(e)=>setForm({...form, nameEn:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Company Name (Arabic)</label>
                <input type="text" value={form.nameAr || ''} onChange={(e)=>setForm({...form, nameAr:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-right focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Legal Structure Form</label>
                <select value={form.legalForm || 'Establishment'} onChange={(e) => handleLegalFormChange(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option value="Establishment">Establishment</option>
                  <option value="Limited Liability Company- sole proprietorship Company">Limited Liability Company- sole proprietorship Company (LLC-SPC)</option>
                  <option value="limited Liability Company">Limited Liability Company (LLC)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">DED Economic License Number</label>
                <input type="text" placeholder="CN/IN-XXXXXX" value={form.dedNumber || ''} onChange={(e)=>setForm({...form, dedNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">License Issuance Date</label>
                <input type="date" value={form.issuanceDate || ''} onChange={(e)=>setForm({...form, issuanceDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">License Expiry Date</label>
                <input type="date" value={form.expiryDate || ''} onChange={(e)=>setForm({...form, expiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          {/* BLOCK 2: OWNERSHIP */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px]">2. Ownership Profiles & Representatives</p>
              {form.legalForm === 'limited Liability Company' && (
                <button type="button" onClick={addOwnerField} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 transition-all">+ Add Extra Partner</button>
              )}
            </div>

            {form.owners?.map((owner: any, index: number) => (
              <div key={index} className="p-4 bg-slate-900 rounded-xl border border-slate-800/50 space-y-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeOwnerField(index)} className="absolute top-2 right-2 text-rose-400 hover:underline">Remove</button>
                )}
                
                <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2">
                  <input type="checkbox" id={`isComp-${index}`} checked={owner.isCompany || false} onChange={(e) => updateOwnerData(index, 'isCompany', e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 w-3.5 h-3.5" />
                  <label htmlFor={`isComp-${index}`} className="text-slate-300 font-bold tracking-wide">Owner is a Corporate Enterprise Entity (Company)</label>
                </div>

                {!owner.isCompany ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">Role/Position</label>
                      <input type="text" value={owner.rolePosition || ''} onChange={(e) => updateOwnerData(index, 'rolePosition', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Nationality</label>
                      <input type="text" value={owner.nationality || ''} onChange={(e) => updateOwnerData(index, 'nationality', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Full Name</label>
                      <input type="text" value={owner.name || ''} onChange={(e) => updateOwnerData(index, 'name', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Emirates ID</label>
                      <input type="text" value={owner.emiratesId || ''} onChange={(e) => updateOwnerData(index, 'emiratesId', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">E-ID Expiry Date</label>
                      <input type="date" value={owner.emiratesIdExpiry || ''} onChange={(e) => updateOwnerData(index, 'emiratesIdExpiry', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Insurance Policy Number</label>
                      <input type="text" value={owner.insuranceNumber || ''} onChange={(e) => updateOwnerData(index, 'insuranceNumber', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Insurance Expiry Date</label>
                      <input type="date" value={owner.insuranceExpiry || ''} onChange={(e) => updateOwnerData(index, 'insuranceExpiry', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Mobile Contact No</label>
                      <input type="text" value={owner.mobileNo || ''} onChange={(e) => updateOwnerData(index, 'mobileNo', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">Role / Structural Position</label>
                      <input type="text" value={owner.rolePosition || ''} onChange={(e) => updateOwnerData(index, 'rolePosition', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Enterprise Company Number</label>
                      <input type="text" value={owner.companyNo || ''} onChange={(e) => updateOwnerData(index, 'companyNo', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Corporate Entity Name</label>
                      <input type="text" value={owner.companyName || ''} onChange={(e) => updateOwnerData(index, 'companyName', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Corporate Issuance Location</label>
                      <input type="text" value={owner.companyIssuePlace || ''} onChange={(e) => updateOwnerData(index, 'companyIssuePlace', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Designated Focal Contact Person</label>
                      <input type="text" value={owner.companyContactPerson || ''} onChange={(e) => updateOwnerData(index, 'companyContactPerson', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Focal Contact Mobile Number</label>
                      <input type="text" value={owner.contactNumber || ''} onChange={(e) => updateOwnerData(index, 'contactNumber', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BLOCK 3: ACTIVITIES */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px]">3. Approved License Economic Activities</p>
              <button type="button" onClick={addActivityField} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 transition-all">+ Add Activity</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.activities?.map((act: string, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder={`Activity line entry #${idx + 1}`} value={act || ''} onChange={(e) => updateActivityField(idx, e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" />
                  {(form.activities || []).length > 1 && (
                    <button type="button" onClick={() => removeActivityField(idx)} className="text-rose-500 hover:text-rose-400 text-xs px-2 font-bold">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 4: PORTAL CREDENTIALS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px] border-b border-slate-800 pb-1.5">4. ICP Portal & E-Channel Configurations</p>
              <div>
                <label className="block text-slate-500 mb-1">ICP Establishment Card Number</label>
                <input type="text" value={form.icpEstablishmentCardNumber || ''} onChange={(e)=>setForm({...form, icpEstablishmentCardNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">E-Channel Username</label>
                  <input type="text" value={form.eChannelUsername || ''} onChange={(e)=>setForm({...form, eChannelUsername:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">E-Channel Password</label>
                  <input type="text" value={form.eChannelPassword || ''} onChange={(e)=>setForm({...form, eChannelPassword:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Est Card Issue Date</label>
                  <input type="date" value={form.establishmentCardIssueDate || ''} onChange={(e)=>setForm({...form, establishmentCardIssueDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Est Card Expiry Date</label>
                  <input type="date" value={form.establishmentCardExpiryDate || ''} onChange={(e)=>setForm({...form, establishmentCardExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px] border-b border-slate-800 pb-1.5">5. MOHRE & Corporate Health Insurances</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">MOHRE Corporate Number</label>
                  <input type="text" value={form.mohreNumber || ''} onChange={(e)=>setForm({...form, mohreNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">MOHRE Update Last Date</label>
                  <input type="date" value={form.mohreUpdatingLastDate || ''} onChange={(e)=>setForm({...form, mohreUpdatingLastDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Daman Policy Number</label>
                <input type="text" value={form.damanPolicyNumber || ''} onChange={(e)=>setForm({...form, damanPolicyNumber:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Daman Policy Expiry Date</label>
                  <input type="date" value={form.damanExpiryDate || ''} onChange={(e)=>setForm({...form, damanExpiryDate:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Total Insured Members</label>
                  <input type="text" value={form.totalMembersInDaman || ''} onChange={(e)=>setForm({...form, totalMembersInDaman:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-colors">Discard Draft</button>
            <button type="submit" className="bg-indigo-600 px-5 py-2.5 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Commit Parameters</button>
          </div>
        </form>
      </div>
    </div>
  );
}