import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Guidance() {
  const navigate = useNavigate();

  const tips = [
    {
      title: "Mindful Breathing",
      desc: "A simple deep breathing exercise to calm your nervous system.",
      icon: "🌬️",
    },
    {
      title: "Stay Present",
      desc: "Ground yourself by noticing 5 things you can see, hear, or feel.",
      icon: "🎧",
    },
    {
      title: "Small Wins Matter",
      desc: "Celebrate even tiny progress — it builds momentum.",
      icon: "🏆",
    },
    {
      title: "Healthy Boundaries",
      desc: "Learn to say no to protect your energy and mental clarity.",
      icon: "🧱",
    },
  ];

  const features = [
    {
      title: "Guided Meditations",
      desc: "Short 2–10 minute audio practices for grounding and sleep.",
      icon: "🎧",
      route: "/meditation",
      color: "bg-purple-100",
    },
    {
      title: "Private Journaling",
      desc: "Daily prompts to reflect and build small habits.",
      icon: "📓",
      route: "/journal",
      color: "bg-blue-100",
    },
    {
      title: "Ambient Soundscape",
      desc: "Nature-based themes and soft ambient audio for calm.",
      icon: "🌿",
      route: "/sounds",
      color: "bg-green-100",
    },
    {
      title: "Laughter Therapy",
      desc: "Light humor pieces designed for mood-lifting.",
      icon: "😄",
      route: "/laughter",
      color: "bg-yellow-100",
    },
    {
      title: "Mood Tracking",
      desc: "Visualize mood patterns across days and weeks.",
      icon: "📈",
      route: "/dashboard",
      color: "bg-pink-100",
    },
  ];

  // Common styles to ensure uniformity
  const cardBaseStyle = "relative h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-start transition-all duration-300";
  const hoverStyle = "hover:shadow-md hover:-translate-y-1 cursor-pointer";

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-800 font-sans">
      
      {/* Content Wrapper */}
      <div className="p-6 md:p-8 lg:p-12 md:pl-72 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Guidance</h1>
            <p className="text-gray-500 mt-2 text-base">
              Explore tools and insights for emotional clarity.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium shadow hover:bg-gray-800 transition transform active:scale-95"
          >
            🏠 Dashboard
          </button>
        </motion.div>

        {/* ================= TIPS SECTION ================= */}
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${cardBaseStyle} bg-white/60`}
                >
                <div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-3">
                    {tip.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
                </div>
                </motion.div>
            ))}
            </div>
        </div>

        {/* ================= FEATURES SECTION (Arrow removed) ================= */}
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Tools & Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => navigate(item.route)}
                className={`${cardBaseStyle} ${hoverStyle}`}
                >
                {/* Icon Area */}
                <div className={`w-14 h-14 rounded-2xl ${item.color || "bg-gray-100"} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                    {item.icon}
                </div>

                {/* Content Area */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                    </p>
                </div>
                </motion.div>
            ))}
            </div>
        </div>

      </div>
    </div>
  );
}