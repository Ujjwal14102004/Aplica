import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PortfolioSocials.css";

// Icons
import githubIcon from "../../assets/GitHub.svg";
import dribbbleIcon from "../../assets/Dribbble.svg";
import behanceIcon from "../../assets/Behance.svg";
import linkedinIcon from "../../assets/LinkedIn.svg";
import facebookIcon from "../../assets/Facebook.svg";
import instagramIcon from "../../assets/Instagram.svg";
import twitterIcon from "../../assets/X.svg";
import driveIcon from "../../assets/Google Drive.svg";

const PortfolioSocials = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [links, setLinks] = useState({
    portfolio: "",
    github: "",
    dribbble: "",
    behance: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    twitter: "",
    drive: ""
  });

  // ✅ AUTH + FLOW GUARD
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

        // ⛔ Enforce onboarding order
        if (data.onboardingStep !== "portfolio-socials") {
          navigate(`/setup/${data.onboardingStep}`, { replace: true });
          return;
        }

        // Optional prefill
        if (data.portfolioSocials) {
          setLinks({
            portfolio: data.portfolioSocials.portfolio || "",
            github: data.portfolioSocials.github || "",
            dribbble: data.portfolioSocials.dribbble || "",
            behance: data.portfolioSocials.behance || "",
            linkedin: data.portfolioSocials.linkedin || "",
            facebook: data.portfolioSocials.facebook || "",
            instagram: data.portfolioSocials.instagram || "",
            twitter: data.portfolioSocials.twitter || "",
            drive: data.portfolioSocials.drive || ""
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [navigate, BACKEND_URL]);

  const handleChange = (key, value) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        `${BACKEND_URL}/api/profile/portfolio-socials`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            portfolio: links.portfolio || null,
            github: links.github || null,
            dribbble: links.dribbble || null,
            behance: links.behance || null,
            linkedin: links.linkedin || null,
            facebook: links.facebook || null,
            instagram: links.instagram || null,
            twitter: links.twitter || null,
            drive: links.drive || null,
            onboardingStep: "attachments"
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save portfolio links");
      }

      navigate("/setup/attachments");
    } catch (err) {
      console.error("Portfolio save failed:", err);
      alert("Failed to save portfolio links");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="portfolio-socials">
      <h2>Portfolio & Socials</h2>
      <p>Add links to your work or social profiles (optional)</p>

      <div className="portfolio-main">
        <input
          type="url"
          placeholder="https://yourportfolio.com"
          value={links.portfolio}
          onChange={(e) => handleChange("portfolio", e.target.value)}
        />
        <span className="add-link">+ Add Another Link</span>
      </div>

      <div className="social-grid">
        <SocialInput icon={githubIcon} placeholder="Github" value={links.github} onChange={(v) => handleChange("github", v)} />
        <SocialInput icon={dribbbleIcon} placeholder="Dribbble" value={links.dribbble} onChange={(v) => handleChange("dribbble", v)} />
        <SocialInput icon={behanceIcon} placeholder="Behance" value={links.behance} onChange={(v) => handleChange("behance", v)} />
        <SocialInput icon={linkedinIcon} placeholder="LinkedIn" value={links.linkedin} onChange={(v) => handleChange("linkedin", v)} />
        <SocialInput icon={facebookIcon} placeholder="Facebook" value={links.facebook} onChange={(v) => handleChange("facebook", v)} />
        <SocialInput icon={instagramIcon} placeholder="Instagram" value={links.instagram} onChange={(v) => handleChange("instagram", v)} />
        <SocialInput icon={twitterIcon} placeholder="X / Twitter" value={links.twitter} onChange={(v) => handleChange("twitter", v)} />
        <SocialInput icon={driveIcon} placeholder="Google Drive" value={links.drive} onChange={(v) => handleChange("drive", v)} />
      </div>

      <button onClick={handleNext} disabled={saving}>
        {saving ? "Saving..." : "Next"}
      </button>
    </div>
  );
};

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="social-input">
    <img src={icon} alt={placeholder} />
    <input
      type="url"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default PortfolioSocials;
