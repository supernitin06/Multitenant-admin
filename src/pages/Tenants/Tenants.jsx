import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiUsers, FiX, FiEdit3, FiTrash2 } from "react-icons/fi";

// Components
import { TenantsHeader } from "../../components/Common/GenericHeader";
import { CreateButton } from "../../components/Common/GenericButton";
import GenericTable from "../../components/Common/GenericTable";
import TenantForm from "../../components/Tenants/TenantForm";

// APIs
import {
  useGetTenantsQuery,
  useAsignPlanMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useCreateTenantMutation
} from "../../api/tenants/tenant.api";
import { useGetPlansQuery } from "../../api/plans.api";

export default function Tenants() {
  // --- STATE ---
  const [assigningTenant, setAssigningTenant] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  // --- API HOOKS ---
  const { data: tenantsData, isLoading: isTenantsLoading } = useGetTenantsQuery();
  const tenants = tenantsData?.tenants || [];

  const { data: plansData } = useGetPlansQuery();
  const plans = plansData?.plans || [];

  const [assignPlan, { isLoading: isAssigning }] = useAsignPlanMutation();
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();
  const [deleteTenant] = useDeleteTenantMutation();

  // --- HANDLERS ---
  const openAssignModal = (tenant) => {
    setAssigningTenant(tenant);
    setSelectedPlanId("");
  };

  const closeAssignModal = () => {
    setAssigningTenant(null);
    setSelectedPlanId("");
  };

  const handleAssignPlanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return toast.error("Please select a plan");
    if (!assigningTenant?.id) return toast.error("Tenant ID missing");

    try {
      await assignPlan({
        tenantId: assigningTenant.id,
        planId: selectedPlanId,
      }).unwrap();
      toast.success(`Plan assigned to ${assigningTenant.tenantName} successfully!`);
      closeAssignModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign plan");
    }
  };

  const openCreateModal = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleDelete = async (tenant) => {
    if (!window.confirm(`Are you sure you want to delete ${tenant.tenantName}?`)) return;
    try {
      await deleteTenant(tenant.id).unwrap();
      toast.success("Tenant deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete tenant");
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingTenant) {
      try {
        await updateTenant({ id: editingTenant.id, ...formData }).unwrap();
        toast.success("Tenant updated successfully");
        setIsFormOpen(false);
      } catch (err) {
        toast.error(err?.data?.message || "Failed to update tenant");
      }
    } else {
      // In this architecture, creation might be triggered inside the form or here.
      // If the TenantForm has its own create logic, we just close the modal.
      setIsFormOpen(false);
    }
  };

  // --- TABLE CONFIGURATION ---
  const tableConfig = {
    title: "All Tenants",
    headerIcon: <FiUsers className="text-amber-500" />,
    loadingText: "Loading Tenants...",
    columns: [
      {
        label: "Tenant Name",
        key: "tenantName",
        type: "custom",
        render: (item, value) => (
          <div>
            <div className="font-bold text-slate-700 dark:text-white uppercase tracking-tight">{value}</div>
            <div className="text-[10px] text-slate-400 font-mono">ID: {item.id}</div>
          </div>
        )
      },
      {
        label: "Type",
        key: "tenantType",
        type: "custom",
        render: (item, value) => (
          <span className="text-[10px] font-black px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 uppercase">
            {value}
          </span>
        )
      },
      {
        label: "Current Plan",
        key: "plan",
        type: "custom",
        render: (item, value) => (
          value ? (
            <span className="inline-block px-2 py-1 rounded-md bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
              {value}
            </span>
          ) : (
            <span className="text-slate-400 italic text-[10px] uppercase font-bold">No Plan</span>
          )
        )
      },
      {
        label: "Status",
        key: "isActive",
        type: "custom",
        render: (item, value) => (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${value === true
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {value ? "Active" : "Inactive"}
          </span>
        )
      },
      {
        label: "Created At",
        key: "createdAt",
        type: "custom",
        render: (item, value) => (
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">
            {value ? new Date(value).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : '-'}
          </div>
        )
      }
    ],
    actions: [
      {
        type: "custom",
        handler: "onAssignPlan",
        icon: <span className="text-[9px] font-black uppercase tracking-widest px-1">Assign Plan</span>,
        className: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 dark:border-blue-500/20"
      },
      { type: "edit", handler: "onEdit" },
      { type: "delete", handler: "onDelete" }
    ]
  };

  const handlers = {
    onAssignPlan: (tenant) => openAssignModal(tenant),
    onEdit: (tenant) => openEditModal(tenant),
    onDelete: (tenant) => handleDelete(tenant)
  };

  // --- RENDER ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-900">

      {/* 1. HEADER */}
      <TenantsHeader
        actions={[
          <CreateButton
            key="create-tenant"
            onClick={openCreateModal}
            children="Onboard Tenant"
          />
        ]}
      />

      {/* 2. TABLE */}
      <GenericTable
        config={tableConfig}
        data={tenants}
        loading={isTenantsLoading}
        handlers={handlers}
      />

      {/* 3. ASSIGN PLAN MODAL */}
      {assigningTenant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">Assign Plan</h3>
              <button onClick={closeAssignModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"><FiX size={20} /></button>
            </div>
            <div className="p-8 space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Target: <span className="text-slate-800 dark:text-white">{assigningTenant.tenantName}</span>
              </p>
              <form onSubmit={handleAssignPlanSubmit} className="space-y-6 pt-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                  >
                    <option value="">-- Choose a Plan --</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={closeAssignModal} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase text-xs tracking-wider">Cancel</button>
                  <button type="submit" disabled={!selectedPlanId || isAssigning} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-70">
                    {isAssigning ? "Assigning..." : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. FORM MODAL (CREATE / EDIT) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">
                {editingTenant ? `Edit: ${editingTenant.tenantName}` : "Onboard New Tenant"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"><FiX size={20} /></button>
            </div>
            <div className="p-8 overflow-y-auto">
              <TenantForm
                initialData={editingTenant}
                onSubmit={handleFormSubmit}
                submitting={isUpdating}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}