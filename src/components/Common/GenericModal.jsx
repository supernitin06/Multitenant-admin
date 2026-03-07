import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";

const MODAL_SIZES = {
  SM: "max-w-md",
  MD: "max-w-lg",
  LG: "max-w-2xl",
  XL: "max-w-4xl",
  FULL: "max-w-7xl"
};

// Dark theme modal type styles
const MODAL_TYPE_STYLES = {
  DEFAULT: {
    bg: "#0d1523",
    border: "#1a2a40",
    headerBg: "rgba(10,18,32,0.8)",
  },
  SUCCESS: {
    bg: "#0d1523",
    border: "rgba(0,230,118,0.25)",
    headerBg: "rgba(0,230,118,0.06)",
  },
  WARNING: {
    bg: "#0d1523",
    border: "rgba(255,171,64,0.25)",
    headerBg: "rgba(255,171,64,0.06)",
  },
  ERROR: {
    bg: "#0d1523",
    border: "rgba(255,82,82,0.25)",
    headerBg: "rgba(255,82,82,0.06)",
  },
  INFO: {
    bg: "#0d1523",
    border: "rgba(64,196,255,0.25)",
    headerBg: "rgba(64,196,255,0.06)",
  },
};

export default function GenericModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "MD",
  type = "DEFAULT",
  showCloseButton = true,
  closeOnBackdrop = true,
  actions = [],
  className = "",
  icon
}) {
  if (!isOpen) return null;

  const sizeClasses = MODAL_SIZES[size] || MODAL_SIZES.MD;
  const typeStyle = MODAL_TYPE_STYLES[type] || MODAL_TYPE_STYLES.DEFAULT;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeIcon = () => {
    if (icon) return icon;
    const iconMap = {
      SUCCESS: <FiCheckCircle style={{ color: "#00e676" }} />,
      WARNING: <FiAlertTriangle style={{ color: "#ffab40" }} />,
      ERROR: <FiAlertTriangle style={{ color: "#ff5252" }} />,
      INFO: <FiInfo style={{ color: "#40c4ff" }} />,
    };
    return iconMap[type];
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: "rgba(4,8,14,0.85)", backdropFilter: "blur(12px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className={`${sizeClasses} w-full rounded-3xl overflow-hidden shadow-2xl ${className}`}
        style={{
          background: typeStyle.bg,
          border: `1px solid ${typeStyle.border}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 flex justify-between items-center"
          style={{
            background: typeStyle.headerBg,
            borderBottom: `1px solid ${typeStyle.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            {getTypeIcon()}
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] text-[#557a9a] font-mono mt-1 uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#557a9a" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,82,82,0.1)"; e.currentTarget.style.color = "#ff5252"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#557a9a"; }}
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div
            className="px-8 py-5 flex justify-end gap-3"
            style={{
              borderTop: `1px solid ${typeStyle.border}`,
              background: "rgba(8,13,20,0.5)",
            }}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${action.disabled ? "opacity-40 cursor-not-allowed" : ""} ${action.className || ""}`}
                style={action.primary
                  ? { background: "linear-gradient(135deg, #00e676, #00c853)", color: "#080d14", boxShadow: "0 0 20px rgba(0,230,118,0.25)" }
                  : { background: "rgba(255,255,255,0.06)", color: "#8bafc7", border: "1px solid #1a2a40" }
                }
              >
                {action.loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  action.label
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-configured modals
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false
}) => (
  <GenericModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type="WARNING"
    actions={[
      { label: cancelText, onClick: onClose },
      { label: confirmText, onClick: onConfirm, primary: true, loading, disabled: loading }
    ]}
  >
    <div className="text-center py-4">
      <FiAlertTriangle style={{ color: "#ffab40", fontSize: "2.5rem", margin: "0 auto 1rem" }} />
      <p style={{ color: "#8bafc7", fontSize: "14px" }}>{message}</p>
    </div>
  </GenericModal>
);

export const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message,
  buttonText = "OK"
}) => (
  <GenericModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type="SUCCESS"
    actions={[{ label: buttonText, onClick: onClose, primary: true }]}
  >
    <div className="text-center py-4">
      <FiCheckCircle style={{ color: "#00e676", fontSize: "2.5rem", margin: "0 auto 1rem" }} />
      <p style={{ color: "#8bafc7", fontSize: "14px" }}>{message}</p>
    </div>
  </GenericModal>
);

export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
  disabled = false
}) => (
  <GenericModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    subtitle={subtitle}
    actions={[
      { label: cancelText, onClick: onClose },
      { label: submitText, onClick: onSubmit, primary: true, loading, disabled: disabled || loading }
    ]}
  >
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {children}
    </form>
  </GenericModal>
);
