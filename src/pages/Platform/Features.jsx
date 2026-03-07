import React, { useState } from 'react';
import { BuildingOffice2Icon, PlusIcon, XMarkIcon, CheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// Added useGetDomainsQuery and useAssignFeatureToDomainMutation
import { 
  useGetFeaturesQuery, 
  useCreateFeatureMutation, 
  useGetDomainsQuery, 
  useAssignFeatureToDomainMutation 
} from '../../api/platform/feature.api';
import { useGetDomainsQuery as useGetDomainsQueryCommon } from "../../api/Common/domain.api";
import toast, { Toaster } from 'react-hot-toast';

const Feature = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedDomainId, setSelectedDomainId] = useState('');

  const [formData, setFormData] = useState({
    feature_name: '',
    feature_code: '',
    description: '',
    isActive: true
  });

  // Queries & Mutations
  const { data: featuresData, isLoading } = useGetFeaturesQuery();
  const { data: domainsData, isLoading: isLoadingDomains } = useGetDomainsQueryCommon();
  const [createFeature, { isLoading: isCreating }] = useCreateFeatureMutation();
  const [assignFeature, { isLoading: isAssigning }] = useAssignFeatureToDomainMutation();

  const featuresList = featuresData?.features || [];
  const domainsList = domainsData?.domains || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeature(formData).unwrap();
      toast.success("Feature created successfully!");
      setShowModal(false);
      setFormData({ feature_name: '', feature_code: '', description: '', isActive: true });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create feature");
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDomainId) return toast.error("Please select a domain");
    
    try {
      await assignFeature({ 
        featureId: selectedFeature.id, 
        domainId: selectedDomainId 
      }).unwrap();
      
      toast.success(`Assigned ${selectedFeature.feature_name} to domain!`);
      setShowDomainModal(false);
      setSelectedDomainId('');
    } catch (err) {
      toast.error(err?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 p-4 lg:p-8 rounded-2xl font-sans text-slate-900">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center bg-white  dark:bg-slate-800 border border-slate-200 p-6 rounded-2xl justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <BuildingOffice2Icon className="w-8 h-8 text-emerald-600" />
              Feature Management
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage system-wide features and assignments.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Feature</span>
          </button>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Feature Name & Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
               {/* <th className="px-6 py-4">Assign To Domain</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-10 text-center animate-pulse text-slate-400 font-bold">LOADING...</td></tr>
              ) : (
                featuresList.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 uppercase leading-tight">{f.feature_name}</div>
                      <div className="text-[10px] font-mono text-emerald-600 font-bold mt-1">{f.feature_code}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{f.description || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${f.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {f.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedFeature(f);
                          setShowDomainModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                      >
                        <GlobeAltIcon className="w-4 h-4" />
                        Assign to Domain
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ASSIGN TO DOMAIN MODAL --- */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-blue-50">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Assign Domain</h2>
                <p className="text-[10px] text-blue-600 font-bold uppercase">{selectedFeature?.feature_name}</p>
              </div>
              <button onClick={() => setShowDomainModal(false)}><XMarkIcon className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleAssignSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Select Target Domain</label>
                <select 
                  required
                  value={selectedDomainId}
                  onChange={(e) => setSelectedDomainId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none"
                >
                  <option value="">Choose a domain...</option>
                  {domainsList.map(domain => (
                    <option key={domain.id} value={domain.id}>{domain.domain_name}</option>
                  ))}
                </select>
                {isLoadingDomains && <p className="text-[10px] mt-2 animate-pulse text-blue-500">Loading domains...</p>}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Assigning this feature will grant the selected domain access to <strong>{selectedFeature?.feature_code}</strong> capabilities.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isAssigning || !selectedDomainId}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {isAssigning ? 'Processing...' : 'Confirm Assignment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FEATURE MODAL (Keep your existing one) */}
      {/* ... */}
       {/* CREATE FEATURE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* ... Modal content remains the same ... */}
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">New Feature</h2>
              <button onClick={() => setShowModal(false)}><XMarkIcon className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Feature Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  value={formData.feature_name}
                  onChange={(e) => setFormData({...formData, feature_name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Feature Code</label>
                <input 
                  required
                  placeholder="e.g. USR_MGMT"
                  className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  value={formData.feature_code}
                  onChange={(e) => setFormData({...formData, feature_code: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-500">Feature Status</span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${formData.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}
                >
                  <CheckIcon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{formData.isActive ? 'Active' : 'Draft'}</span>
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Register Feature'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feature;