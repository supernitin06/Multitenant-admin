import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  GenericTable,
  GenericModal,
  GenericForm,
  GenericButton,
  featuresTableConfig
} from "../Common";
import { useGetFeaturesQuery, useCreateFeatureMutation, useUpdateFeatureMutation, useDeleteFeatureMutation } from "../../api/platform/feature.api";
import { createTextField, createSelectField, createTextareaField, createCheckboxField } from "../Common/GenericForm";
import { featuresTableConfig } from "../../config/tableConfigs.jsx";

export default function FeatureTableCentralized() {
  const { data, isLoading, refetch } = useGetFeaturesQuery();
  const features = data?.features || [];

  const [createFeature] = useCreateFeatureMutation();
  const [updateFeature] = useUpdateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [expandedFeatureId, setExpandedFeatureId] = useState(null);

  const handleEdit = (feature) => {
    setEditingFeature(feature);
  };

  const handleDelete = async (featureId) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      try {
        await deleteFeature(featureId).unwrap();
        toast.success("Feature deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete feature");
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateSubmit = async (formData) => {
    try {
      await createFeature(formData).unwrap();
      toast.success("Feature created successfully!");
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create feature");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await updateFeature({ id: editingFeature.id, ...formData }).unwrap();
      toast.success("Feature updated successfully!");
      setEditingFeature(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update feature");
    }
  };

  // Form fields for create/edit
  const featureFields = [
    createTextField({
      name: "feature_name",
      label: "Feature Name",
      required: true,
      placeholder: "Enter feature name"
    }),
    createTextField({
      name: "feature_code",
      label: "Feature Code",
      required: true,
      placeholder: "Enter feature code (e.g., USER_MANAGEMENT)"
    }),
    createTextareaField({
      name: "description",
      label: "Description",
      placeholder: "Enter feature description",
      rows: 4
    }),
    createSelectField({
      name: "category",
      label: "Category",
      required: true,
      options: [
        { value: "CORE", label: "Core" },
        { value: "PREMIUM", label: "Premium" },
        { value: "INTEGRATION", label: "Integration" },
        { value: "UTILITY", label: "Utility" }
      ]
    }),
    createCheckboxField({
      name: "isActive",
      label: "Active"
    })
  ];

  // Prepare features data with usage statistics
  const featuresWithStats = features.map(feature => ({
    ...feature,
    usageCount: Math.floor(Math.random() * 50) + 1 // Mock usage count
  }));

  return (
    <>
      <Toaster toastOptions={{ className: 'dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-xs border border-emerald-100 dark:border-slate-700' }} />

      <div className="p-8">
        {/* Header with actions */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Feature Management
          </h1>
          <div className="flex gap-3">
            <GenericButton
              type="OUTLINE"
              icon="refresh"
              onClick={handleRefresh}
            >
              Refresh
            </GenericButton>
            <GenericButton
              type="PRIMARY"
              icon="add"
              onClick={() => setShowCreateModal(true)}
            >
              Add New Feature
            </GenericButton>
          </div>
        </div>

        <GenericTable
          config={featuresTableConfig}
          data={featuresWithStats}
          loading={isLoading}
          handlers={{
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRefresh: handleRefresh
          }}
          expandedRows={expandedFeatureId ? { [expandedFeatureId]: true } : {}}
          onToggleExpand={(id, isExpanded) => setExpandedFeatureId(isExpanded ? id : null)}
        />

        {/* Create Feature Modal */}
        {showCreateModal && (
          <GenericModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Feature"
            subtitle="Add a new feature to the system"
            size="MD"
            actions={[
              {
                label: "Cancel",
                onClick: () => setShowCreateModal(false)
              },
              {
                label: "Create Feature",
                onClick: () => document.getElementById('feature-form')?.requestSubmit(),
                primary: true
              }
            ]}
          >
            <GenericForm
              id="feature-form"
              fields={featureFields}
              onSubmit={handleCreateSubmit}
              submitText="Create Feature"
            />
          </GenericModal>
        )}

        {/* Edit Feature Modal */}
        {editingFeature && (
          <GenericModal
            isOpen={!!editingFeature}
            onClose={() => setEditingFeature(null)}
            title="Edit Feature"
            subtitle={`Update ${editingFeature.feature_name}`}
            size="MD"
            actions={[
              {
                label: "Cancel",
                onClick: () => setEditingFeature(null)
              },
              {
                label: "Update Feature",
                onClick: () => document.getElementById('feature-edit-form')?.requestSubmit(),
                primary: true
              }
            ]}
          >
            <GenericForm
              id="feature-edit-form"
              fields={featureFields}
              onSubmit={handleEditSubmit}
              initialValues={editingFeature}
              submitText="Update Feature"
            />
          </GenericModal>
        )}
      </div>
    </>
  );
}
