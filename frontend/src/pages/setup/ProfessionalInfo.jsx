import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProfessionalInfo.css";

const ProfessionalInfo = () => {
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [headline, setHeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (!role.trim()) return alert("Role is required");
    if (years === "" || months === "")
      return alert("Please enter your experience");
    if (Number(months) > 11)
      return alert("Months should be between 0 and 11");
    if (!headline.trim())
      return alert("Headline is required");

    try {
      setSaving(true);

      const res = await fetch(
        `${BACKEND_URL}/api/profile-setup/professional`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            role: role.trim(),
            experience: {
              years: Number(years),
              months: Number(months)
            },
            headline: headline.trim()
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save professional info");
      }

      navigate("/dashboard/profile/portfolio");
    } catch (err) {
      console.error("Professional info save failed:", err);
      alert("Failed to save professional info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-setup professional-info">
      <h2>Professional Information</h2>

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

      <label>One-line About You *</label>
      <input
        type="text"
        placeholder="UI/UX designer focused on SaaS and landing pages"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />

      <button onClick={handleNext} disabled={saving}>
        {saving ? "Saving..." : "Next"}
      </button>
    </div>
  );
};

export default ProfessionalInfo;
