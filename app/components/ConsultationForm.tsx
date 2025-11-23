"use client";

import { useState, useRef, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

export default function ConsultationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const services = [
    {
      id: "chatbot",
      title: "AI Chatbot Development",
      desc: "Custom-trained chatbots for websites, support, and sales.",
    },
    {
      id: "automation",
      title: "AI Automation Systems",
      desc: "Automate workflows, emails, and business processes.",
    },
    {
      id: "software",
      title: "Custom AI Software",
      desc: "Build tailored AI tools and dashboards for business.",
    },
    {
      id: "integration",
      title: "Website & App AI Integration",
      desc: "Connect AI features into your site or application.",
    },
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setStep(1);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative animate-scaleFade max-h-[90vh] overflow-y-auto"
      >
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={() => {
            setIsOpen(false);
            setStep(1);
          }}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base
                ${
                  step === s
                    ? "bg-indigo-600"
                    : step > s
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : s}
              </div>

              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${
                    step > s ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Select Service */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6 animate-fadeSlideUp">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center px-2">
              Which service do you need?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.title)}
                  className={`p-4 sm:p-5 border rounded-lg sm:rounded-xl cursor-pointer transition-all 
                ${
                  selectedService === s.title
                    ? "bg-indigo-50 border-indigo-600 shadow"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow"
                }`}
                >
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    {selectedService === s.title && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
                    )}
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className={`px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base w-full sm:w-auto
              ${
                selectedService
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — FORM */}
        {step === 2 && (
          <div className="space-y-4 sm:space-y-6 animate-fadeSlideUp">
            <h2 className="text-xl sm:text-2xl font-bold">Tell us about your project</h2>

            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <textarea
                placeholder="Describe your project..."
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 min-h-[100px] text-sm sm:text-base resize-none"
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
              <button
                onClick={() => setStep(1)}
                className="px-5 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm sm:text-base w-full sm:w-auto"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-5 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm sm:text-base w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Preview */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-6 animate-fadeSlideUp">
            <h2 className="text-xl sm:text-2xl font-bold">Review Your Request</h2>

            <div className="border rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-50 text-xs sm:text-sm space-y-2">
              <p><strong>Service:</strong> {selectedService}</p>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
              <p><strong>Details:</strong> {formData.details}</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
              <button
                onClick={() => setStep(2)}
                className="px-5 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm sm:text-base w-full sm:w-auto"
              >
                Back
              </button>

              <button
                onClick={() => {
                  alert("Submitted! Connect API here.");
                  setIsOpen(false);
                  setStep(1);
                }}
                className="px-5 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 text-sm sm:text-base w-full sm:w-auto"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
