"use client";

import { useState, useRef, useEffect } from "react";
import { X, CheckCircle, ArrowRight } from "lucide-react";

export default function ConsultationModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

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

  // Close modal when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
        setStep(1);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutside);
    }

    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <>
      {/* GET STARTED BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="px-8 py-4 text-lg font-semibold bg-black text-white rounded-xl 
                   hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
      >
        Get Started
        <ArrowRight className="h-5 w-5" />
      </button>

      {/* MODAL OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          {/* MODAL PANEL */}
          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 
                       animate-scaleFade p-8"
          >
            {/* CLOSE */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setOpen(false);
                setStep(1);
              }}
            >
              <X className="h-5 w-5" />
            </button>

            {/* PROGRESS STEPS */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold 
                      ${
                        step === s
                          ? "bg-indigo-600 text-white"
                          : step > s
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }
                    `}
                  >
                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>

                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full
                        ${
                          step > s
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }
                      `}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1 — SERVICE SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Which service do you need?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s.title)}
                      className={`
                        p-5 border rounded-xl cursor-pointer transition-all
                        ${
                          selectedService === s.title
                            ? "border-indigo-600 bg-indigo-50 shadow"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }
                      `}
                    >
                      <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                        {selectedService === s.title && (
                          <CheckCircle className="h-5 w-5 text-indigo-600" />
                        )}
                        {s.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => selectedService && setStep(2)}
                    disabled={!selectedService}
                    className={`px-6 py-3 rounded-lg font-semibold text-white
                      ${
                        selectedService
                          ? "bg-indigo-600 hover:bg-indigo-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                    `}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — FORM */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeSlideUp">
                <h2 className="text-2xl font-bold">Tell us about your project</h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Phone (Optional)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Describe your project..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[100px]"
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 rounded-lg border border-gray-300"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — PREVIEW & SUBMIT */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeSlideUp">
                <h2 className="text-2xl font-bold">Review Your Request</h2>

                <div className="border rounded-xl p-4 space-y-2 bg-gray-50 text-sm">
                  <p><strong>Service:</strong> {selectedService}</p>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  {formData.phone && (
                    <p><strong>Phone:</strong> {formData.phone}</p>
                  )}
                  <p><strong>Details:</strong> {formData.details}</p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 rounded-lg border border-gray-300"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => alert("Submitted! (Connect API Here)")}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
