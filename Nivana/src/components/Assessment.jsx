import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    text: "In the past 2 weeks, how often have you felt low, down, or sad?",
  },
  {
    id: 2,
    text: "How often have you felt anxious, tense, or on edge?",
  },
  {
    id: 3,
    text: "How often have you had trouble relaxing or switching off your thoughts?",
  },
  {
    id: 4,
    text: "How often have you had trouble falling or staying asleep?",
  },
  {
    id: 5,
    text: "How often have you felt that daily tasks are overwhelming?",
  },
];

const scaleLabels = {
  1: "Not at all",
  2: "Several days",
  3: "More than half the days",
  4: "Nearly every day",
};

const Assessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredCount < totalQuestions) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const sum = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const avg = sum / totalQuestions;

    let summary =
      "Your responses show that you may be experiencing some emotional changes. It could help to pay attention to your mood and daily habits.";
    if (avg <= 1.8) {
      summary =
        "Your responses suggest that you’re currently experiencing relatively few signs of stress or mood difficulty. Keep caring for your well-being.";
    } else if (avg >= 3.2) {
      summary =
        "Your responses suggest you may be going through a more challenging time emotionally. It could be helpful to talk to someone you trust or a mental health professional.";
    }

    setResult({
      score: avg.toFixed(1),
      message: summary,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5EEDF] text-[#1A1A1A] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-[#F9F4EA] border border-[#E4DCCF] rounded-3xl shadow-xl p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#0F766E]/70 mb-1">
              Nivana
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#134E4A]">
              Mental Health Self Assessment
            </h1>
            <p className="text-sm md:text-base text-[#4F4F4F] mt-2">
              This is not a diagnosis. It’s a simple reflection tool to help you
              check in with how you’ve been feeling recently.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs px-3 py-2 rounded-xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/30 hover:bg-[#0F766E]/15 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#4F4F4F] mb-1">
            <span>Progress</span>
            <span>
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E4DCCF] overflow-hidden">
            <div
              className="h-2 bg-[#0F766E] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white/60 border border-[#E4DCCF] rounded-2xl p-4 md:p-5"
            >
              <p className="text-sm md:text-base font-medium text-[#134E4A] mb-3">
                {q.id}. {q.text}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm">
                {Object.entries(scaleLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      answers[q.id] === Number(value)
                        ? "border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]"
                        : "border-[#E4DCCF] bg-white/70 text-[#4F4F4F] hover:border-[#0F766E]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={value}
                      checked={answers[q.id] === Number(value)}
                      onChange={(e) =>
                        handleAnswerChange(q.id, e.target.value)
                      }
                      className="accent-[#0F766E]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-[#7A7A7A] max-w-md">
              If your feelings are very intense or you ever feel unsafe, please
              reach out to someone you trust or a professional in your area.
            </p>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition"
            >
              Get Insight →
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white/70 border border-[#E4DCCF] rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-[#134E4A] mb-2">
              Your Reflection Summary
            </h2>
            <p className="text-xs text-[#4F4F4F] mb-1">
              Average response level: <strong>{result.score}</strong> (1–4)
            </p>
            <p className="text-sm text-[#4F4F4F] mb-3">{result.message}</p>
            <p className="text-xs text-[#7A7A7A]">
              This tool is for self-awareness only and does not replace
              professional mental health care.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
