import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  GenericTable,
  GenericModal,
  GenericForm,
  GenericButton,
  domainsTableConfig
} from "../Common";
import { useGetDomainsQuery } from "../../api/Common/domain.api";
import { useGetFeaturesQuery, useAssignFeatureToDomainMutation } from "../../api/platform/feature.api";
import { createSelectField } from "../Common/GenericForm.jsx";
import { FiPlus, FiLayers, FiX, FiCheckCircle, FiCpu } from "react-icons/fi";
import { domainsTableConfig } from "../../config/tableConfigs.jsx";

export default function DomainTableCentralized({ onEdit, onDelete }) {
  const { data, isLoading: domainsLoading } = useGetDomainsQuery();
  const domains = data?.domains || [];

  const { data: featureData } = useGetFeaturesQuery();
  const allFeatures = featureData?.features || [];
  const [assignFeature, { isLoading: isAssigning }] = useAssignFeatureToDomainMutation();

  // States for Popups
  const [viewingFeatures, setViewingFeatures] = useState(null);
  const [assigningToDomain, setAssigningToDomain] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState("");

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFeatureId) return toast.error("Please select a feature");

    // Check if feature is already assigned to this domain
    const isAlreadyAssigned = assigningToDomain.features?.some(
      feature => feature.featureId === selectedFeatureId
    );

    if (isAlreadyAssigned) {
      toast.error("Feature already assigned");
      return;
    }

    try {
      await assignFeature({
        domainId: assigningToDomain.id,
        featureId: selectedFeatureId
      }).unwrap();

      toast.success("Feature assigned successfully!");
      setAssigningToDomain(null);
      setSelectedFeatureId("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign feature");
    }
  };

  const handleViewFeatures = (domain) => {
    setViewingFeatures(domain);
  };

  const handleAssignFeatures = (domain, e) => {
    if (e) e.stopPropagation();
    setAssigningToDomain(domain);
  };

  // Prepare domains data with custom handlers
  const domainsWithHandlers = domains.map(domain => ({
    ...domain,
    onAssignFeatures: (domain, e) => handleAssignFeatures(domain, e)
  }));

  // Feature assignment form fields
  const featureFields = [
    createSelectField({
      name: "featureId",
      label: "Select Feature to Link",
      required: true,
      options: allFeatures.map(f => ({
        value: f.id,
        label: `${f.feature_name} (${f.feature_code})`
      }))
    })
  ];

  return (
    <>
      <Toaster toastOptions={{ className: 'dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-xs border border-emerald-100 dark:border-slate-700' }} />

      <GenericTable
        config={domainsTableConfig}
        data={domainsWithHandlers}
        loading={domainsLoading}
        handlers={{
          onEdit,
          onDelete,
          onViewFeatures: handleViewFeatures
        }}
        customComponents={{
          // Custom renderer for assign features cell
          assignFeatures: (item) => (
            <button
              onClick={(e) => handleAssignFeatures(item, e)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-100 dark:shadow-none"
            >
              <FiPlus size={14} /> Assign
            </button>
          )
        }}
      />

      {/* ASSIGN FEATURE MODAL */}
      {assigningToDomain && (
        <GenericModal
          isOpen={!!assigningToDomain}
          onClose={() => setAssigningToDomain(null)}
          title="Assign Feature"
          subtitle={`Target: ${assigningToDomain.domain_name}`}
          size="MD"
          actions={[
            {
              label: "Cancel",
              onClick: () => setAssigningToDomain(null)
            },
            {
              label: "Confirm Assignment",
              onClick: handleAssignSubmit,
              primary: true,
              loading: isAssigning,
              disabled: !selectedFeatureId || isAssigning
            }
          ]}
        >
          <GenericForm
            fields={featureFields}
            onSubmit={handleAssignSubmit}
            initialValues={{ featureId: selectedFeatureId }}
            submitText="Confirm Assignment"
            loading={isAssigning}
          />

          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This action will establish a relationship between <strong>{assigningToDomain.domain_name}</strong> and the selected feature.
            </p>
          </div>
        </GenericModal>
      )}

      {/* VIEW ASSIGNED FEATURES MODAL */}
      {viewingFeatures && (
        <GenericModal
          isOpen={!!viewingFeatures}
          onClose={() => setViewingFeatures(null)}
          title="Assigned Features"
          subtitle={`Domain: ${viewingFeatures.domain_name}`}
          size="XL"
          actions={[
            {
              label: "Close",
              onClick: () => setViewingFeatures(null),
              primary: true
            }
          ]}
        >
          <div className="p-10">
            {viewingFeatures.features?.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-slate-400 text-sm">No features assigned to this domain yet.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {viewingFeatures.features?.map((featureItem) => (
                  <div key={featureItem.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <FiCpu className="text-emerald-600 dark:text-emerald-400" size={16} />
                      </div>
                      <div>
                        <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{featureItem.feature?.feature_name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">Code: {featureItem.feature?.feature_code}</div>
                        <div className="text-xs text-slate-500 mt-1">{featureItem.feature?.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-emerald-500" size={16} />
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Assigned</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GenericModal>
      )}
    </>
  );
}
