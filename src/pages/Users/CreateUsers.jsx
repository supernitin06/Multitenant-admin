import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Eye, EyeOff, UserPlus, Mail, Lock, 
  ShieldCheck, CheckCircle2, Sparkles 
} from "lucide-react";

const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Payload:", form);
      setIsSubmitting(false);
      alert("User Created Successfully! 🎉");
    }, 1500);
  };

  return (
    <div className="min-h-screen dark:bg-gray-850 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                <UserPlus size={20} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Provision Identity</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configure access for your new team member</p>
          </div>
          <div className="hidden sm:block">
             <div className="bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-slate-200 dark:border-gray-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 italic">System Ready</span>
             </div>
          </div>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8 space-y-6">
            
            {/* Full Name */}
            <div className="group space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 ml-1">Legal Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  <Sparkles size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 ml-1">Workspace Email <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@vortex.com"
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 ml-1">Access Key <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-12 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role & Toggle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
               <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 ml-1">Permissions <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <ShieldCheck size={18} />
                    </div>
                    <select
                      name="roleId"
                      required
                      value={form.roleId}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                    >
                      <option value="" className="dark:bg-gray-900">Select Role</option>
                      <option value="SUPER_ADMIN" className="dark:bg-gray-900">Super Admin</option>
                      <option value="TENANT_ADMIN" className="dark:bg-gray-900">Tenant Admin</option>
                      <option value="USER" className="dark:bg-gray-900">Standard User</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 ml-1">Account Status</label>
                  <label className="flex items-center justify-between bg-slate-50 dark:bg-gray-800/50 rounded-2xl py-3 px-4 border-2 border-transparent hover:border-slate-100 dark:hover:border-gray-700 transition-all cursor-pointer h-[52px]">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{form.isActive ? 'Active' : 'Disabled'}</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-indigo-600" : "bg-slate-300 dark:bg-gray-700"}`}>
                        <motion.div 
                          animate={{ x: form.isActive ? 20 : 2 }}
                          className="absolute top-1 w-4 h-3 bg-white rounded-full shadow-sm" 
                        />
                      </div>
                    </div>
                  </label>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50/50 dark:bg-gray-900/50 px-8 py-6 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-gray-800">
            <button
              type="button"
              className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative overflow-hidden px-8 py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg ${
                isSubmitting 
                ? 'bg-indigo-400 dark:bg-indigo-900/50 cursor-not-allowed text-white/50' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
              }`}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Deploy User <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateUser;