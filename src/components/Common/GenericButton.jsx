import React from "react";
import { FiEdit3, FiTrash2, FiPlus, FiRefreshCw, FiLayers, FiX, FiCheck, FiUpload, FiDownload } from "react-icons/fi";

const BUTTON_TYPES = {
  PRIMARY: "flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-[#080d14]",
  SECONDARY: "font-semibold rounded-xl text-white",
  DANGER: "font-semibold rounded-xl text-white",
  WARNING: "font-semibold rounded-xl text-[#080d14]",
  INFO: "font-semibold rounded-xl text-white",
  OUTLINE: "font-semibold rounded-xl text-[#8bafc7]",
  GHOST: "font-semibold rounded-xl text-[#557a9a]"
};

const BUTTON_SIZES = {
  SM: "px-3 py-1.5 text-xs",
  MD: "px-4 py-2 text-sm",
  LG: "px-6 py-3 text-base",
  XL: "px-8 py-4 text-lg"
};

const ICON_SIZES = {
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18
};

export default function GenericButton({
  type = "PRIMARY",
  size = "MD",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  children,
  onClick,
  className = "",
  ...props
}) {
  const baseClasses = `
    font-black uppercase tracking-widest transition-all duration-200 
    rounded-xl shadow-md hover:shadow-lg active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed
    inline-flex items-center justify-center gap-2
  `;

  const typeClasses = BUTTON_TYPES[type] || BUTTON_TYPES.PRIMARY;
  const sizeClasses = BUTTON_SIZES[size] || BUTTON_SIZES.MD;
  const iconSize = ICON_SIZES[size] || ICON_SIZES.MD;

  const renderIcon = () => {
    if (!icon) return null;

    const iconMap = {
      edit: <FiEdit3 size={iconSize} />,
      delete: <FiTrash2 size={iconSize} />,
      add: <FiPlus size={iconSize} />,
      refresh: <FiRefreshCw size={iconSize} className={loading ? "animate-spin" : ""} />,
      layers: <FiLayers size={iconSize} />,
      close: <FiX size={iconSize} />,
      check: <FiCheck size={iconSize} />,
      upload: <FiUpload size={iconSize} />,
      download: <FiDownload size={iconSize} />
    };

    return iconMap[icon] || icon;
  };

  const getInlineStyle = () => {
    switch (type) {
      case 'PRIMARY': return { background: 'linear-gradient(135deg, #00e676, #00c853)', boxShadow: '0 0 16px rgba(0,230,118,0.2)' };
      case 'SECONDARY': return { background: '#1a2a40', border: '1px solid #2a3a50' };
      case 'DANGER': return { background: 'rgba(255,82,82,0.15)', color: '#ff5252', border: '1px solid rgba(255,82,82,0.25)' };
      case 'WARNING': return { background: 'rgba(255,171,64,0.15)', color: '#ffab40', border: '1px solid rgba(255,171,64,0.25)' };
      case 'INFO': return { background: 'rgba(64,196,255,0.15)', color: '#40c4ff', border: '1px solid rgba(64,196,255,0.25)' };
      case 'OUTLINE': return { background: 'rgba(255,255,255,0.05)', border: '1px solid #1a2a40' };
      case 'GHOST': return { background: 'transparent' };
      default: return {};
    }
  };

  return (
    <button
      className={`${baseClasses} ${typeClasses} ${sizeClasses} ${className}`}
      style={getInlineStyle()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
}


// Button for creating a new role
// Button for creating a new role
export const CreateButton = ({ onClick, children = "Create New  Role", size = "MD", ...props }) => (
  <GenericButton
    type="PRIMARY"
    size={size}
    icon="add"
    onClick={onClick}
    {...props}
  >
    {children}
  </GenericButton>
);

// Alias for backward compatibility or specific styling preferences if needed
export const createButton = CreateButton;



// Pre-configured button variants
export const EditButton = ({ onClick, size = "MD", ...props }) => (
  <GenericButton
    type="PRIMARY"
    size={size}
    icon="edit"
    onClick={onClick}
    {...props}
  />
);

export const DeleteButton = ({ onClick, size = "MD", ...props }) => (
  <GenericButton
    type="PRIMARY"
    size={size}
    icon="delete"
    onClick={onClick}
    {...props}
  />
);

export const AddButton = ({ onClick, children = "Add New", size = "MD", ...props }) => (
  <GenericButton
    type="PRIMARY"
    size={size}
    icon="add"
    onClick={onClick}
    {...props}
  >
    {children}
  </GenericButton>
);

export const RefreshButton = ({ onClick, loading = false, size = "MD", ...props }) => (
  <GenericButton
    type="PRIMARY"
    size={size}
    icon="refresh"
    loading={loading}
    onClick={onClick}
    {...props}
  />
);

export const IconButton = ({ icon, onClick, size = "MD", type = "PRIMARY", ...props }) => (
  <GenericButton
    type={type}
    size={size}
    icon={icon}
    onClick={onClick}
    className="p-2.5"
    {...props}
  />
);

