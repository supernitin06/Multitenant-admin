import React, { useMemo, useState } from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import GenericHeader from "../../components/Common/GenericHeader";
import { useGetAuditLogsQuery } from "../../api/Common/auditLogs.api";

const ACTOR_LABELS = {
  SUPER_ADMIN: "Super Admin",
  PLATFORM_MANAGEMENT: "Platform Staff",
  TENANT_USER: "Tenant",
  TENANT_STAFF: "Tenant Staff",
};

const formatAction = (action = "") =>
  action.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const AuditLogs = () => {
  const { data, isLoading, isFetching, error, refetch } = useGetAuditLogsQuery();
  const [search, setSearch] = useState("");

  const logs = useMemo(() => {
    const all = data?.logs || [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((l) =>
      [l.action, l.entity, l.actorType, l.entityId].some((v) => v?.toLowerCase().includes(q))
    );
  }, [data, search]);

  return (
    <div className="p-6 min-h-screen">
      <GenericHeader
        title="Audit Logs"
        subtitle="The latest 100 actions performed on the platform"
        icon={<FiActivity className="text-emerald-400" />}
        actions={[
          <button
            key="refresh"
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#00e676] border border-[rgba(0,230,118,0.3)] hover:bg-[rgba(0,230,118,0.08)]"
          >
            <FiRefreshCw className={isFetching ? "animate-spin" : ""} /> Refresh
          </button>,
        ]}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by action, entity or actor…"
        className="w-full md:w-96 mb-4 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
        style={{ background: "#0d1523", border: "1px solid #1a2a40" }}
      />

      <div className="rounded-2xl overflow-x-auto" style={{ background: "#0d1523", border: "1px solid #1a2a40" }}>
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#557a9a]" style={{ borderBottom: "1px solid #1a2a40" }}>
              <th className="px-5 py-4">When</th>
              <th className="px-5 py-4">Action</th>
              <th className="px-5 py-4">Entity</th>
              <th className="px-5 py-4">Performed by</th>
              <th className="px-5 py-4">IP address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[#557a9a]">Loading audit logs…</td></tr>
            )}
            {error && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-red-400">{error?.data?.message || "Could not load audit logs"}</td></tr>
            )}
            {!isLoading && !error && logs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[#557a9a]">No activity recorded yet</td></tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid rgba(26,42,64,0.5)" }}>
                <td className="px-5 py-3 text-[#8bafc7] whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3 text-white font-semibold">{formatAction(log.action)}</td>
                <td className="px-5 py-3 text-[#8bafc7]">
                  {log.entity}
                  {log.entityId && <span className="block text-[10px] font-mono text-[#2a4060]">{log.entityId}</span>}
                </td>
                <td className="px-5 py-3 text-[#8bafc7]">{ACTOR_LABELS[log.actorType] || log.actorType}</td>
                <td className="px-5 py-3 font-mono text-[#557a9a]">{log.ipAddress || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
