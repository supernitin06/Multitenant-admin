import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiInfo, FiTag, FiDollarSign } from "react-icons/fi";
import { useCreateDomainMutation } from "../../api/Common/domain.api";

export default function DomainForm({ isOpen, onClose, initialData, refetch }) {
  const [formData, setFormData] = useState({
    domain_name: "",
    price: "",
    description: ""
  });

  const [createDomain, { isLoading: isCreating }] = useCreateDomainMutation();

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    price: Number(formData.price), // 👈 FORCE number
  };

  try {
    await createDomain(payload).unwrap();
    onClose();
  } catch (error) {
    console.error(error);
    alert(error?.data?.message || "Failed to create domain");
  }
};


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {initialData ? "Edit Domain" : "New Domain"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Domain Name */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Domain Name</label>
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="e.g. example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium dark:text-white"
                value={formData.domain_name}
                onChange={(e) => setFormData({...formData, domain_name: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Registration Price</label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="number"
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium dark:text-white"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
            <div className="relative">
              <FiInfo className="absolute left-4 top-4 text-slate-400" />
              <textarea 
                placeholder="Enter domain details..."
                rows="3"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium dark:text-white"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isCreating}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave /> {isCreating ? "Creating..." : (initialData ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}