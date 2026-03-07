import { FiEdit3, FiTrash2, FiRefreshCw, FiLayers,FiEye, FiPlus, FiPackage, FiGlobe, FiUsers, FiClock, FiCalendar, FiGrid, FiActivity } from "react-icons/fi";

// Tenants Table Configuration
export const tenantsTableConfig = {
  title: "Tenant Management",
  headerIcon: <FiUsers className="text-amber-500" />,
  loadingText: "FETCHING TENANTS...",
  columns: [
    {
      key: "expandable",
      label: "Tenant Details",
      type: "expandable",
      render: (item) => (
        <div>
          <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {item.tenantName}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1">
            ID: {item.id}
          </div>
        </div>
      )
    },
    {
      key: "tenantType",
      label: "Type",
      type: "custom",
      render: (item) => (
        <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-blue-100 text-blue-700">
          {item.tenantType}
        </span>
      )
    },
    {
      key: "tenantEmail",
      label: "Email",
      type: "text"
    },
    {
      key: "isActive",
      label: "Status",
      type: "status",
      activeText: "Active",
      inactiveText: "Disabled"
    },
    {
      key: "createdAt",
      label: "Created",
      type: "custom",
      render: (item) => (
        <div className="text-[10px] text-slate-400 font-mono">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ],
  actions: [
    { type: "edit", handler: "onEdit" },
    { type: "delete", handler: "onDelete" },
    { type: "custom", icon: <FiRefreshCw size={14} />, handler: "onRefresh" }
  ],
  expandedContent: (item) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <FiGrid className="text-emerald-500" /> Tenant Information
        </h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400">Username:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{item.tenantUsername}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400">Phone:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{item.tenantPhone || "N/A"}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400">Website:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{item.tenantWebsite || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FiCalendar className="text-emerald-500" /> System Timestamps
        </h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between text-[10px] mb-2">
            <span className="font-bold text-slate-400">Created At:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400">Last Updated:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

// Plans Table Configuration
export const plansTableConfig = {
  title: "All Plans",
  headerIcon: <FiPackage className="text-emerald-500" />,
  loadingText: "FETCHING PLANS...",
  columns: [
    {
      key: "expandable",
      label: "Plan Name",
      type: "expandable",
      render: (item) => (
        <div>
          <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {item.name}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1">
            ID: {item.id}
          </div>
        </div>
      )
    },
    {
      key: "price",
      label: "Duration & $",
      type: "custom",
      render: (item) => (
        <div>
          <div className="font-black text-slate-700 dark:text-slate-200 text-sm">₹{item.price}</div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <FiClock size={10} className="text-emerald-500" /> {item.duration} Days
          </div>
        </div>
      )
    },
    {
      key: "isActive",
      label: "Status",
      type: "status",
      activeText: "Active",
      inactiveText: "Disabled"
    },
    {
      key: "assignedTo",
      label: "Add Domain",
      type: "custom",
      render: (item, value) => (
        <div className="text-[10px] font-bold text-slate-400">
          {value ? value : (
            <button 
              onClick={(e) => item.onAssignDomain && item.onAssignDomain(item, e)}
              className="text-amber-500 hover:text-amber-600 cursor-pointer bg-blue-200 px-2 py-1 rounded-md"
            >
              Add domain
            </button>
          )}
        </div>
      )
    }
  ],
  actions: [
    { type: "custom", icon: <FiRefreshCw size={14} />, handler: "onSync" },
    { type: "custom", icon: <FiLayers size={14} />, handler: "onManageFeatures" },
    { type: "edit", handler: "onEdit" }
  ],
  expandedContent: (item) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <FiGrid className="text-emerald-500" /> Active Features ({item.features?.length || 0})
        </h4>
        <div className="flex flex-wrap gap-2">
          {item.features?.map((f) => (
            <div key={f.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${f.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{f.feature_name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FiCalendar className="text-emerald-500" /> System Timestamps
        </h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between text-[10px] mb-2">
            <span className="font-bold text-slate-400">Created At:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400">Last Updated:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

// Domains Table Configuration
export const domainsTableConfig = {
  title: "Domain Registry",
  headerIcon: <FiGlobe className="text-blue-500" />,
  loadingText: "FETCHING DOMAINS...",
  columns: [
    {
      key: "expandable",
      label: "Domain Details",
      type: "expandable",
      render: (item) => (
        <div>
          <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {item.domain_name}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1">
            ID: {item.id}
          </div>
        </div>
      )
    },
    {
      key: "price",
      label: "Pricing",
      type: "custom",
      render: (item) => (
        <div className="flex items-center gap-1 font-black text-slate-700 dark:text-slate-200 text-sm">
          ₹{item.price}
        </div>
      )
    },
    {
      key: "description",
      label: "Description",
      type: "custom",
      render: (item) => (
        <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
          {item.description || "N/A"}
        </p>
      )
    },
    {
      key: "assignFeatures",
      label: "Assign Features",
      type: "custom",
      render: (item) => (
        <button 
          onClick={(e) => item.onAssignFeatures && item.onAssignFeatures(item, e)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-100 dark:shadow-none"
        >
          <FiPlus size={14} /> Assign
        </button>
      )
    }
  ],
  actions: [
    { type: "custom", icon: <FiLayers size={16} />, handler: "onViewFeatures" },
    { type: "edit", handler: "onEdit" },
    { type: "delete", handler: "onDelete" }
  ]
};

// Features Table Configuration
export const featuresTableConfig = {
  title: "Feature Management",
  headerIcon: <FiGrid className="text-purple-500" />,
  loadingText: "FETCHING FEATURES...",
  columns: [
    {
      key: "feature_name",
      label: "Feature Name",
      type: "expandable",
      render: (item) => (
        <div>
          <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {item.feature_name}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1">
            Code: {item.feature_code}
          </div>
        </div>
      )
    },
    {
      key: "feature_code",
      label: "Code",
      type: "text"
    },
    {
      key: "description",
      label: "Description",
      type: "custom",
      render: (item) => (
        <p className="text-xs text-slate-500 line-clamp-2 max-w-[300px]">
          {item.description || "No description"}
        </p>
      )
    },
    {
      key: "isActive",
      label: "Status",
      type: "status",
      activeText: "Active",
      inactiveText: "Disabled"
    }
  ],
  actions: [
    { type: "edit", handler: "onEdit" },
    { type: "delete", handler: "onDelete" }
  ],
  expandedContent: (item) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Feature Details</h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{item.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-[10px]">
              <span className="font-bold text-slate-400">Created:</span>
              <div className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-[10px]">
              <span className="font-bold text-slate-400">Updated:</span>
              <div className="font-mono text-slate-600 dark:text-slate-300">{new Date(item.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Usage Statistics</h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-500 mb-2">{item.usageCount || 0}</div>
            <div className="text-[10px] text-slate-400">Domains Using This Feature</div>
          </div>
        </div>
      </div>
    </div>
  )
};

// Add to s:\S_Admin\src\config\tableConfigs.jsx
export const tenantActivitiesTableConfig = {
  title: "Tenant Activities",
  headerIcon: <FiActivity className="text-amber-500" />,
  columns: [
    {
      key: "activity",
      label: "Activity",
      type: "expandable",
      render: (item) => (
        <div>
          <div className="font-black text-slate-800 dark:text-white">
            {item.action}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">
            {item.timestamp}
          </div>
        </div>
      )
    },
    {
      key: "user",
      label: "User",
      type: "text"
    },
    {
      key: "ipAddress",
      label: "IP Address",
      type: "text"
    },
    {
      key: "status",
      label: "Status",  
      type: "status",
      activeText: "Success",
      inactiveText: "Failed"
    }
  ],
  actions: [
    { type: "custom", icon: <FiEye size={14} />, handler: "onViewDetails" }
  ]
};

