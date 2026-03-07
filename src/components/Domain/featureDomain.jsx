import React, { useState, useEffect } from "react";
import { FiGlobe, FiPlus, FiActivity } from "react-icons/fi";
import { useGetDomainsQuery } from "../../api/Common/domain.api";
import { GenericButton, GenericTable, domainsTableConfig } from "../Common";
import DomainForm from "./featureForm";

export default function DomainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [viewingFeatures, setViewingFeatures] = useState(null);

  // Mock data - replace with your useGetDomainsQuery() hook
  // const [domains, setDomains] = useState([
  //   { id: "1", name: "enterprise.com", price: 500, description: "Main corporate portal", isActive: true },
  // ]);
  const { data: domainsData, isLoading: domainsLoading, refetch } = useGetDomainsQuery();

  // Debug logs to check data flow
  console.log("=== DEBUG DOMAIN DATA ===");
  console.log("domainsData:", domainsData);
  console.log("domains:", domainsData?.domains);
  console.log("isLoading:", domainsLoading);
  console.log("domains length:", domainsData?.domains?.length);

  const domains = domainsData?.domains || [];
  console.log("Final domains array:", domains);

  const handleOpenCreate = () => {
    console.log("Opening create modal");
    console.log(domainsData);


    setEditingDomain(null);
    setIsModalOpen(true);

  };

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleViewFeatures = (domain) => {
    console.log("Viewing features for:", domain);
    setViewingFeatures(domain);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0f172a] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-200">
                <FiGlobe size={28} />
              </div>
              Feature Domain Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 font-medium">
              <FiActivity className="text-blue-500 animate-pulse" />
              Register and manage client-facing domain environments.
            </p>
          </div>

          <GenericButton
            type="PRIMARY"
            size="LG"
            icon="add"
            onClick={handleOpenCreate}
            className="px-6 py-3"
          >
            Create New Domain
          </GenericButton>
        </div>

        {/* DOMAIN TABLE */}
        <GenericTable
          config={domainsTableConfig}
          data={domainsData?.domains || []}
          loading={domainsLoading}
          handlers={{
            onEdit: handleEdit,
            onDelete: (domainId) => {
              if (window.confirm("Are you sure you want to delete this domain?")) {
                console.log("Delete domain:", domainId);
              }
            },
            onViewFeatures: handleViewFeatures
          }}
        />

        {/* POPUP MODAL FORM */}
        {isModalOpen && (
          <DomainForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingDomain}
            refetch={refetch}
          />
        )}

        {/* FEATURES MODAL */}
        {viewingFeatures && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
              {/* Header */}
              <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/50">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                    <FiGlobe className="text-blue-500" /> Domain Features
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">
                    {viewingFeatures.domain_name} ({viewingFeatures.features?.length || 0} features)
                  </p>
                </div>

              </div>

              {/* Content */}
              <div className="p-10">
                {viewingFeatures.features?.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-slate-400 text-sm">No features assigned to this domain yet.</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {viewingFeatures.features?.map((featureItem) => (
                      <div key={featureItem.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <FiActivity className="text-emerald-600 dark:text-emerald-400" size={16} />
                              </div>
                              <div>
                                <h4 className="font-black text-slate-800 dark:text-white text-lg">
                                  {featureItem.feature_name}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {featureItem.feature?.feature_code}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                              {featureItem.feature?.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${featureItem.feature?.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                {featureItem.feature?.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span>ID: {featureItem.featureId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-10 py-6 border-t border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    Domain ID: {viewingFeatures.id}
                  </div>
                  <button
                    onClick={() => setViewingFeatures(null)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}