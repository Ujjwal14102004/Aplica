import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProfessionalInfo.css";

import designerIcon from "../../assets/designer.svg";
import developerIcon from "../../assets/developer.svg";
import writerIcon from "../../assets/writer.svg";
import editorIcon from "../../assets/editor.svg";
import marketerIcon from "../../assets/marketer.svg";
import otherIcon from "../../assets/other.svg";

const categories = [
  { id: "designer", label: "Designer", icon: designerIcon },
  { id: "developer", label: "Developer", icon: developerIcon },
  { id: "writer", label: "Writer", icon: writerIcon },
  { id: "editor", label: "Editor", icon: editorIcon },
  { id: "marketer", label: "Marketer", icon: marketerIcon },
  { id: "other", label: "Other", icon: otherIcon }
];

const ProfessionalInfo = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ AUTH + FLOW GUARD (same as PublicProfile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
          credentials: "include"
        });

        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        // ⛔ Prevent skipping steps
        if (data.onboardingStep !== "professional-info") {
          navigate(`/setup/${data.onboardingStep}`, { replace: true });
          return;
        }

        // (Optional prefill – safe even if empty)
        if (data.professionalInfo) {
          setCategory(data.professionalInfo.category || "");
          setRole(data.professionalInfo.role || "");
          setYears(data.professionalInfo?.experience?.years ?? "");
          setMonths(data.professionalInfo?.experience?.months ?? "");
          setHeadline(data.professionalInfo.headline || "");
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [navigate, BACKEND_URL]);

  const handleNext = async () => {
    // 🔴 Validation (unchanged)
    if (!category) return alert("Please select a category");
    if (!role.trim()) return alert("Role is required");
    if (years === "" || months === "") return alert("Please enter your experience");
    if (Number(months) > 11) return alert("Months should be between 0 and 11");

    try {
      setLoading(true);

      const res = await fetch(
        `${BACKEND_URL}/api/profile/professional-info`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            category,
            role: role.trim(),
            experience: {
              years: Number(years),
              months: Number(months)
            },
            headline: headline.trim() || null,
            onboardingStep: "portfolio-socials"
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save professional info");
      }

      navigate("/setup/portfolio-socials");
    } catch (err) {
      console.error("Professional info save failed:", err);
      alert("Failed to save professional info");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-setup professional-info">
      <h2>Professional Information</h2>
      <p>What best describes your field?</p>

      <div className="category-grid">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`category-card ${category === item.id ? "active" : ""}`}
            onClick={() => setCategory(item.id)}
          >
            <img src={item.icon} alt={item.label} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <label>Your Role *</label>
      <input
        type="text"
        placeholder="UI Designer"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <label>Experience *</label>
      <div className="experience-row">
        <input
          type="number"
          min="0"
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <input
          type="number"
          min="0"
          max="11"
          placeholder="Months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />
      </div>

      <label>One-line About You (optional)</label>
      <input
        type="text"
        placeholder="UI/UX designer focused on SaaS and landing pages"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />

      <button onClick={handleNext} disabled={loading}>
        {loading ? "Saving..." : "Next"}
      </button>
    </div>
  );
};

export default ProfessionalInfo;
