import React, { useState } from "react";
import {
  FiEdit3,
  FiGlobe,
  FiDollarSign,
  FiTrash2,
  FiLayers,
  FiX,
  FiCheckCircle,
  FiCpu,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useGetDomainsQuery } from "../../api/Common/domain.api";
import {
  useGetFeaturesQuery,
  useAssignFeatureToDomainMutation,
} from "../../api/platform/feature.api";

export default function FeatureDomainTable({ onEdit, onDelete }) {
  const { data, isLoading: domainsLoading } = useGetDomainsQuery();
  const domains = data?.domains || [];

  const { data: featureData } = useGetFeaturesQuery();
  const allFeatures = featureData?.features || [];

  const [assignFeature, { isLoading: isAssigning }] =
    useAssignFeatureToDomainMutation();

  // UI STATES
  const [expandedDomainId, setExpandedDomainId] = useState(null);
  const [assigningToDomain, setAssigningToDomain] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState("");

  const toggleExpand = (domainId) => {
    setExpandedDomainId((prev) => (prev === domainId ? null : domainId));
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFeatureId) {
      toast.error("Please select a feature");
      return;
    }

    try {
      await assignFeature({
        domainId: assigningToDomain.id,
        featureId: selectedFeatureId,
      }).unwrap();

      toast.success("Feature assigned successfully!");
      setAssigningToDomain(null);
      setSelectedFeatureId("");
    } catch (err) {
      toast.error(err?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-6 border-b bg-slate-50/30 dark:bg-slate-800/50 flex items-center gap-2">
        <FiGlobe className="text-blue-500" />
        <h3 className="font-black uppercase text-xs tracking-[0.2em]">
          Domain Registry
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
              <th className="px-8 py-5">Domain</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Add Feature</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {domainsLoading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  Loading domains…
                </td>
              </tr>
            ) : (
              domains.map((domain) => {
                const isExpanded = expandedDomainId === domain.id;

                return (
                  <React.Fragment key={domain.id}>
                    {/* MAIN ROW */}
                    <tr
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => toggleExpand(domain.id)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 font-black uppercase">
                          {isExpanded ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                          {domain.domain_name}
                          <span className="text-xs text-slate-400">
                            ({domain.features?.length || 0})
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          ID: {domain.id}
                        </div>
                      </td>

                      <td className="px-8 py-5 font-black text-sm">
                        <FiDollarSign className="inline text-emerald-500 mr-1" />
                        {domain.price}
                      </td>

                      <td className="px-8 py-5 text-xs text-slate-500">
                        {domain.description || "N/A"}
                      </td>

                      <td className="px-8 py-5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssigningToDomain(domain);
                          }}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase"
                        >
                          <FiPlus size={12} /> Assign
                        </button>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div
                          className="flex justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button onClick={() => onEdit(domain)}>
                            <FiEdit3 />
                          </button>
                          <button onClick={() => onDelete(domain.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED FEATURE DETAILS */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="5" className="px-12 py-6 bg-slate-50">
                          {domain.features?.length === 0 ? (
                            <p className="text-sm text-slate-400">
                              No features assigned.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              <h4 className="text-xs font-black uppercase text-slate-400">
                                Assigned Features
                              </h4>

                              {domain.features.map((f) => (
                                <div
                                  key={f.id}
                                  className="flex justify-between items-start p-4 bg-white rounded-xl border"
                                >
                                  <div className="flex gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                      <FiCpu className="text-emerald-600" />
                                    </div>
                                    <div>
                                      <div className="font-black uppercase">
                                        {f.feature?.feature_name}
                                      </div>
                                      <div className="text-[9px] font-mono text-slate-400">
                                        {f.feature?.feature_code}
                                      </div>
                                      <div className="text-xs text-slate-500 mt-1">
                                        {f.feature?.description}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                    <FiCheckCircle /> Active
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ASSIGN FEATURE MODAL */}
      {assigningToDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-md rounded-3xl">
            <div className="p-6 border-b flex justify-between">
              <h3 className="font-black">
                Assign Feature to {assigningToDomain.domain_name}
              </h3>
              <button onClick={() => setAssigningToDomain(null)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <select
                value={selectedFeatureId}
                onChange={(e) => setSelectedFeatureId(e.target.value)}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Select feature</option>
                {allFeatures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.feature_name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isAssigning}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold"
              >
                {isAssigning ? "Assigning…" : "Confirm Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
