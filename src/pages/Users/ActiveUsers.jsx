import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, History, Settings2, Plus, Filter,
  ArrowRight, Search, MoreHorizontal
} from 'lucide-react';

const ActiveUsers = () => {
  const [activeUsers] = useState([
    { 
      id: "u-101", 
      name: "Aman Sharma", 
      email: "aman@tenant-a.com", 
      tenant: "Global Tech", 
      role: "Super Admin",
      lastLogin: "Active Now",
      createdAt: "Jan 2024"
    },
    { 
      id: "u-102", 
      name: "Sneha Kapur", 
      email: "sneha@tenant-b.com", 
      tenant: "Design Hub", 
      role: "Project Manager",
      lastLogin: "14 mins ago",
      createdAt: "Mar 2024"
    }
  ]);

  return (
   
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header - Glassmorphism effect in Dark Mode */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Title & Stats */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Active Identities</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{activeUsers.length} Live Now</span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Monitoring verified access</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-72 group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Quick search..." 
                    className="w-full bg-slate-100/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-900/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                  />
               </div>
               <button className="p-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all shadow-sm">
                  <Filter size={18} />
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Plus size={18} /> <span className="hidden sm:inline">Add User</span>
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Bulk Action Bar */}
        <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Directory Listing</h2>
            <button className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              Export CSV <ArrowRight size={12} />
            </button>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 gap-4">
          {activeUsers.map((user, index) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200/60 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
            >
              {/* User Identity */}
              <div className="flex items-center gap-4 md:w-1/3">
                <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center relative border border-slate-200 dark:border-gray-700 transition-colors">
                   <span className="text-slate-700 dark:text-slate-300 font-black text-lg">{user.name[0]}</span>
                   <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>

              {/* Workspace & Role */}
              <div className="flex items-center gap-8 md:w-1/3">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Workspace</p>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{user.tenant}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Authority</p>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Activity & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 border-t dark:border-gray-800 md:border-none pt-4 md:pt-0">
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Pulse</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <History size={13} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300 italic">{user.lastLogin}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                   <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all">
                      <Settings2 size={18} />
                   </button>
                   <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ActiveUsers;