import React, { useState } from "react";
import {
  FiEdit3,
  FiPackage,
  FiLayers,
  FiX,
  FiChevronRight,
  FiPlus,
  FiGlobe,
  FiActivity,
  FiCpu,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import { useAssignDomainToPlanMutation } from "../../api/plans.api";
import { useGetDomainsQuery } from "../../api/Common/domain.api";

import PlanFeaturesModal from "./PlanFeaturesModal";

export default function PlanTable({ plans, loading, onEdit }) {
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [assigningDomainPlan, setAssigningDomainPlan] = useState(null);
  const [viewingPlanFeatures, setViewingPlanFeatures] = useState(null);
  const [selectedDomainId, setSelectedDomainId] = useState("");

  const { data: domainData, isLoading: domainsLoading } = useGetDomainsQuery();
  const domains = domainData?.domains || [];

  const [assignDomainToPlan, { isLoading: isAssigning }] = useAssignDomainToPlanMutation();

  const toggleExpand = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const openDomainSelector = (plan, e) => {
    e.stopPropagation();
    setAssigningDomainPlan(plan);
    setSelectedDomainId("");
  };

  const handleDomainAssign = async (e) => {
    e.preventDefault();
    if (!selectedDomainId) return toast.error("Please select a domain");

    try {
      await assignDomainToPlan({
        planId: assigningDomainPlan.id,
        domainId: selectedDomainId,
      }).unwrap();

      toast.success("Domain assigned successfully!");
      setAssigningDomainPlan(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign domain");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* FEATURE MODAL */}
      <PlanFeaturesModal
        isOpen={!!viewingPlanFeatures}
        onClose={() => setViewingPlanFeatures(null)}
        planId={viewingPlanFeatures?.id}
        planName={viewingPlanFeatures?.name}
      />

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500">
        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
              <FiPackage size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-[0.2em]">
                Subscription Plans
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                Manage service tiers & domain mapping
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase">
            <FiActivity className="text-emerald-500 animate-pulse" />
            {plans.length} Total Plans
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50 dark:border-slate-800">
                <th className="px-10 py-6 text-left">Plan Details</th>
                <th className="px-10 py-6 text-left">Pricing</th>
                <th className="px-10 py-6 text-center">Connected Domain</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Matrix...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <React.Fragment key={plan.id}>
                    <tr
                      className={`group transition-all duration-300 cursor-pointer ${expandedPlanId === plan.id ? "bg-emerald-50/30 dark:bg-emerald-500/5" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                        }`}
                      onClick={() => toggleExpand(plan.id)}
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className={`transition-transform duration-300 ${expandedPlanId === plan.id ? "rotate-90 text-emerald-500" : "text-slate-300"}`}>
                            <FiChevronRight size={20} />
                          </div>
                          <div>
                            <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm group-hover:text-emerald-600 transition-colors">
                              {plan.name}
                            </div>
                            <div className="text-[9px] font-mono text-slate-400 mt-1">ID: {plan.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-10 py-7">
                        <div className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm shadow-lg shadow-slate-200 dark:shadow-none">
                          ₹{plan.price}
                        </div>
                      </td>

                      <td className="px-10 py-7 text-center">
                        {plan.assignedDomain ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase border border-emerald-200 dark:border-emerald-800">
                            <FiGlobe />
                            {plan.assignedDomain}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => openDomainSelector(plan, e)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-200 dark:border-blue-900 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
                          >
                            <FiPlus />
                            Link Domain
                          </button>
                        )}
                      </td>

                      <td className="px-10 py-7 text-right">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPlanFeatures(plan);
                          }}
                          className="mr-2 p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 transition-all active:scale-90"
                          title="View Features"
                        >
                          <FiCpu size={18} />
                        </button>


                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(plan);
                          }}
                          className="p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 transition-all active:scale-90"
                        >
                          <FiEdit3 size={18} />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS */}
                    {expandedPlanId === plan.id && (
                      <tr className="bg-slate-50/50 dark:bg-slate-900/50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <td colSpan="4" className="px-20 py-10">
                          <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <FiLayers /> Plan Metadata
                              </h4>
                              <div className="flex items-center gap-6">
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  <span className="block text-[9px] text-slate-400 uppercase mb-1">Created At</span>
                                  {new Date(plan.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  <span className="block text-[9px] text-slate-400 uppercase mb-1">Status</span>
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[9px]">Active</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                              <p className="text-xs text-slate-500 leading-relaxed italic">
                                "This plan includes full access to all system-wide features currently mapped to the assigned domain."
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOMAIN ASSIGNMENT MODAL - GLASSMORPHISM */}
      {assigningDomainPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/20">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase text-lg tracking-tighter">
                  Link Domain
                </h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1">
                  Target: {assigningDomainPlan.name}
                </p>
              </div>
              <button
                onClick={() => setAssigningDomainPlan(null)}
                className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all active:scale-75"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleDomainAssign} className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Available Domains</label>
                <div className="relative group">
                  <FiGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <select
                    value={selectedDomainId}
                    onChange={(e) => setSelectedDomainId(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 dark:text-white transition-all appearance-none"
                  >
                    <option value="">Choose a domain...</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.domain_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                  <FiLayers className="inline mr-2 mb-1" />
                  Connecting a domain will automatically sync all features associated with that domain to users under this plan.
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedDomainId || isAssigning || domainsLoading}
                className="w-full py-5 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50 shadow-2xl shadow-emerald-200 dark:shadow-none"
              >
                {isAssigning ? "Syncing..." : "Establish Connection"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}