import { useNavigate } from "react-router-dom";
import { FaUsers, FaArrowRight } from "react-icons/fa";
import { GiVillage } from "react-icons/gi";
import { MdApartment, MdLocationCity } from "react-icons/md";

const TARIKERE_AREAS = [
  { key: "gramapanchayath", label: "ತರೀಕೆರೆ ತಾಲ್ಲೂಕು", icon: <GiVillage size={28} />, color: "#2466d1", bg: "#eff6ff", border: "#bfdbfe", path: "/apps/sangha/tarikere/gramapanchayath" },
  { key: "purasabha",       label: "ಪುರಸಭೆ ತರೀಕೆರೆ",         icon: <MdLocationCity size={28} />, color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", path: "/apps/sangha/tarikere/purasabha" },
];

const AJJAMPURA_AREAS = [
  { key: "gramapanchayath", label: "ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು", icon: <GiVillage size={28} />, color: "#2466d1", bg: "#eff6ff", border: "#bfdbfe", path: "/apps/sangha/ajjampura/gramapanchayath" },
  { key: "patana",          label: "ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ", icon: <MdApartment size={28} />, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", path: "/apps/sangha/ajjampura/patana" },
];

export default function SanghaDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "calc(100vh - 158px)", background: "#f0f4f8", fontFamily: "'Segoe UI','Noto Sans Kannada',sans-serif", padding: "20px 16px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#2466d1,#06b6d4)", color: "#fff", marginBottom: 12, boxShadow: "0 8px 24px rgba(36,102,209,0.3)" }}>
          <FaUsers size={26} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1a3d7c" }}>ಭಾರತ ಜೋಡೋ ಯುವ ಸಂಘ</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ</div>
      </div>

      {/* Tarikere Taluk */}
      <TalukSection title="ತರೀಕೆರೆ ತಾಲ್ಲೂಕು" areas={TARIKERE_AREAS} navigate={navigate} />

      {/* Ajjampura Taluk */}
      <TalukSection title="ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು" areas={AJJAMPURA_AREAS} navigate={navigate} />
    </div>
  );
}

function TalukSection({ title, areas, navigate }: { title: string; areas: typeof TARIKERE_AREAS; navigate: any }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "16px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a3d7c", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
        📍 {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        {areas.map(area => (
          <div
            key={area.key}
            onClick={() => navigate(area.path)}
            style={{ background: area.bg, border: `1.5px solid ${area.border}`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 14 }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          >
            <div style={{ color: area.color, flexShrink: 0 }}>{area.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: area.color }}>{area.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>ಸಂಘಗಳ ಪಟ್ಟಿ ನೋಡಿ</div>
            </div>
            <FaArrowRight size={13} style={{ color: area.color, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
