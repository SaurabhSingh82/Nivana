import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Resources = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-header", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".resource-card", {
        y: 25,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.1,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#F5EEDF] px-6 py-8 text-[#1A1A1A]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="page-header flex items-start justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-3 inline-flex items-center text-xs px-3 py-2 rounded-xl bg-[#0F766E]/10 border border-[#0F766E]/40 text-[#0F766E] hover:bg-[#0F766E]/20 transition"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#134E4A]">
              Guidance & Support
            </h1>
            <p className="text-sm md:text-base text-[#4F4F4F] mt-2 max-w-xl">
              Choose what feels helpful for you right now—small steps can make a
              big difference over time.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="resource-card bg-white/80 border border-[#E4DCCF] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#134E4A] mb-2">
              Need Support Right Now?
            </h2>
            <ul className="list-disc list-inside text-sm text-[#4F4F4F] space-y-1">
              <li>Talk to someone you trust about how you feel.</li>
              <li>Reach out to a counselor, therapist, or mentor.</li>
              <li>Contact local mental health or crisis helplines.</li>
            </ul>
            <p className="mt-3 text-[11px] text-[#7A7A7A]">
              If this is an emergency, please contact your local emergency
              services immediately.
            </p>
          </div>

          <div className="resource-card bg-white/80 border border-[#E4DCCF] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#134E4A] mb-2">
              Daily Grounding Practices
            </h2>
            <ul className="list-disc list-inside text-sm text-[#4F4F4F] space-y-1">
              <li>Take 5 slow, deep breaths, focusing on each exhale.</li>
              <li>Notice 3 things you can see, 3 you can hear, 3 you can feel.</li>
              <li>Write down your thoughts without judging them.</li>
              <li>Spend a few minutes outside or near a window.</li>
            </ul>
          </div>

          <div className="resource-card bg-white/80 border border-[#E4DCCF] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#134E4A] mb-2">
              Learn About Mental Health
            </h2>
            <p className="text-sm text-[#4F4F4F] mb-2">
              Understanding what you&apos;re feeling can be empowering:
            </p>
            <ul className="list-disc list-inside text-sm text-[#4F4F4F] space-y-1">
              <li>Read about stress, anxiety, and mood changes.</li>
              <li>Watch short videos or talks on mental wellness.</li>
              <li>Look for resources from trusted health organizations.</li>
            </ul>
            <p className="mt-3 text-[11px] text-[#7A7A7A]">
              Later, you can replace this block with real links from your
              backend.
            </p>
          </div>

          <div className="resource-card bg-white/80 border border-[#E4DCCF] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#134E4A] mb-2">
              Create a Small Support Plan
            </h2>
            <p className="text-sm text-[#4F4F4F] mb-2">
              You can note this down in your journal or notes app:
            </p>
            <ul className="list-disc list-inside text-sm text-[#4F4F4F] space-y-1">
              <li>One person I can talk to when I feel low.</li>
              <li>One activity that usually calms me.</li>
              <li>One small habit I want to maintain this week.</li>
            </ul>
            <p className="mt-3 text-[11px] text-[#7A7A7A]">
              In the future, Nivana can save and show this as part of your
              journey.
            </p>
          </div>
        </div>

        <p className="mt-10 text-[11px] text-[#7A7A7A] text-center">
          Nivana · You don&apos;t have to do everything today. One gentle step
          is enough.
        </p>
      </div>
    </div>
  );
};

export default Resources;
