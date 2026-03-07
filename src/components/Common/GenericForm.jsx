import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Shared dark input style
const darkInput = {
  background: "#080d14",
  border: "1px solid #1a2a40",
  color: "#e2e8f0",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "13px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

const darkInputFocus = {
  borderColor: "rgba(0,230,118,0.4)",
  boxShadow: "0 0 0 3px rgba(0,230,118,0.08)",
};

// Input field with dark focus handling
const DarkInput = ({ style = {}, className = "", ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      className={className}
      style={{
        ...darkInput,
        ...(focused ? darkInputFocus : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const DarkTextarea = ({ style = {}, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...darkInput,
        resize: "none",
        ...(focused ? darkInputFocus : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const DarkSelect = ({ style = {}, children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      style={{
        ...darkInput,
        appearance: "none",
        cursor: "pointer",
        ...(focused ? darkInputFocus : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

export default function GenericForm({
  fields,
  onSubmit,
  submitText = "Submit",
  loading = false,
  disabled = false,
  className = "",
  initialValues = {}
}) {
  const [formData, setFormData] = useState(initialValues);
  const [showPasswords, setShowPasswords] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePassword = (name) => {
    setShowPasswords(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    const showPassword = showPasswords[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <DarkInput
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
          />
        );

      case "password":
        return (
          <div style={{ position: "relative" }}>
            <DarkInput
              type={showPassword ? "text" : "password"}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => togglePassword(field.name)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#557a9a",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        );

      case "textarea":
        return (
          <DarkTextarea
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
            rows={field.rows || 4}
          />
        );

      case "select":
        return (
          <DarkSelect
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={disabled}
          >
            <option value="" style={{ background: "#080d14", color: "#557a9a" }}>
              {field.placeholder || "-- Select --"}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} style={{ background: "#0d1523", color: "#e2e8f0" }}>
                {option.label}
              </option>
            ))}
          </DarkSelect>
        );

      case "radio":
        return (
          <div style={{ display: "flex", gap: "16px" }}>
            {field.options?.map((option) => (
              <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={disabled}
                  style={{ accentColor: "#00e676" }}
                />
                <span style={{ fontSize: "13px", color: "#8bafc7" }}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              name={field.name}
              checked={value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={disabled}
              style={{ accentColor: "#00e676", width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "13px", color: "#8bafc7" }}>{field.label}</span>
          </label>
        );

      case "color":
        return (
          <input
            type="color"
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={disabled}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "10px",
              border: "1px solid #1a2a40",
              background: "#080d14",
              cursor: "pointer",
              padding: "2px",
            }}
          />
        );

      case "file":
        return (
          <div>
            <input
              type="file"
              name={field.name}
              onChange={(e) => handleChange(field.name, e.target.files[0])}
              disabled={disabled}
              accept={field.accept}
              style={{
                ...darkInput,
                cursor: "pointer",
              }}
            />
            {field.hint && (
              <p style={{ fontSize: "11px", color: "#557a9a", marginTop: "4px" }}>{field.hint}</p>
            )}
          </div>
        );

      case "date":
        return (
          <DarkInput
            type="date"
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={disabled}
          />
        );

      case "custom":
        return field.render ? field.render(formData, handleChange, disabled) : null;

      default:
        return (
          <DarkInput
            type="text"
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      {fields.map((field) => (
        <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {field.label && field.type !== "checkbox" && (
            <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#00e676", opacity: 0.8 }}>
              {field.label}
              {field.required && <span style={{ color: "#ff5252", marginLeft: "4px" }}>*</span>}
            </label>
          )}
          {renderField(field)}
          {field.description && (
            <p style={{ fontSize: "11px", color: "#557a9a" }}>{field.description}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={disabled || loading}
        className="w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #00e676, #00c853)",
          color: "#080d14",
          fontSize: "12px",
          boxShadow: "0 0 20px rgba(0,230,118,0.2)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
}

// Field configuration helpers
export const createTextField = (config) => ({ type: "text", ...config });
export const createEmailField = (config) => ({ type: "email", ...config });
export const createPasswordField = (config) => ({ type: "password", ...config });
export const createSelectField = (config) => ({ type: "select", ...config });
export const createTextareaField = (config) => ({ type: "textarea", ...config });
export const createCheckboxField = (config) => ({ type: "checkbox", ...config });
