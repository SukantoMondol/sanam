"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c2b85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c2b85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LaptopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c2b85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const PaperPlaneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ─── Application Modal Popup Component ───────────────────────────────────────

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    portfolio: "",
    cover_letter: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      toast.error("Only PDF or DOC files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be 5MB or less.");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email Address is required.");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Phone Number is required.");
      return;
    }
    if (!resumeFile) {
      toast.error("Attach Resume / CV is required.");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", resumeFile);
    if (form.portfolio.trim()) {
      formData.append("portfolio", form.portfolio);
    }
    if (form.cover_letter.trim()) {
      formData.append("cover_letter", form.cover_letter);
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`/api/career/${job?.slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.status === true || res.status === 200 || res.status === 201) {
        toast.success("Application submitted successfully!");
        onClose();
      } else {
        toast.error(res.data?.status_message || res.data?.message || "Application submission failed.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.status_message ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Application submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 10, 25, 0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px 36px",
          boxShadow: "0 25px 50px -12px rgba(115, 42, 137, 0.25)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f3e8ff" }}>
          <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#111827" }}>
            Apply for {job?.title}
          </h3>
          <button
            type="button"
            style={{ background: "#f3e8ff", border: "none", width: 34, height: 34, borderRadius: "50%", color: "#732a89", fontWeight: 800, cursor: "pointer" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Full Name *</label>
            <input
              type="text"
              name="full_name"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.95rem", color: "#111827", outline: "none" }}
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Email Address *</label>
            <input
              type="email"
              name="email"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.95rem", color: "#111827", outline: "none" }}
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Phone Number *</label>
            <input
              type="text"
              name="phone"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.95rem", color: "#111827", outline: "none" }}
              placeholder="+8801712730507"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Attach Resume / CV (PDF or DOC) *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.9rem", width: "100%", cursor: "pointer" }}
              onChange={handleFileChange}
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Portfolio / LinkedIn Link (Optional)</label>
            <input
              type="url"
              name="portfolio"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.95rem", color: "#111827", outline: "none" }}
              placeholder="https://linkedin.com/in/yourprofile or portfolio website"
              value={form.portfolio}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Cover Note (Optional)</label>
            <textarea
              name="cover_letter"
              rows={3}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#faf9fc", fontSize: "0.95rem", color: "#111827", outline: "none" }}
              placeholder="Briefly tell us why you are a great fit..."
              value={form.cover_letter}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            style={{ width: "100%", padding: "14px 24px", borderRadius: 999, border: "none", background: "#732a89", color: "#ffffff", fontSize: "1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(115, 42, 137, 0.35)", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            disabled={submitting}
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                Submit Application &amp; CV <PaperPlaneIcon />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function formatSalary(job) {
  if (job?.salary_negotiable) return "Negotiable";
  if (!job?.salary) return "Negotiable";
  return Number(job.salary).toLocaleString("en-BD") + " BDT";
}

function formatDeadline(deadline) {
  if (!deadline) return "Open until filled";
  try {
    const d = new Date(deadline);
    if (isNaN(d.getTime())) return deadline;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return deadline;
  }
}

export default function CareerDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios
      .get(`/api/career/${slug}`)
      .then((res) => {
        const body = res.data;
        if (body?.data) {
          setJob(body.data);
        } else if (body?.title) {
          setJob(body);
        } else {
          setJob(null);
        }
      })
      .catch(() => {
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: "#f4f0fa", minHeight: "80vh", padding: "80px 0", color: "#1f192f", fontFamily: "Manrope, Sora, sans-serif" }}>
        <div className="container text-center py-5">
          <div className="spinner-border" style={{ color: "#732a89", width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading job details...</span>
          </div>
          <p style={{ marginTop: 16, color: "#6b7280", fontWeight: 600 }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ background: "#f4f0fa", minHeight: "80vh", padding: "80px 0", color: "#1f192f", fontFamily: "Manrope, Sora, sans-serif" }}>
        <div className="container text-center py-5">
          <div style={{ background: "#ffffff", maxWidth: 600, margin: "0 auto", padding: "48px 32px", borderRadius: 24, boxShadow: "0 10px 30px rgba(115,42,137,0.06)", border: "1.5px solid #ece4fa" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1c152b", marginBottom: 12 }}>Job Opening Not Found</h2>
            <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>
              This position may have expired or is no longer active. Check our careers page for current openings.
            </p>
            <Link
              href="/career"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#732a89",
                color: "#ffffff",
                padding: "12px 28px",
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(115, 42, 137, 0.35)",
              }}
            >
              <ChevronLeftIcon /> View All Open Positions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const salaryText = formatSalary(job);
  const deadlineText = formatDeadline(job.deadline);

  return (
    <div style={{ background: "#f4f0fa", minHeight: "80vh", padding: "50px 0 90px", color: "#1f192f", fontFamily: "Manrope, Sora, sans-serif" }}>
      <div className="container">
        {/* Back Link */}
        <Link href="/career" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.95rem", fontWeight: 700, color: "#732a89", textDecoration: "none", marginBottom: 20 }}>
          <ChevronLeftIcon /> Back to All Roles
        </Link>

        {/* ── Top Full Width Header: Title & Badges ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#1c152b", margin: "0 0 16px" }}>
            {job.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.88rem", fontWeight: 600, color: "#5c2072", background: "#ffffff", border: "1px solid #ece4fa", borderRadius: 999, padding: "6px 18px" }}>
              <LocationIcon /> {job.location || "Aswaq Qurrain, Kuwait"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.88rem", fontWeight: 600, color: "#5c2072", background: "#ffffff", border: "1px solid #ece4fa", borderRadius: 999, padding: "6px 18px" }}>
              <PersonIcon /> {job.type || "Full Time"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.88rem", fontWeight: 600, color: "#5c2072", background: "#ffffff", border: "1px solid #ece4fa", borderRadius: 999, padding: "6px 18px" }}>
              <LaptopIcon /> {job.work_mode || "In office"}
            </span>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          {/* ── LEFT: Main Job Description ── */}
          <div className="col-12 col-lg-8">
            <div style={{ background: "#ffffff", border: "1.5px solid #ece4fa", borderRadius: 24, padding: "32px 36px", boxShadow: "0 4px 20px rgba(115, 42, 137, 0.04)" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1c152b", margin: "0 0 20px" }}>
                Job Description &amp; Requirements
              </h2>

              {job.description ? (
                <div
                  style={{ lineHeight: 1.85, color: "#374151", fontSize: "0.98rem" }}
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
                  Please submit your application and CV to be considered for this position.
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sticky Role Overview Sidebar ── */}
          <div className="col-12 col-lg-4">
            <div
              style={{
                position: "sticky",
                top: 24,
                zIndex: 10,
                background: "#ffffff",
                border: "1.5px solid #ece4fa",
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 10px 30px rgba(115, 42, 137, 0.06)",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1c152b", margin: "0 0 20px", paddingBottom: 16, borderBottom: "1.5px solid #f0ebf8" }}>
                Role Overview
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.95rem", paddingBottom: 12, borderBottom: "1px dashed #f0ebf8" }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Location:</span>
                  <span style={{ color: "#1c152b", fontWeight: 800 }}>
                    {job.location || "Aswaq Qurrain, Kuwait"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.95rem", paddingBottom: 12, borderBottom: "1px dashed #f0ebf8" }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Job Type:</span>
                  <span style={{ color: "#1c152b", fontWeight: 800 }}>
                    {job.type || "Full Time"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.95rem", paddingBottom: 12, borderBottom: "1px dashed #f0ebf8" }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Workplace:</span>
                  <span style={{ color: "#1c152b", fontWeight: 800 }}>
                    {job.work_mode || "In office"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.95rem", paddingBottom: 12, borderBottom: "1px dashed #f0ebf8" }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Salary:</span>
                  <span style={{ color: "#732a89", fontWeight: 800, fontSize: "1.05rem" }}>
                    {salaryText}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.95rem" }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Deadline:</span>
                  <span style={{ color: "#1c152b", fontWeight: 800 }}>
                    {deadlineText}
                  </span>
                </div>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: "14px 24px",
                  borderRadius: 999,
                  border: "none",
                  background: "#732a89",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(115, 42, 137, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={() => setShowApplyModal(true)}
              >
                Apply For This Job <PaperPlaneIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Application Modal Popup ── */}
      {showApplyModal && (
        <ApplyModal job={job} onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}
