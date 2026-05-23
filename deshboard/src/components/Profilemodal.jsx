// src/components/ProfileModal.jsx
// Full-featured profile modal: view, edit, image upload, location, delete fields
// Calls PUT /api/user/profile — backend updates DB and returns fresh userInfo

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../api/authApi";
import { update_user_info } from "../store/Reducers/authReducer";
import toast from "react-hot-toast";

export default function ProfileModal({ onClose }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);
  const role = userInfo?.role?.toLowerCase() || "user";

  // ── form state ──────────────────────────────────────────────────────────────
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [location, setLocation] = useState(userInfo?.location || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "security"
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileRef = useRef();

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── helpers ─────────────────────────────────────────────────────────────────
  const getInitial = (n) => (n ? n.trim()[0].toUpperCase() : "?");

  const currentImage = preview
    ? preview
    : userInfo?.image && userInfo.image !== "user.png" && !userInfo.image.includes("user.png")
      ? (userInfo.image.startsWith("http") ? userInfo.image : `http://localhost:5001/${userInfo.image}`)
      : null;

  const ROLE_COLOR = { admin: "#ef4444", seller: "#f59e0b", user: "#6366f1" };
  const roleColor = ROLE_COLOR[role] || "#6366f1";

  // ── image pick ───────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── auto-detect location ─────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const state = data.address?.state || "";
          const country = data.address?.country || "";
          const loc = [city, state, country].filter(Boolean).join(", ");
          setLocation(loc);
          toast.success("Location detected!");
        } catch {
          toast.error("Could not reverse geocode");
        } finally {
          setDetectingLoc(false);
        }
      },
      () => { toast.error("Location access denied"); setDetectingLoc(false); }
    );
  };

  // ── save profile ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("location", location.trim());
      formData.append("phone", phone.trim());
      if (imageFile) formData.append("image", imageFile);

      const { data } = await authApi.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(update_user_info(data.userInfo));
      toast.success("Profile updated!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── change password ───────────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all password fields"); return;
    }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await authApi.put("/user/password", { oldPassword, newPassword }, { withCredentials: true });
      toast.success("Password changed!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // ── clear individual fields ───────────────────────────────────────────────────
  const clearField = (setter) => () => setter("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: pmFadeIn .2s ease;
        }
        @keyframes pmFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pm-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 32px 64px -12px rgba(0,0,0,0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: pmSlideUp .25s cubic-bezier(0.16,1,0.3,1);
          scrollbar-width: thin;
          scrollbar-color: #e4e4e7 transparent;
        }
        .pm-modal::-webkit-scrollbar { width: 4px; }
        .pm-modal::-webkit-scrollbar-track { background: transparent; }
        .pm-modal::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 2px; }

        @keyframes pmSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* header */
        .pm-header {
          padding: 24px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pm-title {
          font-size: 18px;
          font-weight: 800;
          color: #18181b;
          letter-spacing: -0.02em;
        }
        .pm-close {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: none;
          background: #f4f4f5;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #71717a;
          transition: all .15s ease;
        }
        .pm-close:hover { background: #e4e4e7; color: #18181b; }

        /* avatar zone */
        .pm-avatar-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 24px 0;
          gap: 10px;
        }
        .pm-avatar-wrap {
          position: relative;
          width: 88px; height: 88px;
          cursor: pointer;
        }
        .pm-avatar-wrap:hover .pm-avatar-overlay { opacity: 1; }
        .pm-avatar-img {
          width: 88px; height: 88px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--role-color, #6366f1);
        }
        .pm-avatar-letter {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: var(--role-color, #6366f1);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          font-weight: 800;
          border: 3px solid var(--role-color, #6366f1);
        }
        .pm-avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity .2s;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          flex-direction: column;
          gap: 3px;
        }
        .pm-avatar-actions {
          display: flex;
          gap: 8px;
        }
        .pm-avatar-btn {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid;
          transition: all .15s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .pm-avatar-btn-upload {
          border-color: var(--role-color, #6366f1);
          color: var(--role-color, #6366f1);
          background: transparent;
        }
        .pm-avatar-btn-upload:hover {
          background: var(--role-color, #6366f1);
          color: #fff;
        }
        .pm-avatar-btn-remove {
          border-color: #e4e4e7;
          color: #71717a;
          background: transparent;
        }
        .pm-avatar-btn-remove:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
        .pm-avatar-hint { font-size: 11px; color: #a1a1aa; }

        /* tabs */
        .pm-tabs {
          display: flex;
          gap: 4px;
          padding: 16px 24px 0;
          border-bottom: 1px solid #f4f4f5;
        }
        .pm-tab {
          padding: 8px 16px;
          border-radius: 8px 8px 0 0;
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #71717a;
          border-bottom: 2px solid transparent;
          transition: all .15s;
          margin-bottom: -1px;
        }
        .pm-tab:hover { color: #18181b; }
        .pm-tab.active {
          color: var(--role-color, #6366f1);
          border-bottom-color: var(--role-color, #6366f1);
        }

        /* form body */
        .pm-body { padding: 20px 24px; }

        .pm-field {
          margin-bottom: 14px;
        }
        .pm-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: .04em;
          margin-bottom: 6px;
        }
        .pm-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pm-input {
          width: 100%;
          padding: 10px 38px 10px 12px;
          border: 1.5px solid #e4e4e7;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #18181b;
          background: #fafafa;
          transition: border-color .15s, background .15s;
          outline: none;
          box-sizing: border-box;
        }
        .pm-input:focus {
          border-color: var(--role-color, #6366f1);
          background: #fff;
        }
        .pm-input-clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #a1a1aa;
          padding: 4px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          transition: color .15s, background .15s;
        }
        .pm-input-clear:hover { color: #ef4444; background: #fef2f2; }

        .pm-loc-row {
          display: flex; gap: 8px; align-items: flex-end;
        }
        .pm-loc-row .pm-input-wrap { flex: 1; }
        .pm-detect-btn {
          padding: 10px 14px;
          border: 1.5px solid #e4e4e7;
          border-radius: 10px;
          background: #fafafa;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #52525b;
          white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
          transition: all .15s;
          flex-shrink: 0;
        }
        .pm-detect-btn:hover:not(:disabled) {
          border-color: var(--role-color, #6366f1);
          color: var(--role-color, #6366f1);
          background: #fff;
        }
        .pm-detect-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* footer */
        .pm-footer {
          padding: 0 24px 24px;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .pm-btn-cancel {
          padding: 10px 20px;
          border-radius: 10px;
          border: 1.5px solid #e4e4e7;
          background: #fff;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #52525b;
          transition: all .15s;
        }
        .pm-btn-cancel:hover { background: #f4f4f5; }
        .pm-btn-save {
          padding: 10px 24px;
          border-radius: 10px;
          border: none;
          background: var(--role-color, #6366f1);
          color: #fff;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          transition: all .15s;
          display: flex; align-items: center; gap: 6px;
        }
        .pm-btn-save:hover:not(:disabled) { filter: brightness(1.08); }
        .pm-btn-save:disabled { opacity: 0.55; cursor: not-allowed; }

        .pm-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* role badge */
        .pm-role-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        .pm-section-divider {
          height: 1px;
          background: #f4f4f5;
          margin: 20px 0 16px;
        }
        .pm-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: #a1a1aa;
          margin-bottom: 14px;
        }

        @media (max-width: 540px) {
          .pm-modal { border-radius: 16px; max-height: 95vh; }
          .pm-header { padding: 18px 16px 0; }
          .pm-body { padding: 16px; }
          .pm-footer { padding: 0 16px 18px; }
          .pm-tabs { padding: 12px 16px 0; }
          .pm-avatar-zone { padding: 16px 16px 0; }
        }
      `}</style>

      <div className="pm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div
          className="pm-modal"
          style={{ "--role-color": roleColor }}
          role="dialog"
          aria-modal="true"
          aria-label="Edit Profile"
        >
          {/* Header */}
          <div className="pm-header">
            <span className="pm-title">My Profile</span>
            <button className="pm-close" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Avatar zone */}
          <div className="pm-avatar-zone">
            <div className="pm-avatar-wrap" onClick={() => fileRef.current?.click()}>
              {currentImage ? (
                <img src={currentImage} alt="Profile" className="pm-avatar-img" />
              ) : (
                <div className="pm-avatar-letter">{getInitial(name)}</div>
              )}
              <div className="pm-avatar-overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Change
              </div>
            </div>

            <span
              className="pm-role-badge"
              style={{ background: roleColor + "18", color: roleColor }}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>

            <div className="pm-avatar-actions">
              <button className="pm-avatar-btn pm-avatar-btn-upload" onClick={() => fileRef.current?.click()}>
                Upload Photo
              </button>
              {(preview || (userInfo?.image && userInfo.image !== "user.png")) && (
                <button className="pm-avatar-btn pm-avatar-btn-remove" onClick={removeImage}>
                  Remove
                </button>
              )}
            </div>
            <span className="pm-avatar-hint">JPG, PNG or GIF — max 5MB</span>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Tabs */}
          <div className="pm-tabs">
            <button className={`pm-tab ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
              Personal Info
            </button>
            <button className={`pm-tab ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
              Security
            </button>
          </div>

          {/* Body */}
          <div className="pm-body">
            {activeTab === "info" && (
              <>
                <p className="pm-section-label">Basic Information</p>

                {/* Name */}
                <div className="pm-field">
                  <label className="pm-label">Full Name</label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                    {name && (
                      <button className="pm-input-clear" onClick={clearField(setName)} title="Clear">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="pm-field">
                  <label className="pm-label">Email Address</label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                    {email && (
                      <button className="pm-input-clear" onClick={clearField(setEmail)} title="Clear">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="pm-field">
                  <label className="pm-label">Phone Number <span style={{ color: "#a1a1aa", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 00000 00000"
                    />
                    {phone && (
                      <button className="pm-input-clear" onClick={clearField(setPhone)} title="Clear">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="pm-field">
                  <label className="pm-label">Location <span style={{ color: "#a1a1aa", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <div className="pm-loc-row">
                    <div className="pm-input-wrap">
                      <input
                        className="pm-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State, Country"
                      />
                      {location && (
                        <button className="pm-input-clear" onClick={clearField(setLocation)} title="Clear">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      className="pm-detect-btn"
                      onClick={detectLocation}
                      disabled={detectingLoc}
                      title="Auto-detect location"
                    >
                      {detectingLoc ? (
                        <span className="pm-spinner" style={{ borderColor: "rgba(82,82,91,0.3)", borderTopColor: "#52525b" }} />
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                        </svg>
                      )}
                      {detectingLoc ? "Detecting..." : "Detect"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <>
                <p className="pm-section-label">Change Password</p>

                <div className="pm-field">
                  <label className="pm-label">Current Password</label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <div className="pm-field">
                  <label className="pm-label">New Password</label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Confirm New Password</label>
                  <div className="pm-input-wrap">
                    <input
                      className="pm-input"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 4 }}>
                  <button
                    className="pm-btn-save"
                    onClick={handlePasswordChange}
                    disabled={saving}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {saving ? <span className="pm-spinner" /> : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    )}
                    {saving ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer (only for info tab) */}
          {activeTab === "info" && (
            <div className="pm-footer">
              <button className="pm-btn-cancel" onClick={onClose}>Cancel</button>
              <button className="pm-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? <span className="pm-spinner" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
