import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  GenericTable,
  GenericModal,
  GenericForm,
  GenericButton,
  plansTableConfig
} from "../Common";
import { useUpdateModuleInPlanMutation, useSyncPlanToTenantsMutation, useAssignDomainToPlanMutation, useGetDomainsQuery } from "../../api/plans.api";
import { createSelectField } from "../Common/GenericForm";
import { plansTableConfig } from "../../config/tableConfigs.jsx";

export default function PlanTableCentralized({ plans, loading, onEdit, modules = [] }) {
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedModuleKeys, setSelectedModuleKeys] = useState([]);
  const [originalModuleKeys, setOriginalModuleKeys] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncingId, setSyncingId] = useState(null);

  // Domain assignment states
  const [assigningDomainPlan, setAssigningDomainPlan] = useState(null);
  const [selectedDomainId, setSelectedDomainId] = useState("");

  const [syncPlanToTenants] = useSyncPlanToTenantsMutation();
  const [updateModuleInPlan] = useUpdateModuleInPlanMutation();
  const [assignDomainToPlan] = useAssignDomainToPlanMutation();
  const { data: domainsData } = useGetDomainsQuery();
  const domains = domainsData?.domains || [];

  const handleSyncPlan = async (plan, e) => {
    if (e) e.stopPropagation();
    const planId = plan.id || plan._id;
    setSyncingId(planId);
    const toastId = toast.loading(`Syncing ${plan.name}...`);
    try {
      await syncPlanToTenants(planId).unwrap();
      toast.success("Plan synced successfully!", { id: toastId });
    } catch (error) {
      toast.error("Sync failed.", { id: toastId });
    } finally {
      setSyncingId(null);
    }
  };

  const openModuleSelector = (plan, e) => {
    if (e) e.stopPropagation();
    setSelectedPlan(plan);
    const currentKeys = plan.features?.map((f) => f.feature_name) || [];
    setSelectedModuleKeys([...new Set(currentKeys)]);
    setOriginalModuleKeys([...new Set(currentKeys)]);
  };

  const openDomainSelector = (plan, e) => {
    if (e) e.stopPropagation();
    setAssigningDomainPlan(plan);
    setSelectedDomainId("");
  };

  const handleDomainAssign = async (e) => {
    e.preventDefault();
    if (!selectedDomainId) {
      toast.error("Please select a domain");
      return;
    }

    try {
      await assignDomainToPlan({
        planId: assigningDomainPlan.id,
        domainId: selectedDomainId
      }).unwrap();

      toast.success("Domain assigned to plan successfully!");
      setAssigningDomainPlan(null);
      setSelectedDomainId("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign domain");
    }
  };

  // Prepare plans data with custom handlers
  const plansWithHandlers = plans.map(plan => ({
    ...plan,
    onAssignDomain: openDomainSelector
  }));

  // Module selector form fields
  const moduleFields = [
    createSelectField({
      name: "modules",
      label: "Select Modules",
      required: true,
      options: modules.map(mod => ({
        value: mod.key,
        label: mod.key
      }))
    })
  ];

  // Domain assignment form fields
  const domainFields = [
    createSelectField({
      name: "domainId",
      label: "Select Domain to Assign",
      required: true,
      options: domains.map(domain => ({
        value: domain.id,
        label: domain.domain_name
      }))
    })
  ];

  return (
    <>
      <Toaster toastOptions={{ className: 'dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-xs border border-emerald-100 dark:border-slate-700' }} />

      <GenericTable
        config={plansTableConfig}
        data={plansWithHandlers}
        loading={loading}
        handlers={{
          onEdit,
          onSync: handleSyncPlan,
          onManageFeatures: openModuleSelector
        }}
        expandedRows={expandedPlanId ? { [expandedPlanId]: true } : {}}
        onToggleExpand={(id, isExpanded) => setExpandedPlanId(isExpanded ? id : null)}
        additionalActions={[
          {
            icon: <FiRefreshCw size={14} className={syncingId === plans.find(p => p.id === id)?.id ? "animate-spin" : ""} />,
            handler: handleSyncPlan,
            className: "p-2.5 bg-white dark:bg-slate-900 text-slate-400 hover:text-amber-500 rounded-xl border border-slate-100 dark:border-slate-700 transition-all"
          }
        ]}
      />

      {/* Module Selector Modal */}
      {selectedPlan && (
        <GenericModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title="Manage Plan Modules"
          subtitle={`Configure modules for ${selectedPlan.name}`}
          size="LG"
          actions={[
            {
              label: "Cancel",
              onClick: () => setSelectedPlan(null)
            },
            {
              label: "Update Modules",
              onClick: () => {
                // Handle module update logic
                setSelectedPlan(null);
              },
              primary: true,
              loading: isUpdating
            }
          ]}
        >
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Available Modules</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {modules.map((mod) => {
                  const isActive = selectedModuleKeys.includes(mod.key);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setSelectedModuleKeys(prev => prev.filter(k => k !== mod.key));
                        } else {
                          setSelectedModuleKeys(prev => [...prev, mod.key]);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${isActive
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                          : "bg-transparent border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-200"
                        }`}
                    >
                      {isActive && <FiCheck size={12} />}
                      {mod.key}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </GenericModal>
      )}

      {/* Domain Assignment Modal */}
      {assigningDomainPlan && (
        <GenericModal
          isOpen={!!assigningDomainPlan}
          onClose={() => setAssigningDomainPlan(null)}
          title="Assign Domain to Plan"
          subtitle={`Assign a domain to ${assigningDomainPlan.name}`}
          actions={[
            {
              label: "Cancel",
              onClick: () => setAssigningDomainPlan(null)
            },
            {
              label: "Assign Domain",
              onClick: handleDomainAssign,
              primary: true,
              loading: assignDomainToPlan.isLoading,
              disabled: !selectedDomainId
            }
          ]}
        >
          <GenericForm
            fields={domainFields}
            onSubmit={handleDomainAssign}
            initialValues={{ domainId: selectedDomainId }}
            submitText="Assign Domain"
            loading={assignDomainToPlan.isLoading}
          />
        </GenericModal>
      )}
    </>
  );
}
