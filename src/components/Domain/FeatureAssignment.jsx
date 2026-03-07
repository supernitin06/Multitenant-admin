import React, { useState, useEffect } from "react";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";
import { 
  useGetDomainFeaturesQuery, 
  useAssignFeatureToDomainMutation, 
  useRemoveFeatureFromDomainMutation 
} from "../../api/Common/domain.api";
import { useGetFeaturesQuery } from "../../api/platform/feature.api";

export default function FeatureAssignment({ domainId, onClose }) {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false); // NEW: Control what to show
  
  // Get all available features and domain's current features
  const { data: allFeatures, isLoading: featuresLoading } = useGetFeaturesQuery();
  const { data: domainFeatures, isLoading: domainFeaturesLoading } = useGetDomainFeaturesQuery(domainId);
  
  const [assignFeature, { isLoading: assigning }] = useAssignFeatureToDomainMutation();
  const [removeFeature, { isLoading: removing }] = useRemoveFeatureFromDomainMutation();

  // Set current features when data loads
  useEffect(() => {
    if (domainFeatures?.features) {
      setSelectedFeatures(domainFeatures.features.map(f => f._id));
    }
  }, [domainFeatures]);

  const handleFeatureToggle = async (featureId) => {
    if (selectedFeatures.includes(featureId)) {
      // Remove feature
      try {
        await removeFeature({ featureId, domainId }).unwrap();
        setSelectedFeatures(prev => prev.filter(id => id !== featureId));
      } catch (error) {
        console.error("Failed to remove feature:", error);
        alert("Failed to remove feature");
      }
    } else {
      // Check if feature is already assigned
      if (selectedFeatures.includes(featureId)) {
        alert("Feature already assigned");
        return;
      }
      
      // Assign feature
      try {
        await assignFeature({ featureId, domainId }).unwrap();
        setSelectedFeatures(prev => [...prev, featureId]);
        alert("Feature assigned successfully");
      } catch (error) {
        console.error("Failed to assign feature:", error);
        alert("Failed to assign feature");
      }
    }
  };

  // Separate assigned and unassigned features
  const assignedFeatures = allFeatures?.features?.filter(f => selectedFeatures.includes(f._id)) || [];
  const unassignedFeatures = allFeatures?.features?.filter(f => !selectedFeatures.includes(f._id)) || [];

  if (featuresLoading || domainFeaturesLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading features...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Assign Features to Domain
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400">
            <FiX size={20} />
          </button>
        </div>

        {/* Features List */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {allFeatures?.features?.map((feature) => {
              const isAssigned = selectedFeatures.includes(feature._id);
              return (
                <div 
                  key={feature._id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isAssigned 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-700 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                  onClick={() => handleFeatureToggle(feature._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-full text-slate-700 dark:text-slate-300">
                          {feature.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300">
                          {feature.type}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isAssigned ? (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <FiCheck size={16} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center">
                          <FiPlus size={14} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allFeatures?.features?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No features available to assign
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} assigned
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
