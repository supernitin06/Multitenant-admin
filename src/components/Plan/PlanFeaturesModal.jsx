
import React, { useState } from "react";
import { useGetPlanDomainsQuery } from "../../api/plans.api";
import { FiX, FiGlobe, FiCpu, FiCheck, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const PlanFeaturesModal = ({ isOpen, onClose, planId, planName }) => {
    const { data, isLoading, isError } = useGetPlanDomainsQuery(planId, {
        skip: !planId || !isOpen,
    });

    const [expandedDomainId, setExpandedDomainId] = useState(null);

    if (!isOpen) return null;

    const toggleDomain = (domainId) => {
        setExpandedDomainId(expandedDomainId === domainId ? null : domainId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FiCpu className="text-emerald-500" />
                            Plan Features & Domains
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Viewing features for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{planName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <FiX size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
                            <FiLoader size={40} className="animate-spin mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Loading domains...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-20 text-red-500">
                            <p>Failed to load plan details. Please try again.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data?.domains?.length === 0 ? (
                                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                                    <p>No domains linked to this plan.</p>
                                </div>
                            ) : (
                                data?.domains?.map((domain) => (
                                    <div
                                        key={domain.domainId}
                                        className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                                    >
                                        {/* Domain Header (Clickable) */}
                                        <div
                                            onClick={() => toggleDomain(domain.domainId)}
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                    <FiGlobe size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                        {domain.domain_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {domain.details?.description || "No description available"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${domain.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                    {domain.isActive ? "Active" : "Inactive"}
                                                </span>
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {domain.features?.length || 0} Features
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features List (Expandable) */}
                                        <AnimatePresence>
                                            {expandedDomainId === domain.domainId && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50"
                                                >
                                                    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                                        {domain.features?.map((feature) => (
                                                            <div
                                                                key={feature.featureId}
                                                                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-2 relative overflow-hidden group hover:border-emerald-500 transition-colors"
                                                            >
                                                                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                                    {feature.isActive && <FiCheck className="text-emerald-500" />}
                                                                </div>

                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <FiCpu className="text-emerald-500" size={18} />
                                                                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                                                        {feature.feature_name}
                                                                    </span>
                                                                </div>

                                                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                                                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Code:</span> {feature.feature_code}</p>
                                                                    <p className="line-clamp-2" title={feature.description}>
                                                                        {feature.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!domain.features || domain.features.length === 0) && (
                                                            <div className="col-span-full py-4 text-center text-sm text-gray-500">
                                                                No features found for this domain.
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PlanFeaturesModal;
