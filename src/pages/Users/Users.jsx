import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, MoreVertical, Search, 
  Lock, Filter, ChevronRight, 
  CheckCircle2, AlertCircle, Mail, Globe
} from 'lucide-react';

const Users = () => {
  const [filter, setFilter] = useState('all');
  
  const users = [
    { id: "1", email: "admin@corp.com", name: "Aman Sharma", isActive: true, lockedUntil: null, role: "Admin", tenant: "Noida Branch", failedCount: 0 },
    { id: "2", email: "rahul@tech.io", name: "Rahul Verma", isActive: false, lockedUntil: "2024-01-01", role: "Editor", tenant: "Delhi HQ", failedCount: 5 },
    { id: "3", email: "priya@dev.com", name: "Priya Das", isActive: true, lockedUntil: null, role: "Viewer", tenant: "Noida Branch", failedCount: 1 },
  ];

  const filteredUsers = users.filter(u => 
    filter === 'all' ? true : filter === 'active' ? u.isActive : !u.isActive
  );

  return (
    <div className="min-h-screen dark:bg-gray-850 p-3 md:p-8 font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-10 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Managing {users.length} identity records</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all text-sm shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex-2 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 dark:shadow-none">
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-gray-800  mb-6 gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          {['all', 'active', 'inactive'].map((t) => ( 
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`pb-3 text-xs md:text-sm font-black capitalize transition-all relative ${
                filter === t ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {t} Users
              {filter === t && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search name, email..."
            className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:ring-4 focus:ring-indigo-50/50 dark:focus:ring-indigo-900/20 outline-none transition-all text-sm shadow-sm dark:text-white"
          />
        </div>

        {/* User Card List */}
        <div className="grid gap-3 md:gap-4">
          <AnimatePresence mode='popLayout'>
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-3 md:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-indigo-500 dark:hover:border-l-indigo-400"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 md:gap-5 mb-3 md:mb-0">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg border border-slate-200 dark:border-gray-700 shadow-sm">
                      {user.name[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 ${user.isActive ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base truncate flex items-center gap-2">
                      {user.name}
                      {user.lockedUntil && <Lock size={12} className="text-amber-500" />}
                    </h3>
                    <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs gap-1 truncate font-medium">
                      <Mail size={12} className="flex-shrink-0" />
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Role & Tenant */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-1 mb-3 md:mb-0 bg-slate-50 dark:bg-gray-800/50 md:bg-transparent p-2 md:p-0 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
                    <Globe size={12} className="text-slate-400 dark:text-slate-500" />
                    <span className="truncate max-w-[100px]">{user.tenant}</span>
                  </div>
                  <span className="hidden md:block h-1 w-1 bg-slate-300 dark:bg-gray-700 rounded-full" />
                  <span className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 md:bg-indigo-100/50 px-2 py-0.5 rounded uppercase">
                    {user.role}
                  </span>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-100 dark:border-gray-800 md:border-none pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                     <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Security Status</p>
                     <div className="flex items-center gap-1.5">
                        {user.lockedUntil ? 
                          <span className="text-rose-500 dark:text-rose-400 text-[11px] font-black flex items-center gap-1"><AlertCircle size={12}/> Locked</span> : 
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-black flex items-center gap-1"><CheckCircle2 size={12}/> Secure</span>
                        }
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400 dark:text-slate-500">
                      <MoreVertical size={18} />
                    </button>
                    <button className="md:hidden p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Users;