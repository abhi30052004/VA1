import React, { useState } from "react";
import { Save, Trash2, Plus, Building2, Target, Rocket, ShieldCheck, Zap } from "lucide-react";

export default function BrandMemory({ profiles, onSave, onDelete }) {
  const [profile, setProfile] = useState({
    companyName: "",
    mission: "",
    audience: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    if (!profile.companyName.trim()) return;
    e.preventDefault();
    setSaving(true);
    await onSave(profile);
    setProfile({ companyName: "", mission: "", audience: "" });
    setSaving(false);
  }

  return (
    <div className="brand-memory-layout">
      {/* Left Column: Management & Stats */}
      <div className="brand-sidebar-info">
        <div className="brand-header">
          <div className="brand-header-title">
            <ShieldCheck size={24} className="text-secondary" />
            <h3>Brand Vault</h3>
          </div>
          <p className="dim-text">The AI scans all active identities to find the best match for your content.</p>
        </div>

        <div className="brand-list-scroll">
          {profiles.length === 0 ? (
            <div className="brand-empty-state">
              <Building2 size={32} className="dim-icon" />
              <p>No identities saved yet.<br/>Add your first brand to start.</p>
            </div>
          ) : (
            <div className="brand-cards-grid">
              {profiles.map((p) => (
                <div key={p._id || p.id} className="brand-identity-card glass-card">
                  <div className="brand-card-top">
                    <div className="brand-avatar">
                      {p.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div className="brand-card-info">
                      <strong>{p.companyName}</strong>
                      <span className="brand-updated">
                        Updated {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      className="brand-delete-btn" 
                      onClick={() => onDelete(p._id || p.id)}
                      title="Delete Identity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="brand-card-details">
                    <div className="brand-detail-item">
                      <Rocket size={12} className="text-accent" />
                      <p className="line-clamp-2">{p.mission || "No mission defined"}</p>
                    </div>
                    <div className="brand-detail-item">
                      <Target size={12} className="text-secondary" />
                      <p>{p.audience || "General Audience"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Add Form */}
      <div className="brand-form-container glass-card premium-form-layout">
        <div className="form-header">
          <div className="form-header-badge-glow">IDENTITY BUILDER</div>
          <h4>New Brand Profile</h4>
          <p className="form-subtitle">Define the core DNA of your project for the AI to emulate.</p>
        </div>

        <form onSubmit={handleSubmit} className="brand-form-premium">
          <div className="form-section">
            <div className="form-group-premium">
              <label>
                <Building2 size={14} /> Brand/Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tesla, Nike, local bakery..."
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                required
                className="premium-input"
              />
            </div>

            <div className="form-group-premium">
              <label>
                <Target size={14} /> Primary Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. Tech-savvy parents, Gen Z hikers..."
                value={profile.audience}
                onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
                className="premium-input"
              />
            </div>
          </div>

          <div className="form-group-premium full-width">
            <label>
              <Rocket size={14} /> The Mission (What you do & Why)
            </label>
            <textarea
              placeholder="Describe your core business, specific values, and what makes you unique to the market..."
              rows={5}
              value={profile.mission}
              onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
              className="premium-textarea"
            />
          </div>

          <button 
            type="submit" 
            className={`btn-primary-glow btn-full ${saving ? "btn-loading" : ""}`}
            disabled={saving || !profile.companyName}
          >
            {saving ? (
              <span className="loading-dots">Saving...</span>
            ) : (
              <>
                <div className="btn-icon-circle"><Plus size={18} /></div> 
                <span>Add to Vault</span>
              </>
            )}
          </button>
        </form>

        <div className="brand-security-notice">
          <div className="notice-icon"><ShieldCheck size={14} /></div>
          <p>Encrypted & active in current session.</p>
        </div>
      </div>
    </div>
  );
}
