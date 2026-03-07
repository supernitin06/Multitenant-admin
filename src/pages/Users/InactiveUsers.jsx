import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserX, ShieldAlert, RotateCcw, 
  Trash2, Search, Lock, AlertTriangle, 
  ChevronRight, Calendar, Info
} from 'lucide-react';

const InactiveUsers = () => {
  const [inactiveUsers] = useState([
    { 
      id: "u-201", 
      name: "Rahul Verma", 
      email: "rahul@startup.io", 
      tenant: "Tech Stack", 
      role: "Editor",
      isActive: false, 
      lockedUntil: "2025-12-30T10:00:00Z",
      failedLoginCount: 5,
      updatedAt: "2 hours ago"
    },
    { 
      id: "u-205", 
      name: "Suresh Mehra", 
      email: "suresh@corp.net", 
      tenant: "Main HQ", 
      role: "Viewer",
      isActive: false, 
      lockedUntil: null,
      failedLoginCount: 1,
      updatedAt: "15 days ago"
    }
  ]);

  return (
    
    <div className="min-h-screen  dark:bg-gray-850 font-sans p-4 md:p-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Risk Header */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-2 rounded-xl">
                <ShieldAlert size={24} />
             </span>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Inactive Directory</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Reviewing restricted access and security-locked accounts.</p>
        </div>

        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all flex items-center gap-2 shadow-sm">
              <Trash2 size={18} /> Bulk Delete
           </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        
        {/* Search & Alert Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
           <div className="lg:col-span-3 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by email or reason..." 
                className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-900/20 outline-none transition-all shadow-sm dark:text-white"
              />
           </div>
           <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle className="text-amber-500 dark:text-amber-400 flex-shrink-0" size={20} />
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 leading-tight uppercase tracking-wider">
                {inactiveUsers.length} Users are currently restricted from login.
              </p>
           </div>
        </div>

        {/* Inactive User Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {inactiveUsers.map((user) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-rose-300 dark:hover:border-rose-900 transition-all relative overflow-hidden group shadow-sm"
              >
                {/* Visual indicator for Locked vs Suspended */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${user.lockedUntil ? 'bg-rose-500 dark:bg-rose-600' : 'bg-slate-300 dark:bg-gray-700'}`} />

                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                    <UserX size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{user.name || 'Unknown User'}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> Last Activity: {user.updatedAt}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Reason</span>
                      <div className="flex items-center gap-2">
                         {user.lockedUntil ? (
                           <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                              <Lock size={12} /> Account Locked
                           </span>
                         ) : (
                           <span className="bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-slate-200 dark:border-gray-700">
                              <Info size={12} /> Manually Disabled
                           </span>
                         )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 min-w-[100px]">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Failed Logs</span>
                      <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                         <span className="text-sm">{user.failedLoginCount} Attempts</span>
                      </div>
                    </div>
                </div>

                {/* Critical Actions */}
                <div className="flex items-center gap-3 border-t dark:border-gray-800 md:border-none pt-4 md:pt-0">
                   <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all flex items-center gap-2">
                      <RotateCcw size={14} /> Reactivate
                   </button>
                   <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                      <ChevronRight size={20} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default InactiveUsers;