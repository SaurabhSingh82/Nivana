import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaPlus, FaChevronRight, FaClipboardList, FaCheckCircle, FaTimes, FaArrowLeft } from "react-icons/fa";
import { apiService } from "../services/api";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

const getScoreColor = (score) => {
  if (!score) return "bg-gray-100 text-gray-600";
  if (score >= 4) return "bg-green-100 text-green-700";
  if (score >= 3) return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
};

export default function History() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiService.getAssessmentHistory();
        setRecords(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load history", e);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    // 🔥 Removed 'md:ml-64' to fix the extra left space
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 font-sans">
      
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                Assessment History
              </h1>
              <p className="text-gray-500 text-sm mt-1">Your private timeline of check-ins.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <button
              onClick={() => navigate("/assessments")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <FaPlus className="text-sm" /> New Check-in
            </button>
          </div>
        </motion.div>

        {/* History List */}
        <div className="grid gap-3">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-300"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 text-gray-400">...</div>
              <h3 className="text-xl font-bold text-gray-900">Loading History...</h3>
            </motion.div>
          ) : records.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-300"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 text-gray-400">📅</div>
              <h3 className="text-xl font-bold text-gray-900">No history yet</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                Start your first check-in to track your wellness journey.
              </p>
            </motion.div>
          ) : (
            records.map((r, index) => (
              <motion.div
                key={r.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelected(r)}
                className="group relative p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 cursor-pointer transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Side */}
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 shadow-inner ${getScoreColor(r.summary?.avgScore)}`}>
                    {r.summary?.avgScore || "-"}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">Daily Check-in</h3>
                      {r.day === new Date().toISOString().slice(0,10) && (
                        <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Today</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      {formatDate(r.date)}
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm shrink-0">
                     <FaChevronRight className="text-xs" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
              onClick={() => setSelected(null)} 
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gray-50 p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Session Details</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <FaCalendarAlt className="text-green-500" /> {formatDate(selected.date)}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition">
                  <FaTimes />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Summary Card */}
                {selected.summary && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Average Score</div>
                      <div className="text-2xl font-extrabold text-green-700">{selected.summary.avgScore} <span className="text-base font-normal text-green-600/70">/ 5</span></div>
                    </div>
                    <div className="text-3xl opacity-50">📊</div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaClipboardList /> Responses
                  </h4>
                  <div className="space-y-3">
                    {selected.answers && Object.entries(selected.answers).map(([questionId, value]) => (
                      <div key={questionId} className="group">
                        <div className="text-xs font-semibold text-gray-500 mb-1 capitalize ml-1">
                          {questionId.replace(/_/g, ' ')}
                        </div>
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 text-sm font-medium">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Guidance */}
                {selected.llmAnalysis && (selected.llmAnalysis.guidance || selected.llmAnalysis.guidanceText) && (
                   <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FaCheckCircle /> AI Insight
                      </h4>
                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-900 text-sm leading-relaxed">
                        {selected.llmAnalysis.guidanceText || selected.llmAnalysis.guidance}
                      </div>
                   </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={() => setSelected(null)}
                  className="w-full py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}