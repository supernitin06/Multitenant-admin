import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GenericForm, GenericModal } from "../Common";
import { useCreateTenantMutation } from "../../api/tenants/tenant.api";
import {
  createTextField,
  createEmailField,
  createPasswordField,
  createSelectField,
  createTextareaField,
  createCheckboxField
} from "../Common/GenericForm";

export default function TenantFormCentralized({ initialData, onSuccess, isOpen, onClose }) {
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();

  const defaultState = {
    tenantName: "",
    tenantType: "SCHOOL",
    tenantPassword: "",
    tenantUsername: "",
    tenantEmail: "",
    tenantPhone: "",
    tenantAddress: "",
    tenantWebsite: "",
    logoUrl: "",
    faviconUrl: "",
    themeColor: "#1E40AF",
    isActive: true,
    role: "",
    subscription_planId: ""
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultState, ...initialData });
    } else {
      setFormData(defaultState);
    }
  }, [initialData]);

  const handleSubmit = async (data) => {
    try {
      const result = await createTenant(data).unwrap();
      toast.success("Tenant created successfully!");

      // Reset form for new creation
      setFormData(defaultState);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create tenant");
    }
  };

  const tenantFields = [
    createTextField({
      name: "tenantName",
      label: "Organization Name",
      required: true,
      placeholder: "Enter organization name"
    }),
    createSelectField({
      name: "tenantType",
      label: "Business Category",
      required: true,
      options: [
        { value: "SCHOOL", label: "School" },
        { value: "COACHING", label: "Coaching Center" },
        { value: "CLINIC", label: "Clinic" },
        { value: "PHARMACY", label: "Pharmacy" },
        { value: "RETAIL", label: "Retail Store" },
        { value: "RESTAURANT", label: "Restaurant" },
        { value: "GYM", label: "Gym" },
        { value: "SALON", label: "Salon" }
      ]
    }),
    createTextField({
      name: "tenantUsername",
      label: "Username",
      required: true,
      placeholder: "Enter username"
    }),
    createEmailField({
      name: "tenantEmail",
      label: "Admin Email",
      required: true,
      placeholder: "Enter admin email"
    }),
    createPasswordField({
      name: "tenantPassword",
      label: initialData ? "New Password" : "Password",
      required: !initialData,
      placeholder: "Enter password"
    }),
    createTextField({
      name: "tenantPhone",
      label: "Phone",
      placeholder: "Enter phone number"
    }),
    createTextareaField({
      name: "tenantAddress",
      label: "Address",
      placeholder: "Enter address",
      rows: 3
    }),
    createTextField({
      name: "tenantWebsite",
      label: "Website",
      placeholder: "Enter website URL"
    }),
    createTextField({
      name: "logoUrl",
      label: "Logo URL",
      placeholder: "Enter logo URL"
    }),
    createTextField({
      name: "faviconUrl",
      label: "Favicon URL",
      placeholder: "Enter favicon URL"
    }),
    {
      type: "color",
      name: "themeColor",
      label: "Theme Color",
      required: true
    },
    createCheckboxField({
      name: "isActive",
      label: "Active"
    })
  ];

  return (
    <>
      <Toaster toastOptions={{ className: 'dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-xs border border-emerald-100 dark:border-slate-700' }} />

      <GenericModal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Edit Tenant" : "Create New Tenant"}
        subtitle={initialData ? "Update tenant information" : "Add a new tenant to the system"}
        size="XL"
        actions={[
          {
            label: "Cancel",
            onClick: onClose
          },
          {
            label: initialData ? "Update Tenant" : "Create Tenant",
            onClick: () => document.getElementById('tenant-form')?.requestSubmit(),
            primary: true,
            loading: isCreating
          }
        ]}
      >
        <GenericForm
          id="tenant-form"
          fields={tenantFields}
          onSubmit={handleSubmit}
          initialValues={formData}
          submitText={initialData ? "Update Tenant" : "Create Tenant"}
          loading={isCreating}
        />
      </GenericModal>
    </>
  );
}
