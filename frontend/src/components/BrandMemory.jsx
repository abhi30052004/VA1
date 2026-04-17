import React, { useState } from "react";
import { Save, ShieldCheck, Zap } from "lucide-react";

export default function BrandMemory({ initialData, onSave }) {
  const [profile, setProfile] = useState({
    companyName: initialData?.companyName || "",
    mission: initialData?.mission || "",
    audience: initialData?.audience || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(profile);
    setSaving(false);
  }

  return (
    <div className="brand-memory-pane glass-card">
      <div className="brand-header">
        <div className="brand-header-title">
          <ShieldCheck size={18} className="text-secondary" />
          <h3>Brand Memory</h3>
        </div>
        <p className="dim-text">This context is automatically injected into every prompt.</p>
      </div>

      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Tech Solutions"
            value={profile.companyName}
            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Mission & Core Values</label>
          <textarea
            placeholder="What does your company do? What are its values?"
            rows={3}
            value={profile.mission}
            onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Primary Target Audience</label>
          <input
            type="text"
            placeholder="e.g. Small business owners in UK"
            value={profile.audience}
            onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          className={`btn-primary btn-full ${saving ? "btn-loading" : ""}`}
          disabled={saving}
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={16} /> Save Brand Memory
            </>
          )}
        </button>
      </form>

      <div className="brand-footer-tip">
        <Zap size={14} className="text-accent" />
        <span>Memory is active! The AI now knows who you are.</span>
      </div>
    </div>
  );
}
