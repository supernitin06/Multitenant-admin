import React, { useState } from "react";
import { FiGrid, FiList, FiSettings, FiUsers, FiPackage, FiGlobe } from "react-icons/fi";

const TAB_VARIANTS = {
  DEFAULT: "border-b border-slate-200 dark:border-slate-700",
  PILLS: "bg-slate-100 dark:bg-slate-800 rounded-xl p-1",
  UNDERLINE: "border-b-2 border-transparent"
};

const TAB_STYLES = {
  DEFAULT: {
    active: "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10",
    inactive: "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
  },
  PILLS: {
    active: "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm",
    inactive: "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
  },
  UNDERLINE: {
    active: "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400",
    inactive: "border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
  }
};

const TAB_ICONS = {
  grid: <FiGrid size={14} />,
  list: <FiList size={14} />,
  settings: <FiSettings size={14} />,
  users: <FiUsers size={14} />,
  plans: <FiPackage size={14} />,
  domains: <FiGlobe size={14} />
};

export default function GenericTabs({
  tabs,
  variant = "DEFAULT",
  activeTab,
  onTabChange,
  className = "",
  size = "MD"
}) {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab || tabs[0]?.key);
  
  const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;
  const handleTabChange = (key) => {
    if (onTabChange) {
      onTabChange(key);
    } else {
      setInternalActiveTab(key);
    }
  };

  const sizeClasses = {
    SM: "px-3 py-2 text-xs",
    MD: "px-4 py-3 text-sm",
    LG: "px-6 py-4 text-base"
  };

  const variantClasses = TAB_VARIANTS[variant] || TAB_VARIANTS.DEFAULT;
  const styles = TAB_STYLES[variant] || TAB_STYLES.DEFAULT;

  return (
    <div className={`${variantClasses} ${className}`}>
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const isActive = currentActiveTab === tab.key;
          const icon = typeof tab.icon === "string" ? TAB_ICONS[tab.icon] : tab.icon;
          
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`
                ${sizeClasses[size] || sizeClasses.MD}
                font-medium transition-all duration-200
                flex items-center gap-2
                ${isActive ? styles.active : styles.inactive}
                ${variant === "PILLS" ? "rounded-lg" : ""}
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              disabled={tab.disabled}
            >
              {icon && <span>{icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  isActive 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => {
          if (currentActiveTab === tab.key && tab.content) {
            return (
              <div key={`content-${tab.key}`}>
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// Pre-configured tab sets
export const ManagementTabs = ({ activeTab, onTabChange, children }) => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'grid' },
    { key: 'tenants', label: 'Tenants', icon: 'users', badge: children?.tenants?.length },
    { key: 'plans', label: 'Plans', icon: 'plans' },
    { key: 'domains', label: 'Domains', icon: 'domains' },
    { key: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <GenericTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="DEFAULT"
    />
  );
};

export const ViewToggleTabs = ({ view, onViewChange, className = "" }) => {
  const tabs = [
    { key: 'grid', label: 'Grid View', icon: 'grid' },
    { key: 'list', label: 'List View', icon: 'list' }
  ];

  return (
    <GenericTabs
      tabs={tabs}
      activeTab={view}
      onTabChange={onViewChange}
      variant="PILLS"
      className={className}
      size="SM"
    />
  );
};
