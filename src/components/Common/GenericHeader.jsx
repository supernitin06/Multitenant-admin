import React from "react";
import { FiPackage, FiGlobe, FiUsers, FiSettings, FiTrendingUp, FiDatabase, FiUserPlus } from "react-icons/fi";

const HEADER_ICONS = {
  plans: <FiPackage className="text-emerald-500" />,
  domains: <FiGlobe className="text-blue-500" />,
  tenants: <FiUsers className="text-amber-500" />,
  features: <FiSettings className="text-purple-500" />,
  analytics: <FiTrendingUp className="text-red-500" />,
  database: <FiDatabase className="text-indigo-500" />,
  roles: <FiUserPlus className="w-8 h-8 text-emerald-600" />,
  permissions: <FiUserPlus className="w-8 h-8 text-emerald-600" />
};

export default function GenericHeader({
  title,
  subtitle,
  icon,
  actions = [],
  breadcrumbs = [],
  className = ""
}) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return HEADER_ICONS[icon] || icon;
    }
    return icon;
  };

  return (
    <div
      className={`px-6 py-5 mb-8 rounded-2xl flex justify-between items-center ${className}`}
      style={{
        background: "linear-gradient(135deg, #0d1523, #0a1220)",
        border: "1px solid #1a2a40",
      }}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)" }}
            >
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-[#557a9a] mt-0.5 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] text-[#557a9a]">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-[#2a4060]">/</span>}
                <span className={crumb.active ? "text-[#00e676] font-bold" : ""}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// Pre-configured headers
export const PlansHeader = ({ actions = [] }) => (
  <GenericHeader
    title="All Plans"
    icon="plans"
    actions={actions}
  />
);

export const DomainsHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Domain Registry"
    subtitle="Manage your domains"
    icon="domains"
    actions={actions}
  />
);

export const TenantsHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Tenant Management"
    subtitle="Manage all tenants"
    icon="tenants"
    actions={actions}
  />
);

export const FeaturesHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Feature Management"
    icon="features"
    actions={actions}
  />
);


export const RolesHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Role Management"
    icon="roles"
    subtitle="Manage all roles"
    actions={actions}
  />
);

export const PermissionsHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Permission Management"
    icon="permissions"
    subtitle="Manage all permissions"
    actions={actions}
  />
);


export const DomainPermissionsHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Permission Domain Management"
    icon="permissions"
    subtitle="Manage all domain permissions"
    actions={actions}
  />
);



export const RoleBaseAccessControl = ({ actions = [] }) => (
  <GenericHeader
    title="Role Based Access Control"
    icon="permissions"
    subtitle="Manage all role-based access control"
    actions={actions}
  />
);

export const StaffHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Staff Management"
    icon="permissions"
    subtitle="Manage all staff"
    actions={actions}
  />
);

export const SidebarHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Sidebar Management"
    icon="permissions"
    subtitle="Manage all sidebars"
    actions={actions}
  />
);

export const AssignSidebarHeader = ({ actions = [] }) => (
  <GenericHeader
    title="Assign Sidebar"
    icon="permissions"
    subtitle="Manage all sidebar assignments"
    actions={actions}
  />
);







