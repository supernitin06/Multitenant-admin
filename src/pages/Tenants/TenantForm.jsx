import { useState, useEffect } from "react";
import { PhotoIcon, GlobeAltIcon, FingerPrintIcon } from "@heroicons/react/24/outline";
import { useCreateTenantMutation } from "../../api/tenants/tenant.api";
import toast from "react-hot-toast";

export default function TenantForm({ initialData, onSuccess }) {
  // API Mutation
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();

  // 1. Exact JSON Structure for State
  const defaultState = {
    tenantName: "",
    tenantType: "SCHOOL",
    tenantPassword: "",
    tenantUsername: "",
    tenantEmail: "",
    tenantPhone: "",
    tenantAddress: "",
    tenantWebsite: "",
    logoUrl: "",
    faviconUrl: "",
    themeColor: "#1E40AF",
    isActive: true,
    role: "", // Default empty string as per your JSON
    subscription_planId: ""
  };

  const [formData, setFormData] = useState(defaultState);

  // 2. Populate form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultState, ...initialData });
    } else {
      setFormData(defaultState);
    }
  }, [initialData]);

  // 3. Handle Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createTenant(formData).unwrap();
      toast.success("Tenant created successfully!");

      // Reset form for new creation
      setFormData(defaultState);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create tenant");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* --- Section 1: Identity --- */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FingerPrintIcon className="w-4 h-4" /> Identity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tenant Name <span className="text-red-500">*</span></label>
            <input
              required
              name="tenantName"
              value={formData.tenantName}
              onChange={handleChange}
              placeholder="e.g. Green Valley School"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Type</label>
            <select
              name="tenantType"
              value={formData.tenantType}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="SCHOOL">SCHOOL</option>
              <option value="UNIVERSITY">UNIVERSITY</option>
              <option value="ORGANIZATION">ORGANIZATION</option>
              <option value="COMPANY">COMPANY</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Section 2: Credentials (Username/Password) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Username <span className="text-red-500">*</span></label>
          <input
            required
            name="tenantUsername"
            value={formData.tenantUsername}
            onChange={handleChange}
            placeholder="admin_user"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password <span className="text-red-500">*</span></label>
          <input
            required={!initialData} // Required only on creation
            type="text" // Visible text as per your JSON request
            name="tenantPassword"
            value={formData.tenantPassword}
            onChange={handleChange}
            placeholder={initialData ? "Leave blank to keep current" : "Set password"}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* --- Section 3: Contact Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email</label>
          <input
            type="email"
            name="tenantEmail"
            value={formData.tenantEmail}
            onChange={handleChange}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
          <input
            name="tenantPhone"
            value={formData.tenantPhone}
            onChange={handleChange}
            placeholder="+91-..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Address</label>
        <textarea
          name="tenantAddress"
          rows="2"
          value={formData.tenantAddress}
          onChange={handleChange}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
        />
      </div>


      {/* --- Section 4: Branding & Web --- */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <GlobeAltIcon className="w-4 h-4" /> Branding
        </h4>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Website URL</label>
          <input
            name="tenantWebsite"
            value={formData.tenantWebsite}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Logo URL</label>
            <input
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Favicon URL</label>
            <input
              name="faviconUrl"
              value={formData.faviconUrl}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">Theme Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="themeColor"
              value={formData.themeColor}
              onChange={handleChange}
              className="h-10 w-12 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              name="themeColor"
              value={formData.themeColor}
              onChange={handleChange}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm uppercase font-mono"
            />
          </div>
        </div>
      </div>

      {/* --- Section 5: Config --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Plan ID</label>
          <input
            name="subscription_planId"
            value={formData.subscription_planId}
            onChange={handleChange}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Hidden Role Field (Since you had role:"" in JSON, we keep it in state but can hide input or leave as default) */}
        <input type="hidden" name="role" value={formData.role} />

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300 transition-all"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
              Is Active Tenant
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
        <button
          type="submit"
          disabled={isCreating}
          className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            initialData ? "Update Tenant" : "Create Tenant"
          )}
        </button>
      </div>
    </form>
  );
}