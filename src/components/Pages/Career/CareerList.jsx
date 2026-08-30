"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CareerList.module.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSalary(job) {
  if (job?.salary_negotiable) return "Negotiable";
  if (!job?.salary) return "Fixed Base Salary: 30,000 BDT";
  return Number(job.salary).toLocaleString("en-BD") + " BDT";
}

function formatDeadline(deadline) {
  if (!deadline) return "31 August, 2026";
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

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

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

const PeopleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#554d66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M9 21v-2a4 4 0 0 1 4-4h1" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <circle cx="19" cy="7" r="4" />
  </svg>
);

const PaperPlaneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#732a89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#732a89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#732a89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ─── Contact Illustration SVG (Section 4 Image) ─────────────────────────────

const TeamIllustration = () => (
  <svg className={styles.contactIllustration} viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Glow */}
    <ellipse cx="250" cy="160" rx="200" ry="120" fill="#F4ECFB" />

    {/* Monitor Stand */}
    <rect x="235" y="210" width="30" height="50" fill="#3B2363" />
    <path d="M200 260 L300 260 L280 270 L220 270 Z" fill="#251838" />

    {/* Monitor */}
    <rect x="130" y="80" width="240" height="140" rx="12" fill="#2D3B8B" />
    <rect x="142" y="92" width="216" height="116" rx="6" fill="#F4F0FA" />
    <rect x="210" y="110" width="80" height="60" rx="4" fill="#FFFFFF" />

    {/* Person 1 (Left - Pink/Purple) */}
    <circle cx="110" cy="140" r="22" fill="#FDE68A" />
    <path d="M70 240 C70 190 85 175 110 175 C135 175 150 190 150 240 Z" fill="#6B21A8" />

    {/* Person 2 (Center - Blue) */}
    <circle cx="250" cy="115" r="24" fill="#FDE68A" />
    <path d="M205 240 C205 180 225 160 250 160 C275 160 295 180 295 240 Z" fill="#1E3A8A" />

    {/* Person 3 (Right - Purple) */}
    <circle cx="390" cy="140" r="22" fill="#FDE68A" />
    <path d="M350 240 C350 190 365 175 390 175 C415 175 430 190 430 240 Z" fill="#7E3895" />
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
      const res = await axios.post(`/api/career/${job.slug}`, formData, {
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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Apply for {job.title}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              type="text"
              name="full_name"
              className={styles.formInput}
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address *</label>
            <input
              type="email"
              name="email"
              className={styles.formInput}
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number *</label>
            <input
              type="text"
              name="phone"
              className={styles.formInput}
              placeholder="+8801712730507"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Attach Resume / CV (PDF or DOC) *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className={styles.formFileInput}
              onChange={handleFileChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Portfolio / LinkedIn Link (Optional)</label>
            <input
              type="url"
              name="portfolio"
              className={styles.formInput}
              placeholder="https://linkedin.com/in/yourprofile or portfolio website"
              value={form.portfolio}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cover Note (Optional)</label>
            <textarea
              name="cover_letter"
              rows={3}
              className={styles.formTextarea}
              placeholder="Briefly tell us why you are a great fit..."
              value={form.cover_letter}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
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

// ─── Single Job Card Component ────────────────────────────────────────────────

function JobCard({ job, isExpanded, onToggleExpand, onApply }) {
  const formattedDeadline = formatDeadline(job.deadline);
  const salaryText = formatSalary(job);
  const [detailedDescription, setDetailedDescription] = useState(job.description || null);
  const [loadingDesc, setLoadingDesc] = useState(false);

  useEffect(() => {
    if (isExpanded && !detailedDescription && job.slug) {
      setLoadingDesc(true);
      axios
        .get(`/api/career/${job.slug}`)
        .then((res) => {
          const data = res.data?.data || res.data;
          if (data?.description) {
            setDetailedDescription(data.description);
          }
        })
        .catch(() => { })
        .finally(() => setLoadingDesc(false));
    }
  }, [isExpanded, detailedDescription, job.slug]);

  const descToRender = detailedDescription || job.description;

  return (
    <div className={`${styles.jobCard} ${isExpanded ? styles.jobCardActive : ""}`}>
      {/* ── Main Header Row ── */}
      <div className={styles.cardHeaderRow}>
        {/* Left Column: Title & Badges */}
        <div className={styles.titleCol}>
          <div className={styles.titleRow}>
            <h3 className={styles.jobTitle}>{job.title}</h3>
            <span
              className={`${styles.viewDescBadge} ${isExpanded ? styles.viewDescBadgeActive : ""}`}
              onClick={onToggleExpand}
            >
              <EyeIcon /> View Description
            </span>
          </div>

          <div className={styles.badgesRow}>
            <span className={styles.pillBadge}>
              <LocationIcon /> {job.location || "Aswaq Qurrain, Kuwait"}
            </span>
            <span className={styles.pillBadge}>
              <PersonIcon /> {job.type || "Full Time"}
            </span>
            <span className={styles.pillBadge}>
              <LaptopIcon /> {job.work_mode || "In office"}
            </span>
          </div>
        </div>

        {/* Middle Meta: Deadline & Vacancy */}
        <div className={styles.metaCol}>
          <div className={styles.deadlineDate}>{formattedDeadline}</div>
          <div className={styles.vacancyText}>
            <PeopleIcon /> No of vacancies: {job.vacancies || job.vacancy_count || 1}
          </div>
        </div>

        {/* Right Actions: View Details v & Apply Now ✈ */}
        <div className={styles.actionsCol}>
          <button
            type="button"
            className={`${styles.viewDetailsBtn} ${isExpanded ? styles.viewDetailsBtnActive : ""}`}
            onClick={onToggleExpand}
          >
            {isExpanded ? "Hide Details" : "View Details"} {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>

          {!isExpanded && (
            <button
              type="button"
              className={styles.applyNowBtn}
              onClick={onApply}
            >
              Apply Now <PaperPlaneIcon />
            </button>
          )}
        </div>
      </div>

      {/* ── Inline Description Accordion ── */}
      {isExpanded && (
        <div className={styles.accordionBox}>
          {/* 💡 Role Overview (Short Summary) */}
          {job.short_summary && (
            <div className={styles.roleOverviewBox}>
              <div className={styles.roleOverviewHeader}>
                <span>💡</span> Role Overview:
              </div>
              <p className={styles.roleOverviewText}>
                {job.short_summary}
              </p>
            </div>
          )}

          {/* Job Description & Requirements Heading */}
          <h4 className={styles.jobDescHeading}>Job Description &amp; Requirements:</h4>

          {descToRender ? (
            <div
              className={styles.jobDescriptionBody}
              dangerouslySetInnerHTML={{ __html: descToRender }}
            />
          ) : (
            <>
              {/* Who You Are (Requirements) */}
              <div className={styles.accordionSectionTitle}>
                🎯 Who You Are (Requirements):
              </div>
              <ul className={styles.bulletList}>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    You have 3+ years of relevant experience under your belt.
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    You understand industry best practices, communication, and visual execution.
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    You are comfortable working in a fast-paced environment with a clean delivery pipeline.
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    You want to work from our collaborative, high-energy office in Aswaq Qurrain, Kuwait.
                  </span>
                </li>
              </ul>

              {/* What's In It For You? */}
              <div className={styles.accordionSectionTitle}>
                🎁 What&apos;s In It For You?
              </div>
              <ul className={styles.bulletList}>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    <span className={styles.boldText}>Fixed Base Salary: </span>
                    {salaryText}
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    <span className={styles.boldText}>Festival Bonus: </span>
                    Festival Bonus &amp; other sweet company facilities.
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    <span className={styles.boldText}>Performance Bonuses: </span>
                    When goals are achieved and revenue scales, your wallet grows too.
                  </span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={styles.bulletArrow}>➤</span>
                  <span>
                    <span className={styles.boldText}>Full Creative Freedom: </span>
                    No micromanagement. You own your workspace, your frameworks, and your style.
                  </span>
                </li>
              </ul>
            </>
          )}

          {/* Accordion Footer Bar */}
          <div className={styles.accordionFooter}>
            <div className={styles.salaryDeadlineInfo}>
              <span>
                <strong>Salary:</strong> {salaryText}
              </span>
              <span>•</span>
              <span>
                <strong>Deadline:</strong> {formattedDeadline}
              </span>
            </div>

            <div className={styles.accordionActions}>
              <Link href={`/career/${job.slug}`} className={styles.fullDetailsLink}>
                Full Details Page ↗
              </Link>
              <button
                type="button"
                className={styles.applyNowBtn}
                onClick={onApply}
              >
                Apply For This Job <PaperPlaneIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CareerList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Accordion state & Modal state
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [modalJob, setModalJob] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/career")
      .then((res) => {
        const body = res.data;
        if (Array.isArray(body?.data)) {
          setJobs(body.data);
        } else if (Array.isArray(body)) {
          setJobs(body);
        } else {
          setJobs([]);
        }
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.careerPage}>
      {/* ── Section 1: Hero Banner Header ── */}
      <section className={styles.heroBanner} />

      {/* ── Section 2: "Build Your Career. Create an Impact." ── */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            {/* Left Content */}
            <div className={styles.aboutContentCol}>
              <h2 className={styles.aboutTitle}>Build Your Career. Create an Impact.</h2>
              <p className={styles.aboutDesc}>
                At Sanam, we believe great businesses are built by great people. We’re looking for skilled, ambitious, and creative professionals who want more than just a job—a place where their ideas are valued, their skills are challenged, and their performance creates real impact.
                <br /><br />
                Join a growing team where you’ll have the opportunity to take ownership, solve real challenges, learn continuously, and build a career alongside the growth of Sanam. Join Sanam. Build. Innovate. Grow.
              </p>

              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>35+</div>
                  <div className={styles.statLabel}>Team Members</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statNumber}>250+</div>
                  <div className={styles.statLabel}>Projects Delivered</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Growth Culture</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={styles.aboutImageCol}>
              <div className={styles.aboutImageWrapper}>
                <img
                  src="/image/career-about-team.png"
                  alt="Get Your Job Here - Sanam"
                  className={styles.aboutImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: "Discover Your Opportunity at Sanam" ── */}
      <section className={styles.jobsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.jobsSectionTitle}>Discover Your Opportunity at Sanam</h2>
            <p className={styles.jobsSectionSubtitle}>
              Explore our current opportunities and discover a role where your skills, ideas, and ambition can make a real impact. Select a position below to view the job details and take the next step in your career with Sanam.
            </p>
          </div>

          <div className={styles.jobsContainer}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="spinner-border" style={{ color: "#732a89" }} role="status">
                  <span className="visually-hidden">Loading positions...</span>
                </div>
                <p style={{ color: "#6b7280", marginTop: 12, fontWeight: 600 }}>Loading open positions...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: "center", background: "#ffffff", padding: "48px 24px", borderRadius: 20, border: "1.5px solid #ece4fa", boxShadow: "0 4px 20px rgba(115, 42, 137, 0.04)" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1c152b", marginBottom: 8 }}>
                  No open positions at the moment
                </h3>
                <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>
                  We are always looking for great talent. Send your CV to{" "}
                  <a href="mailto:info@sanamstore.net" style={{ color: "#732a89", fontWeight: 600, textDecoration: "none" }}>
                    info@sanamstore.net
                  </a>
                </p>
              </div>
            ) : (
              jobs.map((job) => {
                const jobId = job.id || job.slug;
                return (
                  <JobCard
                    key={jobId}
                    job={job}
                    isExpanded={expandedJobId === jobId}
                    onToggleExpand={() => toggleExpand(jobId)}
                    onApply={() => setModalJob(job)}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── Section 4: "Ready to Join Sanam?" ── */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Left Content */}
            <div className={styles.contactContentCol}>
              <div className={styles.contactEyebrow}>APPLY</div>
              <h2 className={styles.contactTitle}>Ready to Join Sanam?</h2>
              <p className={styles.contactSubtitle}>
                We’re always looking for talented, passionate, and driven people to grow with us. Explore our current opportunities and submit your application for a position that matches your skills and career goals.
              </p>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}><MailIcon /></span>
                  <a href="mailto:info@sanamstore.net" style={{ color: "inherit", textDecoration: "none" }}>
                    info@sanamstore.net
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}><GlobeIcon /></span>
                  <a href="https://www.sanamstore.net" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    www.sanamstore.net
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}><PhoneIcon /></span>
                  <a href="tel:01841072889" style={{ color: "inherit", textDecoration: "none" }}>
                    01841072889
                  </a>
                </div>
              </div>

              <a href="mailto:info@sanamstore.net" className={styles.contactBtn}>
                Contact Us <PhoneIcon />
              </a>
            </div>

            {/* Right Vector Illustration */}
            <div className={styles.contactImageCol}>
              <TeamIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal Application Popup ── */}
      {modalJob && (
        <ApplyModal job={modalJob} onClose={() => setModalJob(null)} />
      )}
    </div>
  );
}
