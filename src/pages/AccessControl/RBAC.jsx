import React, { useState, useEffect } from 'react';
import { RoleBaseAccessControl } from '../../components/Common/GenericHeader';
import { CreateButton } from '../../components/Common/GenericButton';
import {
  Shield,
  ChevronRight,
  LayoutGrid,
  Lock,
  Loader2,
  Check,
  X
} from 'lucide-react';
import {
  useGetRolesQuery,
  useAssignRolePermissionMutation,
  useDeleteRolePermissionMutation
} from '../../api/platform/role.api';
import { useGetDomainPermissionsQuery } from '../../api/platform/domainPermission.api';
import toast from 'react-hot-toast';

const PermissionManager = () => {
  /* ================= API ================= */
  const { data: rolesData, isLoading: isRolesLoading, refetch: refetchRoles } = useGetRolesQuery();
  const { data: domainsData, isLoading: isDomainsLoading } =
    useGetDomainPermissionsQuery();
  const [assignPermission] = useAssignRolePermissionMutation();
  const [unassignPermission] = useDeleteRolePermissionMutation();

  const roles = rolesData?.data || rolesData?.roles || [];
  const domains = domainsData?.data || domainsData?.domains || [];

  console.log("RBAC Roles:", roles);
  console.log("RBAC Domains:", domains);

  /* ================= STATE ================= */
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [togglingId, setTogglingId] = useState(null); // Track which specific toggle is active

  useEffect(() => {
    if (domains.length && !selectedDomainId) {
      setSelectedDomainId(domains[0].id);
    }
  }, [domains, selectedDomainId]);

  const activeDomain = domains.find(d => d.id === selectedDomainId);
  const permissions = activeDomain?.permissions || [];

  /* ================= HELPERS ================= */
  const isPermissionAssigned = (role, permissionId) => {
    if (!role?.permissions || !Array.isArray(role.permissions)) return false;

    // DEBUG: Remove these logs once fixed
    // const assignedIds = role.permissions.map(p => typeof p === 'object' ? (p.id || p._id) : p);
    // if (role.name === 'DEVELOPER') { // Example log for one role
    //   console.log(`Checking Role: ${role.name}, PermID: ${permissionId}, Found:`, assignedIds);
    // }

    return role.permissions.some(p => {
      // Check every possible place an ID could hide
      const pId = typeof p === 'object'
        ? (p.id || p._id || p.permissionId || p.permission?.id || p.permission?._id)
        : p;
      return String(pId) === String(permissionId);
    });
  };

  const handleToggle = async (roleId, permissionId) => {
    const role = roles.find(r => r.id === roleId);
    const isAssigned = isPermissionAssigned(role, permissionId);

    const uniqueKey = `${roleId}-${permissionId}`;
    setTogglingId(uniqueKey);

    try {
      if (isAssigned) {
        await unassignPermission({ roleId, permissionId }).unwrap();
      } else {
        await assignPermission({ roleId, permissionId }).unwrap();
      }

      await refetchRoles();
      toast.success(isAssigned ? 'Permission removed' : 'Permission assigned');
    } catch (err) {
      console.error('Toggle failed:', err);
      toast.error(err?.data?.message || 'Failed to update permission');
    } finally {
      setTogglingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (isRolesLoading || isDomainsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: '#1a2a40', borderTopColor: '#00e676' }} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: 'transparent' }}>
      {/* HEADER */}
      <RoleBaseAccessControl
        actions={[
          <CreateButton key="refresh" onClick={() => window.location.reload()}>
            Refresh
          </CreateButton>
        ]}
      />

      <div className="flex gap-6 mt-6">
        {/* DOMAINS SIDEBAR */}
        <aside
          className="w-72 rounded-2xl p-5 sticky top-6 flex-shrink-0"
          style={{ background: '#0d1523', border: '1px solid #1a2a40', height: 'fit-content' }}
        >
          <p className="text-[10px] font-bold text-[#2a4060] uppercase tracking-widest mb-4">
            Domains
          </p>

          <div className="space-y-1.5">
            {domains.map(domain => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[12px] font-semibold transition-all"
                style={selectedDomainId === domain.id
                  ? { background: 'rgba(0,230,118,0.1)', color: '#00e676', border: '1px solid rgba(0,230,118,0.2)' }
                  : { background: 'transparent', color: '#557a9a', border: '1px solid transparent' }
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-1.5 rounded-lg"
                    style={selectedDomainId === domain.id
                      ? { background: 'rgba(0,230,118,0.15)', color: '#00e676' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#557a9a' }
                    }
                  >
                    <LayoutGrid size={14} />
                  </div>
                  <span className="uppercase text-[11px] tracking-wide">{domain.name}</span>
                </div>
                <ChevronRight size={13} className="opacity-50" />
              </button>
            ))}
          </div>
        </aside>

        {/* MATRIX */}
        <section
          className="flex-1 rounded-2xl overflow-hidden"
          style={{ background: '#0d1523', border: '1px solid #1a2a40' }}
        >
          {/* MATRIX HEADER */}
          <div
            className="p-5 flex justify-between items-center"
            style={{ borderBottom: '1px solid #1a2a40', background: 'rgba(8,13,20,0.5)' }}
          >
            <h3 className="font-bold text-[13px] text-white flex items-center gap-3">
              <Lock size={16} color="#00acc1" />
              Permission Matrix —{' '}
              <span style={{ color: '#00e676' }}>{activeDomain?.name}</span>
            </h3>

            <span
              className="px-3 py-1 text-[10px] font-bold rounded-lg"
              style={{ background: 'rgba(0,230,118,0.1)', color: '#00e676', border: '1px solid rgba(0,230,118,0.2)' }}
            >
              {permissions.length} Permissions
            </span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #1a2a40' }}>
                  {/* PERMISSION HEADER */}
                  <th
                    className="px-6 py-5 sticky left-0 z-20 min-w-[220px] text-left"
                    style={{ background: '#0d1523', borderRight: '1px solid #1a2a40' }}
                  >
                    <span className="text-[10px] font-bold text-[#2a4060] uppercase tracking-widest">
                      Permissions ↓ / Roles →
                    </span>
                  </th>

                  {/* ROLE COLUMNS */}
                  {roles.map(role => (
                    <th
                      key={role.id}
                      className="px-5 py-5 text-center min-w-[150px]"
                      style={{ background: 'rgba(8,13,20,0.5)', borderRight: '1px solid #1a2a40' }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(0,172,193,0.1)', border: '1px solid rgba(0,172,193,0.2)', color: '#00acc1' }}
                        >
                          <Shield size={14} />
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
                {permissions.map(permission => (
                  <tr
                    key={permission.id}
                    style={{ borderBottom: '1px solid rgba(26,42,64,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* PERMISSION CELL */}
                    <td
                      className="px-6 py-4 sticky left-0"
                      style={{ background: '#0d1523', borderRight: '1px solid #1a2a40' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(124,106,247,0.1)', color: '#7c6af7' }}
                        >
                          <LayoutGrid size={12} />
                        </div>
                        <div>
                          <span className="font-bold text-[11px] text-white uppercase block">
                            {permission.name}
                          </span>
                          <span className="text-[9px] text-[#2a4060] font-mono">
                            {permission.key}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* TOGGLES */}
                    {roles.map(role => {
                      const active = isPermissionAssigned(role, permission.id);
                      const isToggling = togglingId === `${role.id}-${permission.id}`;

                      return (
                        <td
                          key={role.id}
                          className="px-5 py-4 text-center"
                          style={{ borderRight: '1px solid rgba(26,42,64,0.3)' }}
                        >
                          <button
                            disabled={isToggling}
                            onClick={() => handleToggle(role.id, permission.id)}
                            className="relative inline-flex h-6 w-11 rounded-full transition-all"
                            style={{
                              background: active ? '#00e676' : '#1a2a40',
                              opacity: isToggling ? 0.5 : 1,
                              cursor: isToggling ? 'not-allowed' : 'pointer',
                              boxShadow: active ? '0 0 12px rgba(0,230,118,0.3)' : 'none',
                            }}
                          >
                            <span
                              className="inline-flex h-5 w-5 transform rounded-full shadow transition items-center justify-center"
                              style={{
                                background: 'white',
                                transform: active ? 'translateX(20px)' : 'translateX(2px)',
                                marginTop: '2px',
                              }}
                            >
                              {isToggling ? (
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

            {/* EMPTY STATE */}
            {!permissions.length && (
              <div className="p-20 text-center text-[11px] font-bold uppercase" style={{ color: '#2a4060' }}>
                No permissions available for this domain
              </div>
            )}
          </div>

          {/* LEGEND */}
          <div
            className="p-5 flex gap-6 text-[10px] font-bold uppercase"
            style={{ borderTop: '1px solid #1a2a40', background: 'rgba(8,13,20,0.3)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ background: '#00e676', boxShadow: '0 0 6px rgba(0,230,118,0.4)' }} />
              <span style={{ color: '#557a9a' }}>Authorized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#1a2a40]" />
              <span style={{ color: '#557a9a' }}>Forbidden</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PermissionManager;
