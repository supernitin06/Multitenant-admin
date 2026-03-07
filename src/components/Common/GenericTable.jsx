import React, { useState, Fragment } from "react";
import { FiEdit3, FiTrash2, FiChevronDown, FiChevronUp, FiRefreshCw, FiCpu } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function GenericTable({
  config,
  data,
  loading,
  handlers,
  customComponents = {},
  expandedRows = {},
  onToggleExpand,
  additionalActions = []
}) {
  // Debug logs
  console.log("=== GENERIC TABLE DEBUG ===");
  console.log("Config:", config);
  console.log("Data:", data);
  console.log("Data length:", data?.length);
  console.log("Loading:", loading);
  console.log("Handlers:", handlers);

  if (!config) {
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-2xl font-bold uppercase text-xs" style={{ borderColor: 'rgba(255,82,82,0.3)', background: 'rgba(255,82,82,0.06)', color: '#ff5252' }}>
        Table Configuration Missing (Prop: config)
      </div>
    );
  }
  const [expandedItems, setExpandedItems] = useState(expandedRows || {});

  const handleToggleExpand = (id) => {
    const newExpanded = { ...expandedItems };
    newExpanded[id] = !newExpanded[id];
    setExpandedItems(newExpanded);
    if (onToggleExpand) onToggleExpand(id, newExpanded[id]);
  };

  const renderCell = (item, column) => {
    const value = item[column.key];

    // Custom cell renderer
    if (customComponents[column.key]) {
      return customComponents[column.key](item, value);
    }

    // Default cell renderers based on type
    if (column.type === 'status') {
      return (
        <span
          className="text-[9px] font-bold px-2.5 py-1 rounded-lg"
          style={value
            ? { background: 'rgba(0,230,118,0.12)', color: '#00e676', border: '1px solid rgba(0,230,118,0.25)' }
            : { background: 'rgba(255,82,82,0.12)', color: '#ff5252', border: '1px solid rgba(255,82,82,0.25)' }
          }
        >
          {value ? column.activeText || "Active" : column.inactiveText || "Disabled"}
        </span>
      );
    }

    if (column.type === 'price') {
      return (
        <div className="font-bold text-white text-sm">
          ₹{value}
        </div>
      );
    }

    if (column.type === 'duration') {
      return (
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <FiClock size={10} className="text-emerald-500" /> {value} Days
        </div>
      );
    }

    if (column.type === 'custom') {
      return column.render ? column.render(item, value) : value;
    }

    if (column.type === 'expandable') {
      return column.render ? column.render(item, value) : value;
    }

    // Default text rendering
    return (
      <div className="font-medium text-[#8bafc7] text-[13px]">
        {value}
      </div>
    );
  };

  const renderActions = (item) => {
    if (!config.actions) return null;

    return (
      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        {config.actions.map((action, index) => {
          if (action.type === 'edit') {
            return (
              <button
                key={index}
                onClick={() => handlers[action.handler](item)}
                className="p-2 rounded-lg transition-all"
                style={{ background: 'rgba(0,172,193,0.1)', color: '#00acc1', border: '1px solid rgba(0,172,193,0.2)' }}
              >
                <FiEdit3 size={13} />
              </button>
            );
          }

          if (action.type === 'view') {
            return (
              <button
                key={index}
                onClick={() => handlers[action.handler](item)}
                className="p-2 rounded-lg transition-all"
                style={{ background: 'rgba(124,106,247,0.1)', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.2)' }}
              >
                <FiCpu size={13} />
              </button>
            );
          }

          if (action.type === 'delete') {
            return (
              <button
                key={index}
                onClick={() => handlers[action.handler](item)}
                className="p-2 rounded-lg transition-all"
                style={{ background: 'rgba(255,82,82,0.1)', color: '#ff5252', border: '1px solid rgba(255,82,82,0.2)' }}
              >
                <FiTrash2 size={13} />
              </button>
            );
          }

          if (action.type === 'custom') {
            return (
              <button
                key={index}
                onClick={(e) => handlers[action.handler](item, e)}
                className={action.className || "p-2.5  text-black hover:text-emerald-600 bg-slate-100 dark:bg-slate-700 rounded-xl transition-all"}
              >
                {action.icon}
              </button>
            );
          }

          return null;
        })}

        {additionalActions.map((action, index) => (
          <button
            key={`extra-${index}`}
            onClick={(e) => action.handler(item, e)}
            className={action.className || "p-2.5 bg-white dark:bg-slate-900 text-slate-400 hover:text-emerald-500 rounded-xl border border-slate-100 dark:border-slate-700 transition-all"}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  };

  const renderExpandedContent = (item) => {
    if (!config.expandedContent) return null;

    return (
      <tr>
        <td colSpan={config.columns.length + 2} className="px-12 py-8 bg-slate-50/50 dark:bg-slate-900/40 border-l-4 border-emerald-500">
          {config.expandedContent(item)}
        </td>
      </tr>
    );
  };

  return (
    <>
      <Toaster toastOptions={{ style: { background: '#0d1523', color: '#fff', border: '1px solid #1a2a40', borderRadius: '12px', fontSize: '12px' } }} />

      <div style={{ background: 'transparent' }} className="overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 flex justify-between items-center" style={{ background: 'rgba(13,21,35,0.5)', borderBottom: '1px solid #1a2a40' }}>
          <div className="flex items-center gap-2">
            {config.headerIcon}
            <h3 className="font-bold text-[#557a9a] uppercase text-[10px] tracking-[0.2em]">
              {config.title}
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#2a4060', borderBottom: '1px solid #1a2a40' }}>
                {config.columns.map((column, index) => (
                  <th key={index} className={`px-6 py-4 ${column.align === 'right' ? 'text-right' : ''}`}>
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 2} className="p-16 text-center" style={{ color: '#00e676' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#1a2a40', borderTopColor: '#00e676' }} />
                      <span className="text-[11px] font-semibold tracking-widest uppercase opacity-70">{config.loadingText || "Fetching Data..."}</span>
                    </div>
                  </td>
                </tr>
              ) : (data || []).map((item) => {
                const isExpanded = expandedItems[item.id || item._id];
                const itemId = item.id || item._id;

                return (
                  <Fragment key={itemId}>
                    <tr
                      className="transition-all cursor-default"
                      style={{
                        background: isExpanded ? 'rgba(0,230,118,0.04)' : 'transparent',
                        borderBottom: '1px solid rgba(26,42,64,0.5)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,230,118,0.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isExpanded ? 'rgba(0,230,118,0.04)' : 'transparent'; }}
                    >
                      {config.columns.map((column, index) => (
                        <td key={index} className={`px-6 py-4 ${column.align === 'right' ? 'text-center' : ''}`}>
                          {column.key === 'expandable' ? (
                            <div className="flex items-center gap-3">
                              {isExpanded
                                ? <FiChevronUp size={14} color="#00e676" />
                                : <FiChevronDown size={14} color="#2a4060" />}
                              <div className="cursor-pointer" onClick={() => handleToggleExpand(itemId)}>
                                {renderCell(item, column)}
                              </div>
                            </div>
                          ) : (
                            renderCell(item, column)
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        {renderActions(item)}
                      </td>
                    </tr>

                    {isExpanded && renderExpandedContent(item)}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
