import { useState } from "react";
import { FiEdit3, FiCalendar, FiSearch, FiFilter, FiCheck } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useGetPlansQuery, useAddPlanToTenantMutation } from "../../api/plans.api";

export default function TenantTable({ tenants = [], onToggle, onEdit, submitting = false, onReload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlans, setSelectedPlans] = useState({});

  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const plans = plansData?.plans || [];

  const [addPlanToTenant, { isLoading: assignLoading }] = useAddPlanToTenantMutation();

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = (tenant.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? tenant.isActive
        : !tenant.isActive;
    return matchesSearch && matchesStatus;
  });

  const handlePlanChange = (tenantId, planId) => {
    setSelectedPlans((prev) => ({ ...prev, [tenantId]: planId }));
  };

  const handleAssignPlan = async (tenantId) => {
    const planId = selectedPlans[tenantId];
    if (!planId) return toast.error("Please select a plan to assign");

    try {
      await addPlanToTenant({ tenantId, planId }).unwrap();
      toast.success("Plan assigned successfully!");
      if (onReload) onReload();
    } catch (error) {
      console.error("Assign Plan Error:", error);
      toast.error("Failed to assign plan.");
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "-";

  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No tenants found</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Toaster position="top-right" />

      {/* --- SEARCH & FILTER SECTION (Green Accents) --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm shadow-sm"
          />
        </div>

        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dark:text-white pl-11 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none cursor-pointer text-sm font-semibold min-w-[160px] shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/10">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-emerald-50/30 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Organization</th>
              <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subscription & Plan</th>
              <th className="px-8 py-5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id} className="group hover:bg-emerald-50/20 dark:hover:bg-emerald-900/5 transition-colors">
                {/* Organization Details */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center text-white font-bold text-lg">
                      {tenant.name ? tenant.name.charAt(0) : "?"}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-gray-800 dark:text-gray-100">{tenant.name || "Unnamed Tenant"}</div>
                      <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-0.5">{tenant.type || "N/A"}</div>
                    </div>
                  </div>
                </td>

                {/* Plan Management */}
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        {tenant.plan || "No Active Plan"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        className="text-xs dark:text-white font-semibold p-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none w-40 transition-all"
                        value={selectedPlans[tenant.id] || ""}
                        onChange={(e) => handlePlanChange(tenant.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="" className="dark:text-white" disabled>Upgrade/Change</option>
                        {plans.map((p) => (
                          <option className="dark:text-white" key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignPlan(tenant.id)}
                        disabled={!selectedPlans[tenant.id] || assignLoading}
                        className={`p-2 rounded-xl transition-all shadow-sm ${
                          selectedPlans[tenant.id] 
                          ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110 active:scale-95" 
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {assignLoading ? <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <FiCheck size={18} strokeWidth={3} />}
                      </button>
                    </div>

                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                      <FiCalendar className="text-emerald-300" /> Expiry: {formatDate(tenant.expiresAt)}
                    </span>
                  </div>
                </td>

                {/* Status Toggle */}
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!tenant.isActive}
                        disabled={submitting}
                        onChange={() => onToggle(tenant.id, !tenant.isActive)}
                      />
                      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6"></div>
                    </label>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${tenant.isActive ? "text-emerald-500" : "text-gray-400"}`}>
                      {tenant.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => onEdit(tenant)}
                    className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-2xl transition-all"
                    title="Edit Details"
                  >
                    <FiEdit3 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden space-y-4">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {tenant.name ? tenant.name.charAt(0) : "?"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">{tenant.name || "Unnamed"}</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{tenant.type || "N/A"}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!tenant.isActive}
                  onChange={() => onToggle(tenant.id, !tenant.isActive)}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="space-y-4 pt-5 border-t border-gray-50 dark:border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Plan:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{tenant.plan || "Standard"}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 dark:text-white text-xs font-bold p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                  value={selectedPlans[tenant.id] || ""}
                  onChange={(e) => handlePlanChange(tenant.id, e.target.value)}
                >
                  <option value="" disabled>Change Plan</option>
                  {plans.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignPlan(tenant.id)}
                  className="px-5 py-3 bg-emerald-600 text-white text-[11px] font-black rounded-xl active:scale-95 transition-all"
                >
                  SAVE
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5">
                  <FiCalendar className="text-emerald-400" /> {formatDate(tenant.expiresAt)}
                </span>
                <button
                  onClick={() => onEdit(tenant)}
                  className="text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl dark:bg-emerald-900/30"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}