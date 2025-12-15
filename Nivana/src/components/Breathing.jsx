
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaRedo, FaArrowLeft } from "react-icons/fa";

// Box Breathing configuration
const BOX_BREATHING = {
  title: "Box Breathing",
  desc: "A simple, powerful technique to calm your mind and body by synchronizing your breath.",
  steps: [
    { label: "Breathe In", duration: 4 },
    { label: "Hold", duration: 4 },
    { label: "Breathe Out", duration: 4 },
    { label: "Hold", duration: 4 },
  ],
};

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0, 1, 2, 3
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(BOX_BREATHING.steps[0].duration);
  
  const timerRef = useRef(null);

  // Animate the circle and text based on the current phase
  const currentStep = BOX_BREATHING.steps[phase];
  const totalDuration = BOX_BREATHING.steps.reduce((sum, step) => sum + step.duration, 0);

  // Handles the timer tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          // Move to the next phase
          setPhase((p) => (p + 1) % BOX_BREATHING.steps.length);
          return BOX_BREATHING.steps[(phase + 1) % BOX_BREATHING.steps.length].duration;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, phase]);

  const togglePlay = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase(0);
    setCountdown(BOX_BREATHING.steps[0].duration);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 text-gray-800 font-sans p-4">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm z-10"
      >
        <FaArrowLeft />
      </button>

      <div className="w-full max-w-lg text-center flex flex-col items-center">

        {/* Title and Description */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{BOX_BREATHING.title}</h1>
          <p className="text-gray-500 mt-2 text-base max-w-md mx-auto">{BOX_BREATHING.desc}</p>
        </motion.div>

        {/* Visualizer Area */}
        <div className="relative w-80 h-80 my-12 flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key={phase}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="text-5xl font-bold text-teal-600 mb-2">{countdown}</div>
              <div className="text-xl font-semibold text-gray-700">{currentStep.label}</div>
            </motion.div>
          </AnimatePresence>
          
          {/* Animated SVG Circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            {isActive && (
              <motion.circle
                className="text-teal-500"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={0}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
                initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: currentStep.duration, ease: "linear" }}
                key={`circle-${phase}`} // Re-trigger animation on phase change
              />
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={reset}
            className="p-4 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-100 transition"
            aria-label="Reset"
          >
            <FaRedo />
          </button>
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white text-2xl flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition"
            aria-label={isActive ? "Pause" : "Play"}
          >
            {isActive ? <FaPause /> : <FaPlay />}
          </button>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

      </div>
    </div>
  );
};

export default BreathingExercise;
