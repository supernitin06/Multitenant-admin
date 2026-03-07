import { useState, useEffect } from "react";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  BeakerIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserGroupIcon,
  SparklesIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhotoIcon,
  PaintBrushIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { useCreateTenantMutation } from "../../api/tenants/tenant.api";

/* -------------------------------- ICON MAP -------------------------------- */

const TYPE_ICONS = {
  SCHOOL: <AcademicCapIcon className="w-5 h-5" />,
  COACHING: <UserGroupIcon className="w-5 h-5" />,
  CLINIC: <BeakerIcon className="w-5 h-5" />,
  PHARMACY: <SparklesIcon className="w-5 h-5" />,
  RETAIL: <ShoppingBagIcon className="w-5 h-5" />,
  RESTAURANT: <TruckIcon className="w-5 h-5" />,
  GYM: <SparklesIcon className="w-5 h-5" />,
  SALON: <SparklesIcon className="w-5 h-5" />,
};

/* -------------------------------- COMPONENT -------------------------------- */

export default function TenantForm({ initialData, onSubmit, submitting }) {
  const [showPassword, setShowPassword] = useState(false);
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantType: "SCHOOL",
    tenantUsername: "",
    tenantEmail: "",
    tenantPassword: "",
    tenantPhone: "",
    tenantAddress: "",
    tenantWebsite: "",
    logoUrl: "",
    faviconUrl: "",
    themeColor: "#1E40AF",
    isActive: true,
    role: "",
    subscription_planId: "",
  });

  /* ------------------------------- EDIT MODE ------------------------------- */

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        tenantPassword: "",
      });
    }
    // eslint-disable-next-line
  }, [initialData]);

  /* -------------------------------- HANDLERS -------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log("Submit");
    e.preventDefault();
    
    if (!initialData) {
      try {
        await createTenant(formData).unwrap();
        alert("Tenant created successfully!");
        setFormData({
          tenantName: "",
          tenantType: "SCHOOL",
          tenantUsername: "",
          tenantEmail: "",
          tenantPassword: "",
          tenantPhone: "",
          tenantAddress: "",
          tenantWebsite: "",
          logoUrl: "",
          faviconUrl: "",
          themeColor: "#1E40AF",
          isActive: true,
          role: "",
          subscription_planId: "",
        });
      } catch (err) {
        alert("Failed to create tenant: " + (err?.data?.message || err?.message));
      }
    } else {
      onSubmit(formData);
    }
  };

  const inputStyle = `
    w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-900/50 text-slate-900 dark:text-emerald-50
    focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500
    transition-all duration-200 outline-none text-sm
  `;

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Tenant Name */}
      <Input label="Organization Name" icon={BuildingOfficeIcon}>
        <input
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          required
          className={inputStyle}
        />
      </Input>

      {/* Business Type */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-emerald-500/60 ml-1">Business Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(TYPE_ICONS).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, tenantType: t }))}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all ${
                formData.tenantType === t 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20' 
                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-900/30'
              }`}
            >
              {TYPE_ICONS[t]}
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Username */}
      <Input label="Username" icon={IdentificationIcon}>
        <input
          name="tenantUsername"
          value={formData.tenantUsername}
          onChange={handleChange}
          required
          className={inputStyle}
        />
      </Input>

      {/* Email */}
      <Input label="Admin Email" icon={EnvelopeIcon}>
        <input
          name="tenantEmail"
          type="email"
          value={formData.tenantEmail}
          onChange={handleChange}
          required
          className={inputStyle}
        />
      </Input>

      {/* Password */}
      <Input label={initialData ? "New Password" : "Password"} icon={KeyIcon}>
        <input
          name="tenantPassword"
          type={showPassword ? "text" : "password"}
          value={formData.tenantPassword}
          onChange={handleChange}
          required={!initialData}
          className={inputStyle}
        />
        <ToggleEye show={showPassword} setShow={setShowPassword} />
      </Input>

      {/* Phone */}
      <Input label="Phone" icon={PhoneIcon}>
        <input
          name="tenantPhone"
          value={formData.tenantPhone}
          onChange={handleChange}
          className={inputStyle}
        />
      </Input>

      {/* Address */}
      <Input label="Address" icon={MapPinIcon}>
        <textarea
          name="tenantAddress"
          value={formData.tenantAddress}
          onChange={handleChange}
          className={inputStyle}
        />
      </Input>

      {/* Website */}
      <Input label="Website" icon={GlobeAltIcon}>
        <input
          name="tenantWebsite"
          value={formData.tenantWebsite}
          onChange={handleChange}
          className={inputStyle}
        />
      </Input>

      {/* Logo & Favicon */}
      <Input label="Logo URL" icon={PhotoIcon}>
        <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputStyle} />
      </Input>

      <Input label="Favicon URL" icon={PhotoIcon}>
        <input name="faviconUrl" value={formData.faviconUrl} onChange={handleChange} className={inputStyle} />
      </Input>

      {/* Theme */}
      <Input label="Theme Color" icon={PaintBrushIcon}>
        <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} />
      </Input>

      {/* Active */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((p) => ({ ...p, isActive: e.target.checked }))
          }
        />
        Active
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black"
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : (submitting ? "Processing..." : "Save Tenant")}
      </button>
    </form>
  );
}

/* ------------------------------- SUB COMPONENTS ------------------------------ */

const Input = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-emerald-500/60 ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
      {children}
    </div>
  </div>
);

const ToggleEye = ({ show, setShow }) => (
  <button
    type="button"
    onClick={() => setShow(!show)}
    className="absolute right-3 top-1/2 -translate-y-1/2"
  >
    {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
  </button>
);
