import React from "react";
import { useParams } from "react-router-dom";
import {
  GenericHeader,
  GenericTable,
  tenantActivitiesTableConfig
} from "../Common";
import {
  useGetTenantDetailsQuery,
} from "../../api/tenants/tenantDetails.api";

// StatCard Component
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{title}</h3>
    <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default function TenantDetailsPage() {
  const { tenantId } = useParams();

  // API Hooks
  const { data: tenantDetails, isLoading } = useGetTenantDetailsQuery(tenantId);

  const handleViewActivity = (activity) => {
    console.log("View activity details:", activity);
  };

  return (
    <div className="p-8">
      {/* Tenant Header */}
      <GenericHeader
        title={tenantDetails?.tenantName || "Tenant Details"}
        subtitle="Tenant Details & Activities"
        icon="tenants"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={tenantDetails?.totalUsers || 0} />
        <StatCard title="Active Sessions" value={tenantDetails?.activeSessions || 0} />
        <StatCard title="Storage Used" value={`${tenantDetails?.storageUsed || 0}GB`} />
        <StatCard title="API Calls" value={tenantDetails?.apiCalls || 0} />
      </div>

      {/* Activities Table */}
      <GenericTable
        config={tenantActivitiesTableConfig}
        data={tenantDetails?.activities || []}
        loading={isLoading}
        handlers={{
          onViewDetails: handleViewActivity
        }}
      />
    </div>
  );
}