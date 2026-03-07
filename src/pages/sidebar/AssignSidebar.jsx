import React, { useState } from 'react';
import {
    useGetSidebarQuery,
    useAssignSidebarToRoleMutation,
    useRemoveSidebarFromRoleMutation
} from '../../api/platform/sidebar.api';
import { useGetRolesQuery } from '../../api/platform/role.api';
import { AssignSidebarHeader } from '../../components/Common/GenericHeader';
import { CreateButton } from '../../components/Common/GenericButton';
import {
    Shield,
    LayoutGrid,
    Loader2,
    Check,
    X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AssignSidebar = () => {
    /* ================= API ================= */
    const {
        data: sidebarData,
        isLoading: isSidebarLoading,
        refetch: refetchSidebars
    } = useGetSidebarQuery();

    const {
        data: rolesData,
        isLoading: isRolesLoading,
        refetch: refetchRoles
    } = useGetRolesQuery();

    const [assignSidebar] = useAssignSidebarToRoleMutation();
    const [removeSidebar] = useRemoveSidebarFromRoleMutation();

    const sidebars = sidebarData?.sidebars || [];
    const roles = rolesData?.data || rolesData?.roles || [];

    /* ================= STATE ================= */
    const [togglingId, setTogglingId] = useState(null); // roleId-sidebarId

    /* ================= HELPERS ================= */
    const getId = (obj) => obj?.id || obj?._id;

    const isSidebarAssigned = (sidebar, roleId) => {
        // 1. Check inside Sidebar's assignToRole array (New Response Format)
        if (sidebar?.assignToRole && Array.isArray(sidebar.assignToRole)) {
            return sidebar.assignToRole.some(a => String(a.roleId) === String(roleId));
        }

        // 2. Fallback: Check inside Role's sidebar list (Old Format)
        const role = roles.find(r => String(getId(r)) === String(roleId));
        const assigned = role?.sidebars || role?.sidebarPermissions || [];
        if (!Array.isArray(assigned)) return false;

        return assigned.some(item => {
            const id = typeof item === 'object'
                ? (getId(item) || item?.sidebarId || getId(item?.sidebar))
                : item;
            return String(id) === String(getId(sidebar));
        });
    };

    /* ================= TOGGLE HANDLER ================= */
    const handleToggle = async (roleId, sidebarId) => {
        if (togglingId) return;

        const sidebar = sidebars.find(s => String(getId(s)) === String(sidebarId));
        const role = roles.find(r => String(getId(r)) === String(roleId));
        const isAssigned = isSidebarAssigned(sidebar, roleId);
        const uniqueKey = `${roleId}-${sidebarId}`;

        setTogglingId(uniqueKey);

        try {
            if (isAssigned) {
                await removeSidebar({ roleId, sidebarId }).unwrap();
                toast.success(`Removed ${sidebar?.name} from ${role?.name}`);
            } else {
                await assignSidebar({ roleId, sidebarId }).unwrap();
                toast.success(`Assigned ${sidebar?.name} to ${role?.name}`);
            }

            await refetchRoles();
            await refetchSidebars();
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || 'Failed to update assignment');
        } finally {
            setTogglingId(null);
        }
    };

    /* ================= LOADING ================= */
    if (isSidebarLoading || isRolesLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: '#1a2a40', borderTopColor: '#00e676' }} />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen" style={{ background: 'transparent' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#0d1523', color: '#fff', border: '1px solid #1a2a40', borderRadius: '12px' } }} />
            <AssignSidebarHeader
                actions={[
                    <CreateButton
                        key="refresh"
                        onClick={() => { refetchSidebars(); refetchRoles(); }}
                    >
                        Refresh Data
                    </CreateButton>
                ]}
            />

            <div
                className="mt-6 rounded-2xl overflow-hidden"
                style={{ background: '#0d1523', border: '1px solid #1a2a40' }}
            >
                {/* HEADER */}
                <div
                    className="p-6 flex justify-between items-center"
                    style={{ borderBottom: '1px solid #1a2a40', background: 'rgba(8,13,20,0.5)' }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="p-2.5 rounded-xl"
                            style={{ background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.2)', color: '#7c6af7' }}
                        >
                            <LayoutGrid size={18} />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-white uppercase tracking-wide">
                                Assignment Matrix
                            </h3>
                            <p className="text-[10px] text-[#557a9a] uppercase font-medium mt-0.5">
                                Roles vs Sidebars
                            </p>
                        </div>
                    </div>

                    <span
                        className="px-4 py-1.5 text-[10px] font-bold rounded-xl"
                        style={{ background: 'rgba(0,230,118,0.08)', color: '#00e676', border: '1px solid rgba(0,230,118,0.2)' }}
                    >
                        {sidebars.length} Sidebars × {roles.length} Roles
                    </span>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1a2a40' }}>
                                <th
                                    className="px-8 py-6 sticky left-0 z-10 min-w-[240px] text-left"
                                    style={{ background: '#0d1523', borderRight: '1px solid #1a2a40' }}
                                >
                                    <span className="text-[10px] font-bold text-[#2a4060] uppercase tracking-widest">
                                        Sidebars ↓ / Roles →
                                    </span>
                                </th>

                                {roles.map(role => (
                                    <th
                                        key={getId(role)}
                                        className="px-6 py-6 text-center min-w-[150px]"
                                        style={{ background: 'rgba(8,13,20,0.5)', borderRight: '1px solid #1a2a40' }}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                                style={{ background: 'rgba(0,172,193,0.1)', border: '1px solid rgba(0,172,193,0.2)', color: '#00acc1' }}
                                            >
                                                <Shield size={16} />
                                            </div>
                                            <span className="text-[11px] font-bold text-white uppercase">
                                                {role.name}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {sidebars.map(sidebar => (
                                <tr
                                    key={getId(sidebar)}
                                    style={{ borderBottom: '1px solid rgba(26,42,64,0.5)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td
                                        className="px-8 py-5 sticky left-0"
                                        style={{ background: '#0d1523', borderRight: '1px solid #1a2a40' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: 'rgba(124,106,247,0.1)', color: '#7c6af7' }}
                                            >
                                                <LayoutGrid size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-bold text-white uppercase">
                                                    {sidebar.name}
                                                </div>
                                                <div className="text-[9px] text-[#2a4060] font-mono mt-0.5">
                                                    {getId(sidebar)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {roles.map(role => {
                                        const roleId = getId(role);
                                        const sidebarId = getId(sidebar);
                                        const active = isSidebarAssigned(sidebar, roleId);
                                        const loading = togglingId === `${roleId}-${sidebarId}`;

                                        return (
                                            <td
                                                key={roleId}
                                                className="px-6 py-5 text-center"
                                                style={{ borderRight: '1px solid rgba(26,42,64,0.3)' }}
                                            >
                                                <button
                                                    disabled={loading}
                                                    onClick={() => handleToggle(roleId, sidebarId)}
                                                    className="relative inline-flex h-7 w-12 rounded-full transition-all"
                                                    style={{
                                                        background: active ? '#00e676' : '#1a2a40',
                                                        opacity: loading ? 0.5 : 1,
                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                        boxShadow: active ? '0 0 12px rgba(0,230,118,0.3)' : 'none',
                                                    }}
                                                >
                                                    <span
                                                        className="inline-flex h-5 w-5 bg-white rounded-full shadow transform transition items-center justify-center"
                                                        style={{
                                                            transform: active ? 'translateX(22px)' : 'translateX(2px)',
                                                            marginTop: '4px',
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <Loader2 size={10} className="animate-spin" style={{ color: '#00e676' }} />
                                                        ) : active ? (
                                                            <Check size={10} style={{ color: '#00e676' }} strokeWidth={3} />
                                                        ) : (
                                                            <X size={10} style={{ color: '#aaa' }} strokeWidth={3} />
                                                        )}
                                                    </span>
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!sidebars.length && (
                        <div className="py-20 text-center text-[11px] font-bold uppercase" style={{ color: '#2a4060' }}>
                            No sidebars found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignSidebar;
