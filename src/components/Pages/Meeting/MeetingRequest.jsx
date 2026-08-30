"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// ─── helpers ────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { value: 5, label: "5 minutes", desc: "Quick check-in" },
  { value: 15, label: "15 minutes", desc: "Short consultation" },
  { value: 30, label: "30 minutes", desc: "In-depth discussion" },
];

const CALL_TYPE_OPTIONS = [
  { value: "single", label: "One-on-One", desc: "Private session with our team" },
  { value: "group", label: "Group Call", desc: "Multiple participants welcome" },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getCalendarGrid(year, month) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toDateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isPast(year, month, day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month - 1, day) < today;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${Number(d)}, ${y}`;
}

// ─── Success Screen ──────────────────────────────────────────────────────────

function SuccessScreen({ booking }) {
  return (
    <section className="container py-5" style={{ maxWidth: 900 }}>
      <div className="text-center py-4">
        <div style={{ fontSize: "3.5rem" }} className="mb-3">📅</div>
        <h4 className="fw-bold mb-2">Request Submitted!</h4>
        <p className="text-muted mb-4">
          Your meeting request is <span className="badge bg-warning text-dark fw-normal">pending</span> — we'll confirm via email once reviewed.
        </p>

        {booking && (
          <div className="card border-0 shadow-sm rounded-3 mx-auto mb-4 text-start" style={{ maxWidth: 400 }}>
            <div className="card-body p-4">
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">Date</span>
                <span className="fw-semibold small">{formatDisplayDate(booking.meeting_date)}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">Time</span>
                <span className="fw-semibold small">{booking.start_time} – {booking.end_time}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">Duration</span>
                <span className="fw-semibold small">{booking.session_duration} minutes</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">Type</span>
                <span className="fw-semibold small">{booking.call_type === "single" ? "One-on-One" : "Group Call"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Topic</span>
                <span className="fw-semibold small">{booking.topic}</span>
              </div>
            </div>
          </div>
        )}

        <a href="/meeting-request" className="btn btn-outline-purple">
          Book Another Meeting
        </a>
      </div>
    </section>
  );
}

// ─── Inline Step 2 - Calendar (non-modal) ────────────────────────────────────

function Step2Inline({ duration, selectedDate, setSelectedDate }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/meetings/available-dates", { params: { year, month, duration } })
      .then((res) => {
        const body = res.data;
        const dates = Array.isArray(body?.data) ? body.data : (body?.data?.available_dates || []);
        setAvailableDates(dates);
      })
      .catch(() => setError("Could not load available dates."))
      .finally(() => setLoading(false));
  }, [year, month, duration]);

  const cells = getCalendarGrid(year, month);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const isBeforeToday = (y, m) => {
    const now = new Date();
    return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
  };

  return (
    <div>
      {error && <div className="alert alert-warning py-2 small mb-3">{error}</div>}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={prevMonth}
          disabled={isBeforeToday(year, month)}
        >
          ‹
        </button>
        <span className="fw-semibold small">{MONTH_NAMES[month - 1]} {year}</span>
        <button className="btn btn-sm btn-outline-secondary" onClick={nextMonth}>
          ›
        </button>
      </div>

      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-purple" />
        </div>
      ) : (
        <div>
          <div className="row g-0 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="col text-center small text-muted fw-semibold py-1">
                {d}
              </div>
            ))}
          </div>
          {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, week) => (
            <div className="row g-0" key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((day, idx) => {
                if (!day) {
                  return <div className="col" key={idx} style={{ height: 44 }} />;
                }
                const dateStr = toDateStr(year, month, day);
                const available = availableDates.includes(dateStr);
                const past = isPast(year, month, day);
                const selected = selectedDate === dateStr;
                return (
                  <div className="col d-flex justify-content-center align-items-center" key={idx} style={{ height: 44 }}>
                    <button
                      type="button"
                      disabled={past || !available}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`rounded-circle border-0 d-flex align-items-center justify-content-center fw-normal`}
                      style={{
                        width: 36, height: 36, fontSize: 13, cursor: (past || !available) ? "default" : "pointer",
                        background: selected
                          ? "#9333ea"
                          : available && !past
                          ? "#ede9f8"
                          : "transparent",
                        color: selected ? "#fff" : past ? "#ced4da" : available ? "#9333ea" : "#adb5bd",
                        fontWeight: available && !past ? 600 : 400,
                      }}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline Step 3 - Time Slots (non-modal) ─────────────────────────────────

function Step3Inline({ duration, selectedDate, selectedSlot, setSelectedSlot }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/meetings/available-slots", { params: { date: selectedDate, duration } })
      .then((res) => {
        setSlots(res.data?.data?.slots || []);
      })
      .catch(() => setError("Could not load time slots."))
      .finally(() => setLoading(false));
  }, [selectedDate, duration]);

  return (
    <div>
      {error && <div className="alert alert-warning py-2 small mb-3">{error}</div>}

      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-purple" />
        </div>
      ) : slots.length === 0 ? (
        <div className="alert alert-info py-2 small">No available slots for this date.</div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {slots.map((slot) => {
            const active = selectedSlot?.start_24h === slot.start_24h;
            const booked = slot.is_booked === true;
            return (
              <button
                key={slot.start_24h}
                type="button"
                onClick={() => !booked && setSelectedSlot(slot)}
                disabled={booked}
                className={`btn btn-sm rounded-3 border-2 ${
                  booked
                    ? "btn-outline-danger"
                    : active
                    ? "btn-purple text-white"
                    : "btn-outline-secondary"
                }`}
                style={{
                  minWidth: 110,
                  fontVariantNumeric: "tabular-nums",
                  transition: "all 0.2s ease",
                  opacity: booked ? 0.65 : 1,
                  cursor: booked ? "not-allowed" : "pointer",
                  pointerEvents: booked ? "none" : "auto",
                }}
              >
                <span>{slot.start} – {slot.end}</span>
                {booked && (
                  <span className="d-block" style={{ fontSize: "10px", marginTop: "2px" }}>
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export default function MeetingRequest() {
  const [duration, setDuration] = useState(null);
  const [callType, setCallType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({
    requester_name: "",
    requester_email: "",
    requester_phone: "",
    topic: "",
    agenda: "",
    agreed_to_terms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isSuccess = booking !== null;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!duration || !callType || !selectedDate || !selectedSlot) {
      setFieldErrors({ _general: "Please complete all steps before submitting." });
      return;
    }

    const payload = {
      requester_name: form.requester_name,
      requester_email: form.requester_email,
      requester_phone: form.requester_phone || undefined,
      session_duration: duration,
      call_type: callType,
      meeting_date: selectedDate,
      start_time: selectedSlot.start_24h,
      topic: form.topic,
      agenda: form.agenda,
      agreed_to_terms: form.agreed_to_terms,
    };

    setSubmitting(true);
    try {
      const res = await axios.post("/api/meetings/request", payload);
      const body = res.data;
      if (body.status === true) {
        setBooking(body.data);
      } else {
        setFieldErrors({ _general: body.status_message || "Submission failed. Please try again." });
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        if (errors.start_time) {
          setFieldErrors({ _general: errors.start_time[0] + " Please pick another slot." });
        } else {
          setFieldErrors(errors);
        }
      } else {
        setFieldErrors({ _general: "Submission failed. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess && booking) {
    return <SuccessScreen booking={booking} />;
  }

  return (
    <section className="container py-5" style={{ maxWidth: 1200 }}>
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Book a Meeting</h1>
        <p className="text-muted">
          Schedule a video call with the {process.env.NEXT_PUBLIC_SITE_NAME} team.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column - Meeting Selection Steps */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 p-4">
            <h4 className="fw-bold mb-4">Select Meeting Details</h4>

            {/* Duration Selection */}
            <div className="mb-5">
              <h5 className="fw-semibold mb-1">Session Duration</h5>
              <p className="text-muted mb-3 small">How long do you need?</p>
              <div className="row g-2">
                {DURATION_OPTIONS.map((opt) => (
                  <div className="col-12 col-sm-6" key={opt.value}>
                    <button
                      type="button"
                      onClick={() => setDuration(opt.value)}
                      className={`w-100 btn rounded-3 py-3 px-3 text-start border-2 transition ${
                        duration === opt.value
                          ? "btn-purple text-white"
                          : "btn-outline-secondary"
                      }`}
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <div className="fw-semibold">{opt.label}</div>
                      <div className="small opacity-75">{opt.desc}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Type Selection */}
            <div className="mb-5">
              <h5 className="fw-semibold mb-1">Call Type</h5>
              <p className="text-muted mb-3 small">How would you like to meet?</p>
              <div className="row g-2">
                {CALL_TYPE_OPTIONS.map((opt) => (
                  <div className="col-12 col-sm-6" key={opt.value}>
                    <button
                      type="button"
                      onClick={() => setCallType(opt.value)}
                      className={`w-100 btn rounded-3 py-3 px-3 text-start border-2 transition ${
                        callType === opt.value
                          ? "btn-purple text-white"
                          : "btn-outline-secondary"
                      }`}
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <div className="fw-semibold">{opt.label}</div>
                      <div className="small opacity-75">{opt.desc}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-5">
              <h5 className="fw-semibold mb-1">Select a Date</h5>
              <p className="text-muted mb-3 small">
                {duration ? `${duration} min session` : "Select duration above first"}
              </p>
              {duration && (
                <Step2Inline
                  duration={duration}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="mb-3">
                <h5 className="fw-semibold mb-1">Select a Time Slot</h5>
                <p className="text-muted mb-3 small">
                  {formatDisplayDate(selectedDate)} — {duration}-minute session
                </p>
                <Step3Inline
                  duration={duration}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Your Details Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 p-4" style={{ position: "sticky", top: 20 }}>
            <h4 className="fw-bold mb-4">Your Details</h4>

            {selectedSlot && (
              <div className="alert alert-info py-3 mb-4 small">
                <strong>Selected:</strong> {formatDisplayDate(selectedDate)} at {selectedSlot.start} – {selectedSlot.end}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {fieldErrors._general && (
                <div className="alert alert-danger py-2 mb-4 small">{fieldErrors._general}</div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="requester_name">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  id="requester_name"
                  type="text"
                  name="requester_name"
                  className={`form-control ${fieldErrors.requester_name ? "is-invalid" : ""}`}
                  placeholder="Your full name"
                  value={form.requester_name}
                  onChange={handleFormChange}
                  maxLength={255}
                  required
                />
                {fieldErrors.requester_name && (
                  <div className="invalid-feedback d-block">
                    {Array.isArray(fieldErrors.requester_name) ? fieldErrors.requester_name[0] : fieldErrors.requester_name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="requester_email">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="requester_email"
                  type="email"
                  name="requester_email"
                  className={`form-control ${fieldErrors.requester_email ? "is-invalid" : ""}`}
                  placeholder="you@example.com"
                  value={form.requester_email}
                  onChange={handleFormChange}
                  required
                />
                {fieldErrors.requester_email && (
                  <div className="invalid-feedback d-block">
                    {Array.isArray(fieldErrors.requester_email) ? fieldErrors.requester_email[0] : fieldErrors.requester_email}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="requester_phone">
                  Phone <span className="text-muted fw-normal">(optional)</span>
                </label>
                <input
                  id="requester_phone"
                  type="tel"
                  name="requester_phone"
                  className={`form-control ${fieldErrors.requester_phone ? "is-invalid" : ""}`}
                  placeholder="+880XXXXXXXXXX"
                  value={form.requester_phone}
                  onChange={handleFormChange}
                  maxLength={20}
                />
                {fieldErrors.requester_phone && (
                  <div className="invalid-feedback d-block">
                    {Array.isArray(fieldErrors.requester_phone) ? fieldErrors.requester_phone[0] : fieldErrors.requester_phone}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="topic">
                  Meeting Topic <span className="text-danger">*</span>
                </label>
                <input
                  id="topic"
                  type="text"
                  name="topic"
                  className={`form-control ${fieldErrors.topic ? "is-invalid" : ""}`}
                  placeholder="e.g. Product Customization"
                  value={form.topic}
                  onChange={handleFormChange}
                  maxLength={255}
                  required
                />
                {fieldErrors.topic && (
                  <div className="invalid-feedback d-block">
                    {Array.isArray(fieldErrors.topic) ? fieldErrors.topic[0] : fieldErrors.topic}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="agenda">
                  Agenda / Questions <span className="text-danger">*</span>
                </label>
                <textarea
                  id="agenda"
                  name="agenda"
                  rows={3}
                  className={`form-control ${fieldErrors.agenda ? "is-invalid" : ""}`}
                  placeholder="What would you like to discuss?"
                  value={form.agenda}
                  onChange={handleFormChange}
                  required
                />
                {fieldErrors.agenda && (
                  <div className="invalid-feedback d-block">
                    {Array.isArray(fieldErrors.agenda) ? fieldErrors.agenda[0] : fieldErrors.agenda}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className={`form-check ${fieldErrors.agreed_to_terms ? "is-invalid" : ""}`}>
                  <input
                    id="agreed_to_terms"
                    type="checkbox"
                    name="agreed_to_terms"
                    className={`form-check-input ${fieldErrors.agreed_to_terms ? "is-invalid" : ""}`}
                    checked={form.agreed_to_terms}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label small" htmlFor="agreed_to_terms">
                    I agree to the meeting terms. <span className="text-danger">*</span>
                  </label>
                </div>
                {fieldErrors.agreed_to_terms && (
                  <div className="text-danger small mt-1">
                    {Array.isArray(fieldErrors.agreed_to_terms) ? fieldErrors.agreed_to_terms[0] : fieldErrors.agreed_to_terms}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-purple w-100 py-2 fw-semibold"
                disabled={submitting || !duration || !callType || !selectedDate || !selectedSlot}
              >
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
                ) : "Submit Meeting Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
