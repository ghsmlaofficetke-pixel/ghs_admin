import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { adminLoginAction, loginUser, verifyOtp, resetAuth } from "../../redux/actions";
import { AuthLayout, PageBreadcrumb } from "../../components";

type LoginMode = "select" | "admin" | "user" | "otp";

const phoneSchema = yup.object({ phone_no: yup.string().required("Phone required").matches(/^[0-9]{10}$/, "10 ಅಂಕಿ ಬೇಕು"), password: yup.string().required("Password required") });
const otpSchema   = yup.object({ otp: yup.string().required("OTP required").matches(/^[0-9]{6}$/, "6 ಅಂಕಿ OTP") });

const Login = () => {
  const dispatch     = useDispatch<AppDispatch>();
  const navigate     = useNavigate();
  const location     = useLocation();
  const redirectUrl  = location?.search?.slice(6) || "/";

  const { loading, error, userLoggedIn, user, otpSent, otpPhone } = useSelector((s: RootState) => (s as any).Auth);

  const [mode, setMode] = useState<LoginMode>("select");
  const [otpTimer, setOtpTimer] = useState(300);
  const [showPw, setShowPw]     = useState(false);

  const form    = useForm({ resolver: yupResolver(phoneSchema), defaultValues: { phone_no: "", password: "" } });
  const otpForm = useForm({ resolver: yupResolver(otpSchema),   defaultValues: { otp: "" } });

  useEffect(() => { dispatch(resetAuth()); }, []);
  useEffect(() => { if (otpSent) setMode("otp"); }, [otpSent]);
  useEffect(() => {
    if (userLoggedIn && user) navigate(redirectUrl, { replace: true });
  }, [userLoggedIn, user]);

  useEffect(() => {
    if (mode !== "otp") return;
    setOtpTimer(300);
    const id = setInterval(() => setOtpTimer(t => t <= 1 ? (clearInterval(id), 0) : t - 1), 1000);
    return () => clearInterval(id);
  }, [mode]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const onAdminSubmit = (d: any) => dispatch(adminLoginAction(d.phone_no, d.password));
  const onUserSubmit  = (d: any) => dispatch(loginUser(d.phone_no, d.password));
  const onOtpSubmit   = (d: any) => dispatch(verifyOtp(otpPhone || form.getValues("phone_no"), d.otp));

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm";
  const labelCls = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5";

  return (
    <>
      <PageBreadcrumb title="Login" />
      <AuthLayout
        authTitle={
          mode === "select" ? "GHS Office Login" :
          mode === "admin"  ? "Admin Login" :
          mode === "user"   ? "User Login" :
          "OTP Verify"
        }
        helpText={
          mode === "select" ? "ನೀವು Admin ಆಗಿದ್ದರೆ Admin Login, ಇಲ್ಲದಿದ್ದರೆ User Login ಒತ್ತಿ" :
          mode === "admin"  ? "Admin / SuperAdmin phone ಮತ್ತು password ಹಾಕಿ" :
          mode === "user"   ? "Phone ಮತ್ತು password ಹಾಕಿ — OTP Admin ಗೆ ಹೋಗ್ತದೆ" :
          "Admin ಹತ್ತಿರ OTP ಕೇಳಿ enter ಮಾಡಿ"
        }
        hasThirdPartyLogin={false}
      >

        {/* ── MODE SELECT ── */}
        {mode === "select" && (
          <div className="space-y-3 py-2">
            <button
              onClick={() => { dispatch(resetAuth()); form.reset(); setMode("admin"); }}
              className="w-full flex items-center gap-4 p-4 border-2 border-purple-200 dark:border-purple-700 rounded-2xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-2xl group-hover:scale-110 transition">👑</div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Admin / SuperAdmin Login</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Direct login — OTP ಬೇಡ</p>
              </div>
              <span className="ml-auto text-purple-400">→</span>
            </button>

            <button
              onClick={() => { dispatch(resetAuth()); form.reset(); setMode("user"); }}
              className="w-full flex items-center gap-4 p-4 border-2 border-blue-200 dark:border-blue-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl group-hover:scale-110 transition">👤</div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">User Login</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">OTP Admin ಗೆ ಹೋಗ್ತದೆ — confirm ಮಾಡಬೇಕು</p>
              </div>
              <span className="ml-auto text-blue-400">→</span>
            </button>
          </div>
        )}

        {/* ── ADMIN LOGIN FORM ── */}
        {mode === "admin" && (
          <form onSubmit={form.handleSubmit(onAdminSubmit)} className="space-y-4">
            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-3 mb-2">
              <span className="text-2xl">👑</span>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Admin / SuperAdmin Login</p>
            </div>

            <div>
              <label className={labelCls}>Phone Number *</label>
              <input {...form.register("phone_no")} type="tel" placeholder="10 ಅಂಕಿ ಮೊಬೈಲ್ ನಂಬರ್" className={inputCls} maxLength={10} />
              {form.formState.errors.phone_no && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone_no.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input {...form.register("password")} type={showPw ? "text" : "password"} placeholder="Password" className={inputCls + " pr-12"} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Logging in...</> : "🔐 Admin Login"}
            </button>

            <button type="button" onClick={() => { dispatch(resetAuth()); setMode("select"); }} className="w-full text-sm text-gray-500 hover:text-primary py-2 text-center">← Back</button>
          </form>
        )}

        {/* ── USER LOGIN FORM (step-1) ── */}
        {mode === "user" && (
          <form onSubmit={form.handleSubmit(onUserSubmit)} className="space-y-4">
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 mb-2">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">User Login</p>
                <p className="text-xs text-blue-500 dark:text-blue-400">OTP Admin ಗೆ ಹೋಗ್ತದೆ</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>Phone Number *</label>
              <input {...form.register("phone_no")} type="tel" placeholder="10 ಅಂಕಿ ಮೊಬೈಲ್ ನಂಬರ್" className={inputCls} maxLength={10} />
              {form.formState.errors.phone_no && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone_no.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input {...form.register("password")} type={showPw ? "text" : "password"} placeholder="Password" className={inputCls + " pr-12"} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> OTP ಕಳಿಸ್ತಿದ್ದೇವೆ...</> : "📱 Login & Get OTP"}
            </button>

            <button type="button" onClick={() => { dispatch(resetAuth()); setMode("select"); }} className="w-full text-sm text-gray-500 hover:text-primary py-2 text-center">← Back</button>
          </form>
        )}

        {/* ── OTP STEP ── */}
        {mode === "otp" && (
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300 text-sm">OTP Admin ಗೆ ಕಳಿಸಲಾಗಿದೆ!</p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-1">Admin ಹತ್ತಿರ OTP ಕೇಳಿ ಕೆಳಗೆ enter ಮಾಡಿ</p>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>6-Digit OTP *</label>
              <input
                {...otpForm.register("otp")}
                type="text" maxLength={6}
                placeholder="• • • • • •"
                className={inputCls + " text-center text-3xl tracking-[0.8em] font-mono"}
              />
              {otpForm.formState.errors.otp && <p className="text-red-500 text-xs mt-1">{otpForm.formState.errors.otp.message}</p>}
            </div>

            <div className="text-center">
              {otpTimer > 0
                ? <span className="text-sm text-gray-500">⏱️ OTP valid: <span className="font-semibold text-primary">{fmt(otpTimer)}</span></span>
                : <span className="text-sm text-red-500">⚠️ OTP expired — ಮತ್ತೆ login ಮಾಡಿ</span>
              }
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

            <button type="submit" disabled={loading || otpTimer === 0} className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</> : "✅ Verify OTP & Login"}
            </button>

            <button type="button" onClick={() => { dispatch(resetAuth()); setMode("user"); }} className="w-full text-sm text-gray-500 hover:text-primary py-2 text-center">← Back to Login</button>
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default Login;
