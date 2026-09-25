import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
  fetchSessionStats,
  User,
} from "../../../api/users";
import { PageBreadcrumb } from "../../../components";
import { ALL_MENU_KEYS } from "../../../constants/menu";

/* ─────────────────────────────────────────
   MODAL
───────────────────────────────────────── */
const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
    <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[94vh] overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({ label, value, icon, color }: any) => (
  <div className={`rounded-xl p-1 flex items-center gap-3 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color}`}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white/60 dark:bg-black/20 flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold leading-tight">{value}</p>
      <p className="text-xs opacity-75 truncate">{label}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   BADGE
───────────────────────────────────────── */
const Badge = ({ active }: { active: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
      active
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
        : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
    {active ? "Active" : "Inactive"}
  </span>
);

/* ─────────────────────────────────────────
   ROLE BADGE
───────────────────────────────────────── */
const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    superadmin: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700",
    admin:      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700",
    user:       "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-700",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${styles[role] || styles.user}`}>
      {role}
    </span>
  );
};

/* ─────────────────────────────────────────
   AVATAR
───────────────────────────────────────── */
const Avatar = ({ name, size = "md" }: { name: string; size?: "sm" | "md" }) => {
  const colors = ["bg-blue-500","bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-indigo-500"];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  const sz  = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} ${colors[idx]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {(name?.[0] || "U").toUpperCase()}
    </div>
  );
};

/* ─────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────── */
const Field = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const iCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";
const iErr = " border-red-400 focus:ring-red-300";

/* ─────────────────────────────────────────
   FORM BODY — defined OUTSIDE main component
   so it never remounts on parent re-render
───────────────────────────────────────── */
interface FormBodyProps {
  isEdit?: boolean;
  form: typeof EMPTY_FORM;
  errors: FormErrors;
  submitErr: string;
  showPw: boolean;
  setShowPw: (v: boolean) => void;
  onChange: (k: keyof typeof EMPTY_FORM, v: any) => void;
}

const FormBody = ({ isEdit, form, errors, submitErr, showPw, setShowPw, onChange }: FormBodyProps) => (
  <div className="space-y-4">
    {/* Name */}
    <div className="grid grid-cols-2 gap-3">
      <Field label="First Name" required error={errors.first_name}>
        <input
          value={form.first_name}
          onChange={e => onChange("first_name", e.target.value)}
          className={iCls + (errors.first_name ? iErr : "")}
          placeholder=""
          autoComplete="off"
        />
      </Field>
      <Field label="Last Name">
        <input
          value={form.last_name}
          onChange={e => onChange("last_name", e.target.value)}
          className={iCls}
          placeholder=""
          autoComplete="off"
        />
      </Field>
    </div>

    {/* Phone */}
    <Field label="Phone Number" required error={errors.phone_no}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">📱</span>
        <input
          value={form.phone_no}
          onChange={e => onChange("phone_no", e.target.value.replace(/\D/g, "").slice(0, 10))}
          className={iCls + " pl-9" + (errors.phone_no ? iErr : "")}
          placeholder=""
          inputMode="numeric"
          maxLength={10}
          autoComplete="off"
        />
      </div>
    </Field>

    {/* Email */}
    <Field label="Email" error={errors.email}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">✉️</span>
        <input
          value={form.email}
          onChange={e => onChange("email", e.target.value)}
          className={iCls + " pl-9" + (errors.email ? iErr : "")}
          placeholder=""
          type="email"
          autoComplete="off"
        />
      </div>
    </Field>

    {/* Password */}
    <Field label={isEdit ? "New Password" : "Password"} required={!isEdit} error={errors.password}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">🔒</span>
        <input
          value={form.password}
          onChange={e => onChange("password", e.target.value)}
          className={iCls + " pl-9 pr-10" + (errors.password ? iErr : "")}
          type={showPw ? "text" : "password"}
          placeholder={isEdit ? "ಬದಲಾಯಿಸಬೇಕಾದ್ರೆ ಹಾಕಿ" : "Min 6 characters"}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-sm"
          tabIndex={-1}
        >
          {showPw ? "🙈" : "👁️"}
        </button>
      </div>
    </Field>

    {/* Role */}
    <Field label="Role">
      <div className="grid grid-cols-2 gap-2">
        {(["user", "admin"] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => onChange("role", r)}
            className={`py-2.5 rounded-xl text-sm font-medium border transition ${
              form.role === r
                ? r === "admin"
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-sky-600 text-white border-sky-600"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300"
            }`}
          >
            {r === "admin" ? "👑 Admin" : "👤 User"}
          </button>
        ))}
      </div>
    </Field>

    {/* Address */}
    <Field label="Address">
      <div className="relative">
        <span className="absolute left-3.5 top-3 text-gray-400 text-sm select-none pointer-events-none">📍</span>
        <textarea
          value={form.address}
          onChange={e => onChange("address", e.target.value)}
          className={iCls + " pl-9 resize-none"}
          rows={2}
          placeholder="ವಿಳಾಸ ಹಾಕಿ (optional)"
        />
      </div>
    </Field>

    {/* Allowed Menus */}
    {form.role === "user" && (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            📋 Sidebar Menus
          </label>
          <div className="flex gap-3 text-xs">
            <button type="button" onClick={() => onChange("allowedMenus", ALL_MENU_KEYS.map(m => m.key))} className="text-primary font-medium hover:underline">
              ಎಲ್ಲ Select
            </button>
            <button type="button" onClick={() => onChange("allowedMenus", [])} className="text-red-500 font-medium hover:underline">
              Clear
            </button>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
          <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {ALL_MENU_KEYS.map(m => (
              <label key={m.key} className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <input
                  type="checkbox"
                  checked={form.allowedMenus.includes(m.key)}
                  onChange={() => onChange("allowedMenus",
                    form.allowedMenus.includes(m.key)
                      ? form.allowedMenus.filter(k => k !== m.key)
                      : [...form.allowedMenus, m.key]
                  )}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">{m.label}</span>
              </label>
            ))}
          </div>
        </div>
        <p className="text-xs mt-1.5 text-gray-400">
          {form.allowedMenus.length === 0
            ? "⚠️ ಯಾವ menu select ಆಗಿಲ್ಲ — ಎಲ್ಲ menus ಕಾಣ್ತಾರೆ"
            : `✅ ${form.allowedMenus.length} / ${ALL_MENU_KEYS.length} menus selected`}
        </p>
      </div>
    )}

    {/* Submit error */}
    {submitErr && (
      <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm rounded-xl px-3.5 py-3">
        <span className="flex-shrink-0">⚠️</span>
        <span>{submitErr}</span>
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
const EMPTY_FORM = {
  first_name: "", last_name: "", phone_no: "", email: "",
  password: "", role: "user", address: "", allowedMenus: [] as string[],
};
type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

/* ═════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════ */
const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, stats, loading } = useSelector((s: RootState) => (s as any).users || {});

  const [showCreate,   setShowCreate]   = useState(false);
  const [editUser,     setEditUser]     = useState<User | null>(null);
  const [delUser,      setDelUser]      = useState<User | null>(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitErr,    setSubmitErr]    = useState("");
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPw,       setShowPw]       = useState(false);
  const [viewOnline,   setViewOnline]   = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSessionStats());
  }, []);

  /* ── Lock background scroll while any modal is open.
     Without this, the page (and the sidebar shell around it) keeps
     scrolling behind the modal, which is what makes the sidebar look
     like it "jumps up" / scroll feels broken. ── */
  useEffect(() => {
    const isModalOpen = showCreate || !!editUser || !!delUser;
    if (!isModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showCreate, editUser, delUser]);

  /* ── Field change handler — passed as prop to FormBody ── */
  const handleChange = (k: keyof typeof EMPTY_FORM, v: any) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitErr("");
    setShowPw(false);
  };

  /* ── Validation ── */
  const validate = (isEdit = false) => {
    const e: FormErrors = {};
    if (!form.first_name.trim())  e.first_name = "ಹೆಸರು ಬೇಕು";
    if (!form.phone_no.trim())    e.phone_no   = "Phone number ಬೇಕು";
    else if (!/^\d{10}$/.test(form.phone_no.trim())) e.phone_no = "10 digit phone number ಹಾಕಿ";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      if (form.email.trim()) e.email = "Valid email ಹಾಕಿ"; // only error if they typed something invalid
    }
    if (!isEdit && !form.password)         e.password = "Password ಬೇಕು";
    else if (!isEdit && form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleCreate = async () => {
    if (!validate()) return;
    setSubmitting(true); setSubmitErr("");
    try {
      await dispatch(createUser(form as any)).unwrap();
      setShowCreate(false); reset();
    } catch (e: any) { setSubmitErr(e || "Failed to create user"); }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    if (!editUser || !validate(true)) return;
    setSubmitting(true); setSubmitErr("");
    const payload: any = { ...form };
    if (!payload.password) delete payload.password;
    try {
      await dispatch(updateUser({ id: editUser._id, data: payload })).unwrap();
      setEditUser(null); reset();
    } catch (e: any) { setSubmitErr(e || "Update failed"); }
    setSubmitting(false);
  };

  const openEdit = (u: User) => {
    reset();
    setForm({
      first_name: u.first_name || "", last_name: u.last_name || "",
      phone_no: u.phone_no, email: u.email || "", password: "",
      role: u.role, address: u.address || "",
      allowedMenus: (u as any).allowedMenus || [],
    });
    setEditUser(u);
  };

  /* ── Filter ── */
  const filtered = (users || []).filter((u: User) => {
    const q = search.toLowerCase();
    const matchQ = !q || `${u.first_name} ${u.last_name} ${u.phone_no} ${u.email}`.toLowerCase().includes(q);
    const matchR = roleFilter === "all" || u.role === roleFilter;
    const matchS = statusFilter === "all"
      || (statusFilter === "active"   && u.isActive)
      || (statusFilter === "inactive" && !u.isActive);
    return matchQ && matchR && matchS;
  });

  /* ── Shared FormBody props ── */
  const formProps: FormBodyProps = { form, errors, submitErr, showPw, setShowPw, onChange: handleChange };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <PageBreadcrumb title="User Management" />

      {/*
        Layout mirrors the MLA-LADD page: a fixed-height shell that never
        scrolls itself (h-[calc(100vh-158px)] + overflow-hidden), a
        flex-shrink-0 block for stats/header/filters, and a flex-1 table
        card whose INNER scroll container is the only thing that scrolls.
        If 158px doesn't line up exactly with your topbar/breadcrumb height,
        nudge that one number — everything else adapts automatically.
      */}
      <div className="h-[calc(100vh-150px)] min-h-0 w-full max-w-7xl mx-auto flex flex-col overflow-hidden p-2 md:p-2">

        {/* Fixed top section: stats + header + filters */}
        <div className="flex-shrink-0 space-y-4 pb-5">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Users" value={stats?.total ?? 0} icon="👥"
              color="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700" />
            <StatCard label="Online Now" value={stats?.loggedIn ?? 0} icon="🟢"
              color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700" />
            <StatCard label="Deactivated" value={stats?.deactivated ?? 0} icon="🚫"
              color="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700" />
            <StatCard label="Showing" value={filtered.length} icon="🔍"
              color="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700" />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">User Management</h2>
              <p className="text-xs text-gray-400 mt-0.5">Users create, edit ಮತ್ತು manage ಮಾಡಿ</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {stats?.activeUsers?.length > 0 && (
                <button
                  onClick={() => setViewOnline(v => !v)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {stats.activeUsers.length} Online
                </button>
              )}
              <button
                onClick={() => { reset(); setShowCreate(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm shadow-primary/30"
              >
                <span className="text-base leading-none">+</span> ಹೊಸ User
              </button>
            </div>
          </div>

          {/* Online strip */}
          {viewOnline && stats?.activeUsers?.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-4">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mb-2.5">🟢 Currently Online</p>
              <div className="flex flex-wrap gap-2">
                {stats.activeUsers.map((u: any) => (
                  <span key={u._id} className="inline-flex items-center gap-2 bg-white dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-700">
                    <Avatar name={u.first_name} size="sm" />
                    {u.first_name} {u.last_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-2.5">
  {/* Search */}
  <div className="relative flex-1">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
      🔍
    </span>
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="ಹೆಸರು, phone, email ಮೂಲಕ search..."
      className={iCls + " pl-9"}
    />
  </div>

  {/* Filters */}
  <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-2.5">
    <select
      value={roleFilter}
      onChange={e => setRoleFilter(e.target.value)}
      className={iCls + " sm:w-36"}
    >
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>

    <select
      value={statusFilter}
      onChange={e => setStatusFilter(e.target.value)}
      className={iCls + " sm:w-36"}
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</div>
        </div>

        {/* Table card — flex-1, fills remaining height; only ITS inner
            container scrolls. The page shell above never scrolls. */}
        <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
              <p className="text-4xl mb-3">👤</p>
              <p className="text-sm font-medium">
                {search || roleFilter !== "all" || statusFilter !== "all"
                  ? "ಫಿಲ್ಟರ್ ಪ್ರಕಾರ users ಸಿಗಲಿಲ್ಲ"
                  : "ಇನ್ನೂ users ಇಲ್ಲ — New User ಮೂಲಕ add ಮಾಡಿ"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table — flex-1 + min-h-0 on the wrapper, overflow-auto
                  on the inner scroller, sticky header. Same recipe as
                  .ml-table-wrap / .ml-scroll on the MLA-LADD page. */}
              <div className="hidden md:flex md:flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-auto">
                  <table className="min-w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
                        {["User", "Phone", "Role", "Status", "Session", "Menus", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {filtered?.map((u: User) => (
                        <tr key={u._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={u.first_name} />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{u.first_name} {u.last_name}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[160px]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap font-mono">{u.phone_no}</td>
                          <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                          <td className="px-4 py-3"><Badge active={u.isActive} /></td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${(u as any).activeSessionDeviceId ? "text-emerald-500" : "text-gray-400"}`}>
                              {(u as any).activeSessionDeviceId ? "🟢 Online" : "⚫ Offline"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {u.role === "user"
                              ? <span className="text-xs text-gray-500">{(u as any).allowedMenus?.length ? `${(u as any).allowedMenus.length} menus` : "All access"}</span>
                              : <span className="text-xs text-violet-500 font-medium">Full</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(u)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Edit">✏️</button>
                              <button
                                onClick={() => dispatch(toggleUserActive({ id: u._id, isActive: !u.isActive }))}
                                className={`p-2 rounded-lg transition ${u.isActive ? "text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20" : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}
                                title={u.isActive ? "Deactivate" : "Activate"}
                              >
                                {u.isActive ? "🚫" : "✅"}
                              </button>
                              <button onClick={() => setDelUser(u)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards — same flex-1 + min-h-0 + overflow-y-auto pattern */}
              <div className="md:hidden flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((u: User) => (
                  <div key={u._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={u.first_name} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <Badge active={u.isActive} />
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-gray-500 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">{u.phone_no}</span>
                      <RoleBadge role={u.role} />
                      <span className={`text-xs font-medium ${(u as any).activeSessionDeviceId ? "text-emerald-500" : "text-gray-400"}`}>
                        {(u as any).activeSessionDeviceId ? "🟢 Online" : "⚫ Offline"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="flex-1 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition">✏️ Edit</button>
                      <button
                        onClick={() => dispatch(toggleUserActive({ id: u._id, isActive: !u.isActive }))}
                        className={`flex-1 py-2 text-xs font-medium rounded-xl transition ${u.isActive ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"}`}
                      >
                        {u.isActive ? "🚫 Deactivate" : "✅ Activate"}
                      </button>
                      <button onClick={() => setDelUser(u)} className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="flex-shrink-0 text-xs text-center text-gray-400 pt-3">
            {filtered.length} / {(users || []).length} users ತೋರಿಸ್ತಿದೆ
          </p>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal title="✨ New User ಸೇರಿಸಿ" onClose={() => { setShowCreate(false); reset(); }}>
          <FormBody {...formProps} />
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setShowCreate(false); reset(); }} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={submitting} className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:shadow-md transition-all duration-200 shadow-sm shadow-primary/30">
              {submitting
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</span>
                : "Submit"}
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <Modal title={`✏️ ${editUser.first_name} ${editUser.last_name}`} onClose={() => { setEditUser(null); reset(); }}>
          <FormBody {...formProps} isEdit />
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setEditUser(null); reset(); }} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium">
              Cancel
            </button>
            <button onClick={handleEdit} disabled={submitting} className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:shadow-md transition-all duration-200 shadow-sm shadow-primary/30">
              {submitting
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</span>
                : "Submit"}
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {delUser && (
        <Modal title="⚠️ Delete Confirm" onClose={() => setDelUser(null)}>
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto text-3xl">🗑️</div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{delUser.first_name} {delUser.last_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ಈ account ಶಾಶ್ವತವಾಗಿ delete ಆಗ್ತದೆ. ಖಚಿತವೇ?</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
              <p className="text-xs text-red-500 font-medium">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setDelUser(null)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={() => { dispatch(deleteUser(delUser._id)); setDelUser(null); }} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition shadow-sm shadow-red-300 dark:shadow-none">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserManagement;