import React, { useState } from "react";
import { RolesHeader } from "../../components/Common/GenericHeader";
import { CreateButton } from "../../components/Common/GenericButton";
import GenericTable from "../../components/Common/GenericTable";
import {
    useGetRolesQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useCreateRoleMutation,
    useAssignPlatformPermissionToRoleMutation
} from "../../api/platform/role.api";
import { useGetPermissionsQuery } from "../../api/platform/permission.api";
import { FiUsers, FiX, FiCheck, FiPlus, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Role = () => {
    const navigate = useNavigate();
    // API Queries/Mutations
    const { data: rolesData, isLoading } = useGetRolesQuery();
    const roles = rolesData?.data || rolesData?.roles || [];

    const { data: permsData, isLoading: isPermsLoading } = useGetPermissionsQuery();
    const allPermissions = permsData?.data || permsData?.permissions || [];

    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [assignPermissions, { isLoading: isAssigning }] = useAssignPlatformPermissionToRoleMutation();

    // State for CRUD Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: "", power: "", description: "" });

    // State for Assign Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningRole, setAssigningRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // --- CRUD Handlers ---
    const openCreateModal = () => {
        setEditingRole(null);
        setFormData({ name: "", power: "", description: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setFormData({
            name: role.name || "",
            power: role.power || "",
            description: role.description || ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
        setFormData({ name: "", power: "", description: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.power || !formData.description) {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            if (editingRole) {
                await updateRole({ id: editingRole.id, ...formData }).unwrap();
                toast.success("Role updated successfully");
            } else {
                await createRole(formData).unwrap();
                toast.success("Role created successfully");
            }
            closeModal();
        } catch (err) {
            console.error(editingRole ? "Update failed" : "Create failed", err);
            toast.error(err?.data?.message || err?.message || "Operation failed");
        }
    };

    const handleDelete = async (role) => {
        if (!window.confirm(`Delete role "${role.name}"?`)) return;
        try {
            await deleteRole(role.id).unwrap();
            toast.success("Role deleted successfully");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error(err?.data?.message || "Failed to delete role");
        }
    };

    // --- Assign Handlers ---
    const handleAssignPermission = (role) => {
        /*
        setAssigningRole(role);

        // Use a more robust way to extract existing permission IDs
        const existingPerms = (role.permissions || [])
            .map(p => {
                if (!p) return null;
                if (typeof p === 'string') return p;
                return p.id || p._id || p.permissionId || (p.permission?.id || p.permission?._id);
            })
            .filter(id => id !== null && id !== undefined);

        setSelectedPermissions(existingPerms);
        setIsAssignModalOpen(true);
        */
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setAssigningRole(null);
        setSelectedPermissions([]);
    };

    const handlePermissionToggle = (permId) => {
        setSelectedPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out any potential nulls/undefined values before sending
            const cleanPermissions = selectedPermissions.filter(id => id);

            await assignPermissions({
                roleId: assigningRole.id,
                permissions: cleanPermissions
            }).unwrap();
            toast.success("Permissions assigned successfully");
            closeAssignModal();
        } catch (err) {
            console.error("Assignment failed", err);
            toast.error(err?.data?.message || "Failed to assign permissions");
        }
    };

    // --- Table Config ---
    const tableConfig = {
        title: "System Roles",
        headerIcon: <FiUsers className="text-indigo-500" />,
        loadingText: "Loading Roles...",
        columns: [
            {
                label: "Role Name",
                key: "name",
                type: "custom",
                render: (item, value) => (
                    <div style={{ color: '#8bafc7', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                        {value}
                    </div>
                )
            },
            {
                label: "ID",
                key: "id",
                type: "custom",
                render: (item, value) => (
                    <div style={{ color: '#2a4060', fontSize: '10px', fontFamily: 'monospace' }}>
                        {value}
                    </div>
                )
            },
            {
                label: "Power",
                key: "power",
                type: "custom",
                render: (item, value) => (
                    <div
                        className="px-2 py-1 text-[10px] font-bold rounded w-fit"
                        style={{ background: 'rgba(0,172,193,0.1)', color: '#00acc1', border: '1px solid rgba(0,172,193,0.2)' }}
                    >
                        LVL {value}
                    </div>
                )
            },
            {
                label: "Description",
                key: "description",
                type: "custom",
                render: (item, value) => (
                    <div style={{ color: '#557a9a', fontSize: '12px', fontWeight: 500 }} className="line-clamp-1 max-w-[200px]">
                        {value}
                    </div>
                )
            },
            {
                label: "Permissions",
                key: "assignPermission",
                align: "right",
                type: "custom",
                render: (role) => (
                    <button
                        onClick={() => navigate("/role-based-access/roles")}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 dark:border-indigo-800"
                    >
                        Assign
                    </button>
                )
            }
        ],
        actions: [
            { type: "edit", handler: "onEdit" },
            { type: "delete", handler: "onDelete" }
        ]
    };

    const handlers = {
        onEdit: (role) => openEditModal(role),
        onDelete: (role) => handleDelete(role)
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen" style={{ background: 'transparent' }}>
            <RolesHeader
                actions={[
                    <CreateButton key="create" onClick={openCreateModal} />
                ]}
            />

            <GenericTable
                config={tableConfig}
                data={roles}
                loading={isLoading}
                handlers={handlers}
            />

            {/* ROLE MODAL */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    style={{ background: 'rgba(4,8,14,0.85)', backdropFilter: 'blur(12px)' }}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl overflow-hidden"
                        style={{ background: '#0d1523', border: '1px solid #1a2a40', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
                    >
                        <div
                            className="px-7 py-5 flex justify-between items-center"
                            style={{ borderBottom: '1px solid #1a2a40', background: 'rgba(8,13,20,0.5)' }}
                        >
                            <h3 className="text-[14px] font-bold text-white uppercase tracking-wide">
                                {editingRole ? "Edit Role" : "Create New Role"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-xl transition-all"
                                style={{ background: 'rgba(255,255,255,0.04)', color: '#557a9a' }}
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-7 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label
                                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                                        style={{ color: '#00e676', opacity: 0.8 }}
                                    >
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ background: '#080d14', border: '1px solid #1a2a40', color: '#e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', width: '100%' }}
                                        placeholder="e.g. SUPER_ADMIN"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                                        style={{ color: '#00e676', opacity: 0.8 }}
                                    >
                                        Power Level (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        value={formData.power}
                                        onChange={(e) => setFormData({ ...formData, power: Number(e.target.value) })}
                                        style={{ background: '#080d14', border: '1px solid #1a2a40', color: '#e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                                        style={{ color: '#00e676', opacity: 0.8 }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ background: '#080d14', border: '1px solid #1a2a40', color: '#8bafc7', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', width: '100%', resize: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wide transition-all"
                                    style={{ background: 'rgba(255,255,255,0.04)', color: '#8bafc7', border: '1px solid #1a2a40' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wide transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #00e676, #00c853)', color: '#080d14', boxShadow: '0 0 16px rgba(0,230,118,0.2)' }}
                                >
                                    <FiCheck size={14} /> {editingRole ? "Update Role" : "Create Role"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ASSIGN PERMISSIONS MODAL */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                    <FiShield className="text-indigo-500" /> Assign Permissions
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Role: <span className="text-indigo-600 dark:text-indigo-400">{assigningRole?.name}</span>
                                </p>
                            </div>
                            <button onClick={closeAssignModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="p-8 space-y-6">
                            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {isPermsLoading ? (
                                    <div className="flex justify-center py-10 text-slate-400 italic font-medium">Loading permissions...</div>
                                ) : allPermissions.length === 0 ? (
                                    <div className="flex justify-center py-10 text-slate-400 italic font-medium">No permissions found.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {allPermissions.map((perm) => {
                                            const pId = perm.id || perm._id;
                                            const isSelected = selectedPermissions.includes(pId);
                                            return (
                                                <div
                                                    key={pId}
                                                    onClick={() => handlePermissionToggle(pId)}
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
                                    <button type="button" onClick={closeAssignModal} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase text-xs tracking-wider">Cancel</button>
                                    <button type="submit" disabled={isAssigning} className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                                        {isAssigning ? "Processing..." : <><FiPlus size={16} /> Assign Selected</>}
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

export default Role;