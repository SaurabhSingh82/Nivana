import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Dashboard = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  // Local demo state: quick mood check-in
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);

      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-header", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.from(".stat-card", {
        y: 15,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
      });

      gsap.from(".dash-card", {
        y: 30,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.25,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Demo handlers for quick mood check-in
  const handleMoodClick = (value) => {
    setMood(value);
  };

  const handleSaveCheckIn = () => {
    // For now just console.log – later you can send this to backend
    console.log("Today check-in:", { mood, note });
    alert("Your quick check-in is saved (demo only).");
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#F5EEDF] text-[#1A1A1A] px-6 py-8"
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-soft-light bg-[radial-gradient(circle_at_top,_#0F766E22,_transparent_60%),radial-gradient(circle_at_bottom,_#F9731622,_transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9F4EA] border border-[#E4DCCF] text-[11px] tracking-[0.2em] uppercase text-[#0F766E]">
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
              Nivana
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-[#134E4A]">
              Your Mental Health Dashboard 🧠
            </h1>
            <p className="text-[#4F4F4F] mt-2 text-sm md:text-base max-w-xl">
              A calm space to check in with your mood, reflect on your
              assessments, and access support whenever you need it.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="px-3 py-2 rounded-2xl bg-[#F9F4EA] border border-[#E4DCCF] text-xs shadow-sm text-right">
              <p className="font-semibold text-[#134E4A]">
                {token ? "Logged in to Nivana" : "Not authenticated"}
              </p>
              <p className="text-[11px] text-[#7A7A7A] mt-1">
                {token
                  ? "Session token saved in localStorage."
                  : "Sign in again to unlock all features."}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-medium shadow-md shadow-[#0F766E22] transition-transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Quick stats row */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="stat-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-[#7A7A7A]">
              Check-in streak
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#134E4A]">3 days</p>
            <p className="mt-1 text-xs text-[#7A7A7A]">
              Keeping small, regular check-ins helps build self-awareness.
            </p>
          </div>

          <div className="stat-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-[#7A7A7A]">
              Last assessment
            </p>
            <p className="mt-2 text-sm font-medium text-[#134E4A]">
              2 days ago · Moderate stress
            </p>
            <p className="mt-1 text-xs text-[#7A7A7A]">
              Try to revisit the self assessment at least once a week.
            </p>
          </div>

          <div className="stat-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-[#7A7A7A]">
              Recent mood trend
            </p>
            <p className="mt-2 text-sm font-medium text-[#134E4A]">
              Slightly improving 🌱
            </p>
            <p className="mt-1 text-xs text-[#7A7A7A]">
              Progress can be slow and gentle. Every step counts.
            </p>
          </div>
        </section>

        {/* Main grid: Assessment / History / Resources / Profile */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Assessment */}
          <article className="dash-card md:col-span-2 bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-[#134E4A] mb-2">
              Start Self Assessment
            </h2>
            <p className="text-[#4F4F4F] text-sm mb-3">
              A guided set of questions to help you understand how you&apos;ve
              really been feeling—emotionally, mentally, and physically.
            </p>
            <ul className="list-disc list-inside text-[12px] text-[#7A7A7A] mb-4">
              <li>Takes around 3–5 minutes.</li>
              <li>Responses stay private to you.</li>
              <li>Helps you track patterns over time.</li>
            </ul>
            <button
              onClick={() => navigate("/assessment")}
              className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold shadow-sm shadow-[#0F766E33] transition-transform hover:-translate-y-0.5"
            >
              Begin Assessment →
            </button>
          </article>

          {/* History */}
          <article className="dash-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#134E4A] mb-2">
              Your Recent Status
            </h2>
            <p className="text-[#4F4F4F] text-sm mb-3">
              Revisit your previous assessments to notice patterns in your mood,
              energy, and stress levels.
            </p>
            <ul className="list-disc list-inside text-[12px] text-[#7A7A7A] mb-4">
              <li>Track how your scores shift over time.</li>
              <li>Notice what weeks felt easier or harder.</li>
            </ul>
            <button
              onClick={() => navigate("/history")}
              className="px-3 py-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-medium shadow-sm shadow-[#115E5933] transition-transform hover:-translate-y-0.5"
            >
              View History
            </button>
          </article>

          {/* Resources */}
          <article className="dash-card md:col-span-2 bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#134E4A] mb-2">
              Guidance & Support
            </h2>
            <p className="text-[#4F4F4F] text-sm mb-3">
              Browse simple grounding practices, self-care ideas, and mental
              health information you can return to anytime.
            </p>
            <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E4DCCF] text-[#134E4A]">
                Breathing exercises
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E4DCCF] text-[#134E4A]">
                Journaling prompts
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E4DCCF] text-[#134E4A]">
                Grounding techniques
              </span>
            </div>
            <button
              onClick={() => navigate("/resources")}
              className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold shadow-sm shadow-[#0F766E33] transition-transform hover:-translate-y-0.5"
            >
              Explore Resources →
            </button>
          </article>

          {/* Profile */}
          <article className="dash-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#134E4A] mb-2">
              Your Profile
            </h2>
            <p className="text-[#4F4F4F] text-sm mb-3">
              Update your preferences and how often Nivana reminds you to check
              in with yourself.
            </p>
            <ul className="list-disc list-inside text-[12px] text-[#7A7A7A] mb-4">
              <li>Set reminder frequency.</li>
              <li>Update your contact email.</li>
            </ul>
            <button
              onClick={() => navigate("/profile")}
              className="px-3 py-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-medium shadow-sm shadow-[#115E5933] transition-transform hover:-translate-y-0.5"
            >
              Profile Settings
            </button>
          </article>
        </section>

        {/* Today’s quick check-in */}
        <section className="dash-card bg-[#F9F4EA] border border-[#E4DCCF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#134E4A] mb-1">
            Today&apos;s Quick Check-in
          </h2>
          <p className="text-sm text-[#4F4F4F] mb-4 max-w-xl">
            In one tap, note how you&apos;re feeling right now. This doesn&apos;t
            replace the full assessment—it just gives you a gentle daily
            snapshot.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: "good", label: "Feeling okay 🙂" },
              { id: "neutral", label: "In between 😐" },
              { id: "low", label: "Feeling low 💭" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMoodClick(m.id)}
                className={`px-3 py-2 rounded-full text-xs border transition shadow-sm ${
                  mood === m.id
                    ? "bg-[#0F766E] text-white border-[#0F766E]"
                    : "bg-white border-[#E4DCCF] text-[#134E4A] hover:border-[#0F766E]/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-4 items-start">
            <div>
              <label className="block text-xs font-medium text-[#134E4A] mb-1">
                Optional note for yourself
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Anything you want to remember about today (totally optional)…"
                className="w-full text-sm rounded-2xl border border-[#E4DCCF] bg-white/80 px-3 py-2 outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              />
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#7A7A7A]">
              <p>
                Quick check-ins can help you notice patterns like: “Mondays feel
                heavier” or “I sleep better when I take breaks from my phone”.
              </p>
              <button
                type="button"
                onClick={handleSaveCheckIn}
                className="self-start px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold shadow-sm shadow-[#0F766E33] transition-transform hover:-translate-y-0.5 mt-1"
              >
                Save today&apos;s check-in (demo)
              </button>
            </div>
          </div>
        </section>

        <footer className="pt-4 text-[11px] text-[#7A7A7A] text-center">
          Nivana · Mental wellness grows from small, consistent moments of
          awareness.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
