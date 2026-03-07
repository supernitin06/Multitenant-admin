import React, { useState } from "react";
import { useGetPlansQuery, useCreatePlanMutation, useUpdatePlanMutation } from "../../api/plans.api";

import { FiPackage, FiActivity, FiPlus, FiX } from "react-icons/fi";

import PlanForm from "../../components/Plan/PlanForm";
import PlanTable from "../../components/Plan/PlanTable";

export default function Plans() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Updated initial form to include 'isActive'
  const initialForm = { 
    name: "", 
    price: "", 
    duration: "", 
    isActive: true, // Default to true for new tenants/plans
    moduleKeys: [] 
  };
  
  const [formData, setFormData] = useState(initialForm);

  // RTK Query hooks
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  
  
  // Mapping plans from your specific JSON structure
  const plans = plansData?.plans || plansData || []; 
  const modules = [];
  const loading = plansLoading || creating;

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // payload preparation
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };

      if (editingId) {
        await updatePlan({ planId: editingId, ...payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }
      handleCloseForm();
    } catch (err) {
      console.error("Submit Error:", err);
      alert(err?.data?.message || "Action failed");
    }
  };

  const handleEdit = (plan) => {
    // Handling the specific ID from your JSON
    setEditingId(plan.id || plan._id);
    
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      isActive: plan.isActive,
      // Mapping from the 'features' array in your JSON
      moduleKeys: plan.features?.map((f) => f.featureId) || [],
    });

    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0f172a] p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                <FiPackage size={28} />
              </div>
              Tenant Plans & Features
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-2 font-medium">
              <FiActivity className="text-emerald-500 animate-pulse" /> 
              Manage name, price, duration, and active status for tenants.
            </p>
          </div>

          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-200"
            >
              <FiPlus size={20} />
              Create New Tenant Plan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Form UI */}
          {isFormOpen && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {editingId ? "Edit Tenant Plan" : "Create New Tenant Plan"}
                  </h2>
                  {editingId && (
                    <span className="text-xs font-mono text-slate-400">ID: {editingId}</span>
                  )}
                </div>
                <button onClick={handleCloseForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500">
                  <FiX size={20} />
                </button>
              </div>
              
              <PlanForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={loading}
                isEditing={!!editingId}
                onCancel={handleCloseForm}
              />
            </div>
          )}

          {/* Table UI */}
          <div className={`${isFormOpen ? "opacity-40 blur-[2px] pointer-events-none" : "opacity-100"} transition-all duration-300`}>
            <PlanTable
              plans={plans}
              modules={modules}
              loading={loading}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}