import React, { useState } from "react";
import { DomainPermissionsHeader } from "../../components/Common/GenericHeader";
import { CreateButton } from "../../components/Common/GenericButton";
import GenericTable from "../../components/Common/GenericTable";
import { useGetDomainPermissionsQuery, useUpdateDomainPermissionMutation, useDeleteDomainPermissionMutation, useCreateDomainPermissionMutation, useAssignDomainPermissionMutation } from "../../api/platform/domainPermission.api";
import { useGetPermissionsQuery } from "../../api/platform/permission.api";
import { FiUsers, FiX, FiCheck, FiPlus, FiEye, FiShield, FiKey } from "react-icons/fi";
import toast from "react-hot-toast";

const DomainPermission = () => {
    const { data: domainData, isLoading } = useGetDomainPermissionsQuery();
    const domains = domainData?.data || domainData?.domains || [];

    const { data: permissionsData, isLoading: isPermsLoading } = useGetPermissionsQuery();
    const allPermissions = permissionsData?.permissions || permissionsData?.data || (Array.isArray(permissionsData) ? permissionsData : []);

    // Debug log to help identify response structure
    console.log("Permissions Data:", permissionsData);
    console.log("Extracted Permissions:", allPermissions);

    const [updateDomain, { isLoading: isUpdating }] = useUpdateDomainPermissionMutation();
    const [deleteDomain] = useDeleteDomainPermissionMutation();
    const [createDomain, { isLoading: isCreating }] = useCreateDomainPermissionMutation();
    const [assignPermission, { isLoading: isAssigning }] = useAssignDomainPermissionMutation();

    // State for CRUD Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    // State for Assign Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningDomain, setAssigningDomain] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // State for View Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingDomain, setViewingDomain] = useState(null);

    const openCreateModal = () => {
        setEditingDomain(null);
        setFormData({ name: "", description: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (domain) => {
        setEditingDomain(domain);
        setFormData({
            name: domain.name || "",
            description: domain.description || ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDomain(null);
        setFormData({ name: "", description: "" });
    };

    const openAssignModal = (domain) => {
        setAssigningDomain(domain);
        // Pre-select existing permissions if available
        const existingPerms = domain.permissions?.map(p => p.id) || [];
        setSelectedPermissions(existingPerms);
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setAssigningDomain(null);
        setSelectedPermissions([]);
    };

    const handlePermissionToggle = (permId) => {
        setSelectedPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    const openViewModal = (domain) => {
        setViewingDomain(domain);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setViewingDomain(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description) {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            if (editingDomain) {
                await updateDomain({ id: editingDomain.id, ...formData }).unwrap();
                toast.success("Domain updated successfully");
            } else {
                await createDomain(formData).unwrap();
                toast.success("Domain created successfully");
            }
            closeModal();
        } catch (err) {
            console.error(editingDomain ? "Update failed" : "Create failed", err);
            toast.error(err?.data?.message || err?.message || "Failed to process request");
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();

        try {
            await assignPermission({
                domainId: assigningDomain.id,
                permissionIds: selectedPermissions
            }).unwrap();
            toast.success("Permissions assigned successfully");
            closeAssignModal();
        } catch (err) {
            console.error("Assignment failed", err);
            toast.error(err?.data?.message || err?.message || "Failed to assign permissions");
        }
    };

    const handleDelete = async (domain) => {
        if (!window.confirm(`Delete domain "${domain.name}"?`)) return;

        try {
            await deleteDomain(domain.id).unwrap();
            toast.success("Domain deleted successfully");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error(
                err?.data?.message || err?.message || "Failed to delete domain"
            );
        }
    };

    const tableConfig = {
        title: "Permission Domains",
        headerIcon: <FiUsers className="text-indigo-500" />,
        loadingText: "Loading Domains...",
        columns: [
            {
                label: "Domain Name",
                key: "name",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-800 dark:text-white text-xs font-bold uppercase tracking-tight">
                        {value}
                    </div>
                )
            },
            {
                label: "ID",
                key: "id",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-400 dark:text-slate-500 text-[10px] font-medium font-mono">
                        {value}
                    </div>
                )
            },
            {
                label: "Permissions",
                key: "_count",
                type: "custom",
                render: (item) => (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                        {item?._count?.permissions || 0} PERMS
                    </div>
                )
            },
            {
                label: "Description",
                key: "description",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">
                        {value || "No description"}
                    </div>
                )
            },
            {
                label: "Permissions",
                key: "assignedRoles",
                type: "custom",
                render: (item) => (
                    <button
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors uppercase"
                        onClick={() => openAssignModal(item)}
                    >
                        Assign Permission
                    </button>
                )
            }
        ],
        actions: [
            {
                type: "custom",
                handler: "onView",
                icon: <FiEye size={14} />,
                className: "p-2.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-all"
            },
            { type: "edit", handler: "onEdit" },
            { type: "delete", handler: "onDelete" }
        ]
    };

    const handlers = {
        onEdit: (domain) => openEditModal(domain),
        onDelete: (domain) => handleDelete(domain),
        onView: (domain) => openViewModal(domain)
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-900">
            <DomainPermissionsHeader
                actions={[
                    <CreateButton children="Create Domain Permission" key="create Domain Permission" onClick={openCreateModal} />
                ]}
            />

            <GenericTable
                config={tableConfig}
                data={domains}
                loading={isLoading}
                handlers={handlers}
            />

            {/* VIEW PERMISSIONS MODAL */}
            {isViewModalOpen && viewingDomain && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                    <FiShield className="text-indigo-500" /> Domain Permissions
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Domain: <span className="text-indigo-600 dark:text-indigo-400">{viewingDomain.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={closeViewModal}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {!viewingDomain.permissions || viewingDomain.permissions.length === 0 ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                                        <FiShield className="text-slate-300" size={30} />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No permissions assigned to this domain yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {viewingDomain.permissions.map((perm) => (
                                        <div
                                            key={perm.id}
                                            className="group p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-indigo-500 transition-all shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                        {perm.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-mono tracking-tighter">
                                                        <FiKey className="text-indigo-400" size={10} /> {perm.key}
                                                    </div>
                                                </div>
                                                <div className="text-[9px] font-black px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-tighter shadow-sm">
                                                    ID: {perm.id.substring(0, 8)}...
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                                                {perm.description || "System level permission key."}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Total: {viewingDomain.permissions?.length || 0} Permissions
                            </div>
                            <button
                                onClick={closeViewModal}
                                className="px-6 py-2.5 bg-slate-800 dark:bg-white text-white dark:text-slate-800 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DOMAIN MODAL (CREATE & EDIT) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">
                                {editingDomain ? "Edit Domain" : "Create New Domain"}
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
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Domain Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="e.g. USER_MANAGEMENT"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 text-sm resize-none"
                                        placeholder="Brief description of the domain..."
                                    />
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
                                            <FiCheck size={16} /> {editingDomain ? "Update Domain" : "Create Domain"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ASSIGN PERMISSION MODAL */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                    <FiShield className="text-indigo-500" /> Assign Permissions
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Domain: <span className="text-indigo-600 dark:text-indigo-400">{assigningDomain?.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={closeAssignModal}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAssignSubmit} className="p-8 space-y-6">
                            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {isPermsLoading ? (
                                    <div className="flex justify-center py-10 text-slate-400 italic font-medium">Loading permissions...</div>
                                ) : allPermissions.length === 0 ? (
                                    <div className="flex justify-center py-10 text-slate-400 italic font-medium">No permissions found.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {allPermissions.map((perm) => {
                                            const isSelected = selectedPermissions.includes(perm.id);
                                            return (
                                                <div
                                                    key={perm.id}
                                                    onClick={() => handlePermissionToggle(perm.id)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${isSelected
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500'
                                                            : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:border-slate-200'
                                                        }`}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className={`text-[11px] font-black uppercase tracking-tight ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {perm.name}
                                                        </div>
                                                        <div className="text-[9px] font-mono text-slate-400">{perm.key}</div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                                                        }`}>
                                                        {isSelected && <FiCheck className="text-white" size={12} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {selectedPermissions.length} SELECTED
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={closeAssignModal}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase text-xs tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAssigning}
                                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isAssigning ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <FiPlus size={16} /> Assign Selected
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainPermission