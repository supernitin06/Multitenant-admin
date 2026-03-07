import React, { useState } from 'react'
import { useGetSidebarQuery } from '../../api/platform/sidebar.api'
import { SidebarHeader } from '../../components/Common/GenericHeader'
import { CreateButton } from '../../components/Common/GenericButton'
import GenericTable from '../../components/Common/GenericTable'
import { FiLayout } from 'react-icons/fi'
import { Shield, X, Check } from 'lucide-react'

const Sidebar = () => {
    const { data: sidebarData, isLoading, error } = useGetSidebarQuery()
    const data = sidebarData?.sidebars || []

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSidebar, setSelectedSidebar] = useState(null)

    const handlers = {
        onEdit: (item) => console.log("Edit", item),
        onDelete: (item) => console.log("Delete", item),
        onView: (item) => {
            setSelectedSidebar(item)
            setIsModalOpen(true)
        }
    }

    const tableConfig = {
        title: "Sidebar Categories",
        headerIcon: <FiLayout className="text-indigo-500" />,
        loadingText: "Fetching Sidebar Structure...",
        columns: [
            {
                label: "ID",
                key: "id",
                type: "custom",
                render: (item, value) => (
                    <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                        #{String(value || item._id).substring(0, 8)}
                    </div>
                )
            },
            {
                label: "Sidebar Name",
                key: "name",
                type: "custom",
                render: (item, value) => (
                    <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
                        {value}
                    </div>
                )
            },
            {
                label: "Assignments",
                key: "assignToRole",
                type: "custom",
                render: (item, value) => (
                    <div className="flex -space-x-2">
                        {(value || []).slice(0, 3).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                                <Shield size={10} />
                            </div>
                        ))}
                        {(value || []).length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600">
                                +{(value || []).length - 3}
                            </div>
                        )}
                        {(value || []).length === 0 && (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No access</span>
                        )}
                    </div>
                )
            }
        ],
        actions: [
            { type: "view", handler: "onView" },
            { type: "edit", handler: "onEdit" },
            { type: "delete", handler: "onDelete" }
        ]
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500 font-bold uppercase">
                Error loading sidebar data: {error?.data?.message || error.message}
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-transparent">
            <SidebarHeader
                actions={[
                    <CreateButton key="create" onClick={() => console.log("Create Clicked")}>
                        Create Sidebar
                    </CreateButton>
                ]}
            />

            <GenericTable
                config={tableConfig}
                data={data}
                loading={isLoading}
                handlers={handlers}
            />

            {/* ROLES VISIBILITY MODAL */}
            {isModalOpen && selectedSidebar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    style={{ background: 'rgba(4,8,14,0.85)', backdropFilter: 'blur(12px)' }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        style={{ background: '#0d1523', border: '1px solid #1a2a40', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
                    >
                        {/* Modal Header */}
                        <div
                            className="px-7 py-5 flex justify-between items-center"
                            style={{ borderBottom: '1px solid #1a2a40', background: 'rgba(8,13,20,0.5)' }}
                        >
                            <div>
                                <h3 className="text-[13px] font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Shield size={15} style={{ color: '#7c6af7' }} />
                                    Access Control
                                </h3>
                                <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#557a9a' }}>
                                    Roles authorized for <span style={{ color: '#00acc1' }}>{selectedSidebar.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl transition-all"
                                style={{ background: 'rgba(255,255,255,0.04)', color: '#557a9a' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-7 max-h-[60vh] overflow-y-auto">
                            {selectedSidebar.assignToRole?.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedSidebar.assignToRole.map((assignment, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1a2a40' }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: 'rgba(124,106,247,0.1)', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.2)' }}
                                            >
                                                <Shield size={16} />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-[12px] font-bold text-white uppercase tracking-tight">
                                                    {assignment.platformRole?.name || "Unknown Role"}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-bold uppercase" style={{ color: '#2a4060' }}>
                                                        ID: {assignment.roleId.substring(0, 8)}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full" style={{ background: '#2a4060' }} />
                                                    <span className="text-[9px] font-bold uppercase" style={{ color: '#00e676' }}>
                                                        Authorized
                                                    </span>
                                                </div>
                                            </div>
                                            <Check size={13} style={{ color: '#00e676', opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className="py-12 text-center rounded-2xl border-2 border-dashed"
                                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: '#1a2a40' }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a2a40' }}
                                    >
                                        <X size={22} style={{ color: '#2a4060' }} />
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#557a9a' }}>
                                        No Access Granted
                                    </p>
                                    <p className="text-[9px] font-medium uppercase mt-1" style={{ color: '#2a4060' }}>
                                        This category is currently hidden from all roles.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div
                            className="px-7 py-4 text-right"
                            style={{ borderTop: '1px solid #1a2a40', background: 'rgba(8,13,20,0.3)' }}
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', color: '#8bafc7', border: '1px solid #1a2a40' }}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar