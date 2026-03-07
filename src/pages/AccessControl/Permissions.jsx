import React, { useState } from "react";
import { PermissionsHeader } from "../../components/Common/GenericHeader";
import { CreateButton } from "../../components/Common/GenericButton";
import GenericTable from "../../components/Common/GenericTable";
import { useGetPermissionsQuery, useUpdatePermissionsMutation, useDeletePermissionsMutation, useCreatePermissionsMutation } from "../../api/platform/permission.api";
import { useGetDomainPermissionsQuery } from "../../api/platform/domainPermission.api";
import { FiUsers, FiX, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const Permission = () => {
    const { data: permissionsData, isLoading } = useGetPermissionsQuery();
    const permissions = permissionsData?.data || permissionsData?.permissions || [];

    const { data: domainsData } = useGetDomainPermissionsQuery();
    const domains = domainsData?.data || domainsData?.domains || [];

    const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionsMutation();
    const [deletePermission] = useDeletePermissionsMutation();
    const [createPermission, { isLoading: isCreating }] = useCreatePermissionsMutation();

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null); // null means creating mode
    const [formData, setFormData] = useState({ name: "", description: "", domainId: "", key: "" });

    const openCreateModal = () => {
        setEditingPermission(null);
        setFormData({ name: "", description: "", domainId: "", key: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name || "",
            description: permission.description || "",
            domainId: permission.domainId || "",
            key: permission.key || ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPermission(null);
        setFormData({ name: "", description: "", domainId: "", key: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.domainId || !formData.key) {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            if (editingPermission) {
                // UPDATE
                await updatePermission({ id: editingPermission.id, ...formData }).unwrap();
                toast.success("Permission updated successfully");
            } else {
                // CREATE
                await createPermission(formData).unwrap();
                toast.success("Permission created successfully");
            }
            closeModal();
        } catch (err) {
            console.error(editingPermission ? "Update failed" : "Create failed", err);
            toast.error(
                err?.data?.message || err?.message || (editingPermission ? "Failed to update permission" : "Failed to create permission")
            );
        }
    };

    const handleDelete = async (permission) => {
        if (!window.confirm(`Delete permission "${permission.name}"?`)) return;

        try {
            await deletePermission(permission.id).unwrap();
            toast.success("Permission deleted successfully");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error(
                err?.data?.message || err?.message || "Failed to delete permission"
            );
        }
    };

    const tableConfig = {
        title: "All Permissions",
        headerIcon: <FiUsers className="text-indigo-500" />,
        loadingText: "Loading Permissions...",
        columns: [
            {
                label: "Permission Name",
                key: "key",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {value}
                    </div>
                )
            },
            {
                label: "ID",
                key: "id",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {value}
                    </div>
                )
            },
            // {
            //     label: "Power",
            //     key: "power",
            //     type: "custom",
            //     render: (item, value) => (
            //         <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            //             {value}
            //         </div>
            //     )
            // },
            {
                label: "Description",
                key: "description",
                align: "right",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {value}
                    </div>
                )
            }
        ],
        actions: [
            { type: "edit", handler: "onEdit" },
            { type: "delete", handler: "onDelete" }
        ]
    };

    const handlers = {
        onEdit: (permission) => openEditModal(permission),
        onDelete: (permission) => handleDelete(permission),
        onView: (permission) => console.log("View permission", permission)
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-900">
            <PermissionsHeader
                actions={[
                    <CreateButton children="Create Permission" key="create" onClick={openCreateModal} />
                ]}
            />

            <GenericTable
                config={tableConfig}
                data={permissions}
                loading={isLoading}
                handlers={handlers}
            />

            {/* ROLE MODAL (CREATE & EDIT) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">
                                {editingPermission ? "Edit Permission" : "Create New Permission"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Permission Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="e.g. USER_CREATE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Key</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.key}
                                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="e.g. SUPER_ADMIN"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="e.g. 99"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Domain</label>
                                    <select
                                        required
                                        value={formData.domainId}
                                        onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                                    >
                                        <option value="">Select a domain...</option>
                                        {domains.map((domain) => (
                                            <option key={domain.id} value={domain.id}>
                                                {domain.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase text-xs tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isCreating || isUpdating ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <FiCheck size={16} /> {editingPermission ? "Update Permission" : "Create Permission"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Permission