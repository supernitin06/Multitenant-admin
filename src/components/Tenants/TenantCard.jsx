import React from "react";

import {
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiLayers,
  FiLoader,
  FiCircle,
} from "react-icons/fi";

const TenantCard = ({ tenant, toast, isExpanded, onToggle }) => {
  const tenantId = tenant?.id || tenant?._id;

  const { data, isLoading, isFetching } = useGetModulesByTenantQuery(tenantId, {
    skip: !isExpanded,
  });

  //const [removeModule, { isLoading: isRemoving }] =
  //  useUpdateTenantModuleStatusMutation();
  const modules = data?.modules || (Array.isArray(data) ? data : []);

  const handleRemoveModule = async (module, e) => {
    e.stopPropagation();
    const moduleId = module.id || module._id || module.key;
    const currentStatus = module.enabled;

    try {
      await removeModule({
        tenantId,
        moduleId,
        enabled: !currentStatus,
      }).unwrap();

      toast.success?.(
        currentStatus ? "Module deactivated" : "Module activated"
      );
    } catch (err) {
      toast.error?.("Failed to update module status");
    }
  };

  return (
    <div
      className={`mb-3 transition-all duration-300 bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden ${
        isExpanded
          ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
          : "border-slate-200 dark:border-slate-800 shadow-sm"
      }`}
    >
      {/* HEADER: Updated to Emerald Theme */}
      <div
        onClick={onToggle}
        className="px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          {/* Avatar with Emerald Gradient */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-base font-black shadow-lg shadow-emerald-200 dark:shadow-none shrink-0">
            {tenant?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="overflow-hidden">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {tenant?.name || "Unknown Tenant"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">
                <FiMail className="shrink-0 text-emerald-500" size={10} />{" "}
                {tenant?.email || "N/A"}
              </span>
              <span className="text-[9px] sm:text-[10px] flex items-center gap-1 text-emerald-500 font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                <FiCircle
                  size={6}
                  fill="currentColor"
                  className="animate-pulse"
                />{" "}
                LIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:block text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Hash ID
            </p>
            <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500">
              {tenantId?.slice(-6).toUpperCase()}
            </p>
          </div>
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              isExpanded ? "bg-emerald-100 text-emerald-600" : "text-slate-400"
            }`}
          >
            {isExpanded ? (
              <FiChevronUp size={20} />
            ) : (
              <FiChevronDown size={20} />
            )}
          </div>
        </div>
      </div>

      {/* BODY: Emerald Accents */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiLayers className="text-emerald-500" size={14} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                System Features ({modules.length})
              </h4>
            </div>
            {isFetching && (
              <FiLoader className="animate-spin text-emerald-500" size={12} />
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-6 justify-center">
              <FiLoader className="animate-spin text-emerald-500" size={18} />
              <span className="text-xs font-semibold text-slate-400 tracking-wide">
                Fetching Modules...
              </span>
            </div>
          ) : modules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {modules.map((module) => (
                <div
                  key={module.id || module._id || module.key}
                  className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      module.enabled 
                        ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" 
                        : "bg-slate-300"
                    }`} />
                    <div className="overflow-hidden">
                      <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200 truncate">
                        {module.name || module.key}
                      </p>
                      <p className="text-[9px] font-mono text-emerald-500/70 uppercase leading-none mt-0.5">
                        {module.key}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!module.enabled}
                        disabled={isRemoving}
                        onChange={(e) => handleRemoveModule(module, e)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer 
                        peer-checked:bg-emerald-500 transition-all duration-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:after:translate-x-full"
                      ></div>
                    </label>
                    <span
                      className={`text-[9px] font-black uppercase tracking-tighter ${
                        module.enabled ? "text-emerald-500" : "text-gray-400"
                      }`}
                    >
                      {module.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                No active modules found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantCard;