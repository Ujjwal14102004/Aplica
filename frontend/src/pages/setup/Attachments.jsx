import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Attachments.css";

import attachmentIcon from "../../assets/attachment.svg";
import logo from "../../assets/logo.svg";

const Attachments = () => {
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert("Only PDF or Word documents are allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setFile(selected);
  };

  const handleFinish = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      if (file) {
        formData.append("file", file); // MUST be "file"
      }
      if (note.trim()) {
        formData.append("note", note.trim());
      }

      const res = await fetch(
        `${BACKEND_URL}/api/profile-setup/attachments`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      if (!res.ok) {
        throw new Error("Failed to complete onboarding");
      }

      navigate("/dashboard/home", { replace: true });
    } catch (err) {
      console.error("Finish setup failed:", err);
      alert("Failed to complete setup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="attachment-page">
      <img src={logo} alt="Applica" className="attachment-logo" />

      <h2>Attachment</h2>
      <p className="subtitle">
        Add any document you want to be attached in your mails
      </p>

      <div className="upload-box" onClick={handleFileClick}>
        <img src={attachmentIcon} alt="Upload" />
        <p className="upload-title">
          {file ? file.name : "Upload resume or any document"}
        </p>
        <span className="upload-hint">
          PDF, DOC, case study or notes (optional)
        </span>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      <div className="note-section">
        <label>Optional Note</label>
        <textarea
          placeholder="Anything else you want Applica to know?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button onClick={handleFinish} disabled={saving}>
        {saving ? "Finishing..." : "Finish Setup"}
      </button>
    </div>
  );
};

export default Attachments;
