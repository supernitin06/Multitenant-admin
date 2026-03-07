import { FiShield, FiCheck, FiZap } from "react-icons/fi";
import { GenericButton } from "../Common";

export default function PlanForm({
  formData,
  setFormData,
  onSubmit,
  submitting,
  isEditing,
  onCancel,
  modules = [],
}) {

  const handleToggle = (moduleKey) => {
    const current = formData.moduleKeys || [];
    const updated = current.includes(moduleKey)
      ? current.filter((m) => m !== moduleKey)
      : [...current, moduleKey];

    setFormData({ ...formData, moduleKeys: updated });
  };

  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <div
              className={`p-2 rounded-xl text-white shadow-lg ${isEditing
                  ? "bg-amber-500 shadow-amber-200"
                  : "bg-emerald-500 shadow-emerald-200"
                } dark:shadow-none`}
            >
              <FiShield size={18} />
            </div>
            {isEditing ? "Update Plan" : "Create Plan"}
          </h2>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[10px] font-black text-red-500 underline uppercase tracking-widest hover:text-red-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-6">

          {/* PLAN IDENTIFIER */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Plan Identifier
            </label>
            <input
              required
              disabled={isEditing}
              placeholder="e.g. BASIC"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full p-4 rounded-2xl border-none outline-none font-bold uppercase transition-all
                ${isEditing
                  ? "bg-slate-50 dark:bg-slate-900/50 text-slate-400 cursor-not-allowed ring-1 ring-slate-200 dark:ring-slate-700"
                  : "bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-900"
                }`}
            />

            {isEditing && (
              <p className="text-[9px] text-amber-500 mt-2 ml-1 font-bold italic">
                * Identifier is locked after creation.
              </p>
            )}
          </div>

          {/* PRICE & VALIDITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Price
              </label>
              <input
                required
                type="number"
                placeholder="199900"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 ring-emerald-500/20 font-black dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Validity (Days)
              </label>
              <input
                required
                type="number"
                placeholder="30"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value),
                  })
                }
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 ring-emerald-500/20 font-black dark:text-white"
              />
            </div>
          </div>

          {/* MODULES (ONLY CREATE MODE) */}
          {!isEditing && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">
                Common Modules
              </label>

              <div className="flex flex-wrap gap-2">
                {modules
                  .filter((mod) => mod.isCommon === true)
                  .map((mod) => {
                    const isActive = formData.moduleKeys?.includes(mod.key);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => handleToggle(mod.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${isActive
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                            : "bg-transparent border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-200"
                          }`}
                      >
                        {isActive && <FiCheck size={12} />}
                        {mod.key}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <GenericButton
            type={isEditing ? "PRIMARY" : "SECONDARY"}
            size="XL"
            disabled={submitting}
            loading={submitting}
            onClick={onSubmit}
            className="w-full"
          >
            {submitting
              ? "Syncing Data..."
              : isEditing
                ? "Update Configuration"
                : "Deploy New Plan"}
          </GenericButton>
        </form>
      </div>

      {/* PRO TIP */}
      <div className="mt-5 p-5 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-800/50 rounded-[2rem] border border-emerald-100/50 dark:border-slate-700 hidden lg:block">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="text-emerald-500" size={14} />
          <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Configuration Tip
          </p>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Created plans are instantly available in onboarding.
          Price changes affect only{" "}
          <span className="text-emerald-600 font-bold">new</span> subscriptions.
        </p>
      </div>
    </div>
  );
}
