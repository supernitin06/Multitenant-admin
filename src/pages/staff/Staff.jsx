import React, { useState } from 'react';
import { StaffHeader } from '../../components/Common/GenericHeader';
import { CreateButton } from '../../components/Common/GenericButton';
import GenericTable from '../../components/Common/GenericTable';
import { FiUsers, FiX } from 'react-icons/fi';
import { useGetStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation } from '../../api/platform/staff.api';
import { useGetRolesQuery } from '../../api/platform/role.api';
import { toast } from 'react-hot-toast';

export default function Staff() {

    // Hooks
    const { data: staffData, isLoading } = useGetStaffQuery();
    const staff = staffData?.staff || [];
    const { data: rolesData } = useGetRolesQuery();
    const roles = rolesData?.roles || [];

    const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
    const [deleteStaff] = useDeleteStaffMutation();

    // State for Confirm/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null); // null means creating

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        roleId: "",
        power: ""
    });

    const openCreateModal = () => {
        setEditingStaff(null);
        setFormData({ email: "", password: "", name: "", roleId: "", power: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (staffMember) => {
        setEditingStaff(staffMember);
        setFormData({
            email: staffMember.email || "",
            // Password is typically not pre-filled. 
            // If backend allows empty password to mean "no change", we can leave it blank.
            password: "",
            name: staffMember.name || "",
            roleId: staffMember.roleId || "",
            power: staffMember.power || ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.name || !formData.roleId || !formData.power) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // If creating, password is required. If updating, it might be optional depending on backend.
        if (!editingStaff && !formData.password) {
            toast.error("Password is required for new staff.");
            return;
        }

        try {
            const payload = {
                ...formData,
                power: Number(formData.power)
            };

            // If updating and password is empty, remove it from payload so we don't overwrite with empty string
            // (Assumes backend handles "undefined" or missing password as "no change")
            if (editingStaff && !payload.password) {
                delete payload.password;
            }

            if (editingStaff) {
                await updateStaff({ id: editingStaff.id, ...payload }).unwrap();
                toast.success("Staff updated successfully");
            } else {
                await createStaff(payload).unwrap();
                toast.success("Staff created successfully");
            }
            closeModal();
        } catch (err) {
            console.error(editingStaff ? "Failed to update staff" : "Failed to create staff", err);
            toast.error(err?.data?.message || (editingStaff ? "Failed to update staff" : "Failed to create staff"));
        }
    };

    const handleDelete = async (staffMember) => {
        if (!window.confirm(`Are you sure you want to delete ${staffMember.name}?`)) return;

        try {
            await deleteStaff(staffMember.id).unwrap();
            toast.success("Staff deleted successfully");
        } catch (err) {
            console.error("Failed to delete staff", err);
            toast.error(err?.data?.message || "Failed to delete staff");
        }
    };

    const tableConfig = {
        title: "All Staff",
        headerIcon: <FiUsers className="text-indigo-500" />,
        loadingText: "Loading Staff...",
        columns: [
            {
                label: "ID",
                key: "id",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] font-mono">
                        {value}
                    </div>
                )
            },
            {
                label: "Name",
                key: "name",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-700 dark:text-white text-xs font-bold">
                        {value}
                    </div>
                )
            },
            {
                label: "Email",
                key: "email",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {value}
                    </div>
                )
            },
            {
                label: "Role",
                key: "role",
                type: "custom",
                render: (item) => (
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase">
                        {item?.role?.name || "N/A"}
                    </div>
                )
            },
            {
                label: "Power",
                key: "power",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                        {value}
                    </div>
                )
            },
            {
                label: "Status",
                key: "isActive",
                type: "custom",
                render: (item, value) => (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${value === true
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {value ? "Active" : "Inactive"}
                    </span>
                )
            },
            {
                label: "Failed Logins",
                key: "failedLoginAttempts",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium text-center">
                        {value}
                    </div>
                )
            },
            {
                label: "Last Login",
                key: "lastLoginAt",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-400 dark:text-slate-500 text-[10px]">
                        {value ? new Date(value).toLocaleString() : '-'}
                    </div>
                )
            },
            {
                label: "Last Logout",
                key: "lastLogoutAt",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-400 dark:text-slate-500 text-[10px]">
                        {value ? new Date(value).toLocaleString() : '-'}
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
        onEdit: (staff) => openEditModal(staff),
        onDelete: (staff) => handleDelete(staff),
        onView: (staff) => console.log("View staff", staff)
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-900">
            <StaffHeader
                actions={[
                    <CreateButton children="Create Staff" key="create" onClick={openCreateModal} />
                ]}
            />
            <GenericTable
                config={tableConfig}
                data={staff}
                loading={isLoading}
                handlers={handlers}
            />

            {/* CREATE / EDIT STAFF MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">
                                {editingStaff ? "Edit Staff" : "Create New Staff"}
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
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                                        Password {editingStaff && <span className="text-slate-400 font-normal normal-case">(Leave blank to keep current)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingStaff}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder={editingStaff ? "Saved (Hidden)" : "••••••••"}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Role</label>
                                        <select
                                            required
                                            value={formData.roleId}
                                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                                        >
                                            <option value="">Select Role...</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Power</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={formData.power}
                                            onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                                            placeholder="0-100"
                                        />
                                    </div>
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
                                    className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isCreating || isUpdating ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            {editingStaff ? "Update Staff" : "Create Staff"}
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
}