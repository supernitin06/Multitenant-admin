import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiLayers, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import GenericHeader from "../../components/Common/GenericHeader";
import { useAuth } from "../../context/AuthContext";
import {
  useGetTenantPermissionGroupsQuery,
  useCreateTenantPermissionMutation,
  useDeleteTenantPermissionMutation,
} from "../../api/platform/tenantPermission.api";

/**
 * Tenant Permission Catalog
 * The list of permissions that every tenant can hand out to its own roles
 * (e.g. PRINCIPAL, TEACHER). Tenants cannot invent permissions — they pick
 * from this catalog in their own "Roles & Permissions" screen.
 */
const TenantPermissions = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission("MANAGE_TENANT_PERMISSION_CATALOG");

  const { data, isLoading, error } = useGetTenantPermissionGroupsQuery();
  const [createPermission, { isLoading: isCreating }] = useCreateTenantPermissionMutation();
  const [deletePermission] = useDeleteTenantPermissionMutation();

  const groups = data?.groups || [];
  const [form, setForm] = useState(null); // { key, name, domainId }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createPermission({
        key: form.key,
        name: form.name,
        domainIds: form.domainId ? [form.domainId] : [],
      }).unwrap();
      toast.success("Permission added to the catalog");
      setForm(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create permission");
    }
  };

  const handleDelete = async (permission) => {
    if (!window.confirm(`Remove "${permission.key}" from the catalog? Every tenant role that has it will lose it.`)) return;
    try {
      await deletePermission(permission.id).unwrap();
      toast.success("Permission removed");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete permission");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <GenericHeader
        title="Tenant Permission Catalog"
        subtitle="Permissions that tenants can give to their own roles (Principal, Teacher, …)"
        icon={<FiLayers className="text-emerald-400" />}
        actions={canManage ? [
          <button
            key="add"
            onClick={() => setForm({ key: "", name: "", domainId: groups.find((g) => g.domainId)?.domainId || "" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#00e676] hover:opacity-90"
          >
            <FiPlus /> Add permission
          </button>,
        ] : []}
      />

      {isLoading && <p className="text-[#557a9a] text-sm">Loading catalog…</p>}
      {error && <p className="text-red-400 text-sm">{error?.data?.message || "Could not load the catalog"}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <section key={group.label} className="rounded-2xl p-5" style={{ background: "#0d1523", border: "1px solid #1a2a40" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{group.label}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-[#00e676] bg-[rgba(0,230,118,0.1)]">
                {group.permissions.length}
              </span>
            </div>
            <ul className="space-y-2">
              {group.permissions.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 group">
                  <div>
                    <p className="text-[12px] text-[#c8dbe9]">{p.name}</p>
                    <p className="text-[10px] font-mono text-[#2a4060]">{p.key}</p>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => handleDelete(p)}
                      title="Remove from catalog"
                      className="opacity-0 group-hover:opacity-100 text-[#557a9a] hover:text-red-400 transition"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "#0d1523", border: "1px solid #1a2a40" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Add tenant permission</h3>
              <button type="button" onClick={() => setForm(null)} className="text-[#557a9a] hover:text-white"><FiX /></button>
            </div>
            <label className="block text-[11px] text-[#557a9a] font-bold uppercase tracking-wider">
              Key
              <input required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="e.g. COLLECT_FEES"
                className="mt-1 w-full px-3 py-2.5 rounded-xl text-sm text-white font-mono outline-none bg-[#080d14] border border-[#1a2a40]" />
            </label>
            <label className="block text-[11px] text-[#557a9a] font-bold uppercase tracking-wider">
              Label shown to tenants
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Collect fees"
                className="mt-1 w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none bg-[#080d14] border border-[#1a2a40]" />
            </label>
            <label className="block text-[11px] text-[#557a9a] font-bold uppercase tracking-wider">
              Group
              <select value={form.domainId} onChange={(e) => setForm({ ...form, domainId: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none bg-[#080d14] border border-[#1a2a40]">
                {groups.filter((g) => g.domainId).map((g) => (
                  <option key={g.domainId} value={g.domainId}>{g.label}</option>
                ))}
              </select>
            </label>
            <p className="text-[11px] text-[#557a9a]">
              A new permission only takes effect once a backend route checks it with <code className="text-[#00e676]">requireTenantPermission</code>.
            </p>
            <button disabled={isCreating} className="w-full py-2.5 rounded-xl text-sm font-bold text-black bg-[#00e676] disabled:opacity-60">
              {isCreating ? "Saving…" : "Add permission"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TenantPermissions;
