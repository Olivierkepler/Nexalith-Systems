"use client";

import { useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ClipboardList,
  Ruler,
  Layers,
  Sparkles,
} from "lucide-react";
import { generateEstimatePDF } from "../../utils/generatePDF";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

type ServiceType = "kitchen" | "bathroom" | "flooring";
type MaterialLevel = "basic" | "standard" | "premium";

type EstimatorPanelProps = {
  open: boolean;
  onClose: () => void;
  onSendToChat: (markdown: string) => void;
  isDark: boolean;
};

const serviceLabels: Record<ServiceType, string> = {
  kitchen: "Kitchen Remodel",
  bathroom: "Bathroom Remodel",
  flooring: "Flooring Installation",
};

const materialLabels: Record<MaterialLevel, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

// Realistic contractor pricing formulas
const baseMinCost: Record<ServiceType, number> = {
  kitchen: 8000,
  bathroom: 6000,
  flooring: 1200,
};

const costPerSqFt: Record<ServiceType, number> = {
  kitchen: 160,
  bathroom: 140,
  flooring: 8,
};

const materialMultipliers: Record<ServiceType, Record<MaterialLevel, number>> = {
  kitchen: {
    basic: 1.0,
    standard: 1.3,
    premium: 1.6,
  },
  bathroom: {
    basic: 1.0,
    standard: 1.25,
    premium: 1.5,
  },
  flooring: {
    basic: 1.0,
    standard: 1.4,
    premium: 1.8,
  },
};

const STEPS: { id: 1 | 2 | 3 | 4 | 5; label: string; description: string }[] = [
  { id: 1, label: "Project Type", description: "Choose what you’re renovating." },
  { id: 2, label: "Room Size", description: "Tell us the approximate square footage." },
  { id: 3, label: "Materials", description: "Select your finish level." },
  { id: 4, label: "Extras", description: "Add any likely additional work." },
  { id: 5, label: "Summary", description: "Review and export your estimate." },
];

export default function EstimatorPanel({
  open,
  onClose,
  onSendToChat,
  isDark,
}: EstimatorPanelProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [service, setService] = useState<ServiceType | null>(null);
  const [roomSize, setRoomSize] = useState<string>("");
  const [material, setMaterial] = useState<MaterialLevel>("standard");
  const [extras, setExtras] = useState({
    demolition: false,
    plumbing: false,
    electrical: false,
  });

  const parsedSqFt = useMemo(() => {
    const n = Number(roomSize);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [roomSize]);

  const estimate = useMemo(() => {
    if (!service || !parsedSqFt) return null;

    const base = baseMinCost[service];
    const perSq = costPerSqFt[service];
    const mult = materialMultipliers[service][material];

    let total = Math.max(base, perSq * parsedSqFt * mult);
    const breakdown: string[] = [];

    breakdown.push(
      `Base & size-adjusted cost: approx. $${(
        perSq * parsedSqFt * mult
      ).toFixed(0)}`
    );

    // Extras
    if (extras.demolition) {
      if (service === "flooring") {
        const demo = parsedSqFt * 1.75;
        total += demo;
        breakdown.push(`Existing floor tear-out: approx. $${demo.toFixed(0)}`);
      } else {
        total += 700;
        breakdown.push("Demolition / tear-out: approx. $700");
      }
    }

    if (extras.plumbing && (service === "kitchen" || service === "bathroom")) {
      const plumbing = service === "bathroom" ? 900 : 750;
      total += plumbing;
      breakdown.push(
        `Plumbing adjustments (${serviceLabels[service]}): approx. $${plumbing}`
      );
    }

    if (extras.electrical) {
      const electrical = service === "kitchen" ? 950 : 600;
      total += electrical;
      breakdown.push(`Electrical updates: approx. $${electrical}`);
    }

    const low = total * 0.9;
    const high = total * 1.15;

    return {
      total,
      low,
      high,
      breakdown,
    };
  }, [service, parsedSqFt, material, extras]);

  const canNext = () => {
    if (step === 1) return !!service;
    if (step === 2) return !!parsedSqFt;
    if (step === 3) return !!material;
    return true;
  };

  const next = () => {
    if (!canNext()) return;
    setStep((prev) => (prev < 5 ? ((prev + 1) as typeof prev) : prev));
  };

  const back = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as typeof prev) : prev));
  };

  const reset = () => {
    setStep(1);
    setService(null);
    setRoomSize("");
    setMaterial("standard");
    setExtras({
      demolition: false,
      plumbing: false,
      electrical: false,
    });
  };

  // SEND TO CHAT
  const handleSendToChat = () => {
    if (!service || !parsedSqFt || !estimate) return;

    const { low, high, breakdown } = estimate;

    const selectedExtras = Object.entries(extras)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, " $1").toLowerCase());

    const markdown = [
      `### 🧮 Estimate Summary – ${serviceLabels[service]}`,
      "",
      `- **Project:** ${serviceLabels[service]}`,
      `- **Room Size:** ${parsedSqFt} sq ft`,
      `- **Materials:** ${materialLabels[material]}`,
      selectedExtras.length
        ? `- **Extras:** ${selectedExtras.join(", ")}`
        : `- **Extras:** None`,
      "",
      `**Estimated Range:** $${low.toFixed(0)} – $${high.toFixed(0)}`,
      "",
      breakdown.length
        ? `**Breakdown:**\n${breakdown.map((b) => `- ${b}`).join("\n")}`
        : "",
      "",
      "> Ballpark estimate. Final pricing confirmed after on-site inspection.",
    ]
      .filter(Boolean)
      .join("\n");

    onSendToChat(markdown);
    onClose();
    reset();
  };

  // PDF EXPORT
  const handleDownloadPDF = () => {
    if (!service || !parsedSqFt || !estimate) return;

    generateEstimatePDF({
      roomType: serviceLabels[service],
      sqft: parsedSqFt,
      material: materialLabels[material],
      laborCost: estimate.total * 0.55,
      materialCost: estimate.total * 0.45,
      total: estimate.total,
    });
  };

  const containerBase = `
    h-full flex flex-col rounded-2xl border shadow-xl overflow-hidden
    ${
      isDark
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-slate-50"
        : "bg-gradient-to-br from-white via-slate-50 to-white border-slate-200 text-slate-900"
    }
  `;

  const currentStepMeta = STEPS.find((s) => s.id === step);

  const showLiveSummary = step >= 2 && step <= 4 && estimate && parsedSqFt && service;

  return (
 
  <AnimatePresence mode="wait">
    {open && (
      <motion.div
        key="estimatorPanel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="h-full"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={containerBase}
        >

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-orange-500/50 dark:border-orange-500/50">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-xl
                ${
                  isDark
                    ? "bg-orange-500/10 border border-orange-500/40"
                    : "bg-orange-50 border border-orange-200"
                }
              `}
            >
              <ClipboardList className="w-4 h-4 text-orange-500" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-orange-500 font-semibold">
                  Project Estimator
                </span>
                <span
                  className={`
                    inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium
                    ${
                      isDark
                        ? "bg-slate-800 text-slate-300 border border-slate-700"
                        : "bg-white text-slate-600 border border-slate-200"
                    }
                  `}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Under 60 seconds
                </span>
              </div>
              <div className="text-sm font-semibold flex items-center gap-2">
                <span>
                  Step {step} of 5 · {currentStepMeta?.label}
                </span>
                {service && (
                  <span
                    className={`
                      text-[11px] px-2 py-0.5 rounded-full border
                      ${
                        isDark
                          ? "border-slate-700 bg-slate-900 text-slate-200"
                          : "border-slate-300 bg-white text-slate-700"
                      }
                    `}
                  >
                    {serviceLabels[service]}
                  </span>
                )}
              </div>
              {currentStepMeta?.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentStepMeta.description}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className={`
              inline-flex cursor-pointer items-center justify-center h-8 w-8 rounded-full border text-[11px]
              ${
                isDark
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  : "border-slate-300 bg-white hover:bg-slate-50"
              }
            `}
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Top Step Indicator */}
        <div className="px-4 pt-3">
          <div
            className={`
              flex items-center justify-between rounded-xl px-3 py-2 text-[11px]
              ${
                isDark
                  ? "bg-slate-900/80 border border-slate-800"
                  : "bg-white/80 border border-slate-200"
              }
            `}
          >
            {STEPS.map((s) => {
              const isCompleted = s.id < step;
              const isActive = s.id === step;
              return (
                <div
                  key={s.id}
                  className="flex-1 flex flex-col items-center gap-1 text-center"
                >
                  <div
                    className={`
                      flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-semibold
                      ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-orange-500 text-white shadow-sm"
                          : isDark
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : s.id}
                  </div>
                  <span
                    className={`
                      hidden md:inline-block leading-tight
                      ${
                        isActive
                          ? "text-[11px] font-semibold text-orange-500"
                          : "text-[10px] text-slate-500"
                      }
                    `}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto text-sm">
          {/* Optional live mini-summary when in the middle steps */}
          {showLiveSummary && estimate && service && parsedSqFt && (
            <div
              className={`
                hidden md:flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs
                ${
                  isDark
                    ? "bg-slate-900/80 border border-slate-800"
                    : "bg-white border border-slate-200"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="font-medium">
                    {serviceLabels[service]} · {parsedSqFt} sq ft
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Materials: {materialLabels[material]}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Live estimate
                </div>
                <div className="text-sm font-semibold">
                  ${estimate.low.toFixed(0)} – ${estimate.high.toFixed(0)}
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}

          <AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25 }}
    className="space-y-4"
  >
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Select the main type of project you want to price. You can
                refine details in the next steps.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {(["kitchen", "bathroom", "flooring"] as ServiceType[]).map(
                  (s) => {
                    const isActive = service === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setService(s)}
                        className={`
                          group text-left cursor-pointer px-3 py-2.5 rounded-xl border text-xs md:text-sm
                          flex items-center justify-between gap-2
                          transition-all duration-150
                          ${
                            isActive
                              ? "border-orange-500/80 bg-orange-50/90 text-orange-900 shadow-sm dark:bg-orange-500/10 dark:text-orange-50"
                              : isDark
                              ? "border-slate-700 bg-slate-900 hover:border-orange-500/60 hover:bg-slate-900/80"
                              : "border-slate-200 bg-white hover:border-orange-400/70 hover:bg-orange-50/40"
                          }
                        `}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {serviceLabels[s]}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {s === "kitchen" &&
                              "Cabinets, counters, layout updates, fixtures."}
                            {s === "bathroom" &&
                              "Vanity, tile, shower/tub, fixtures, lighting."}
                            {s === "flooring" &&
                              "Material + installation for a defined area."}
                          </span>
                        </div>
                        <Layers
                          className={`
                            w-4 h-4
                            ${
                              isActive
                                ? "text-orange-500"
                                : "text-slate-400 group-hover:text-orange-400"
                            }
                          `}
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Provide your best estimate of the room size in square feet. It
                doesn’t need to be exact—this is just for a ballpark.
              </p>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Room size (sq ft)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-orange-400
                      ${
                        isDark
                          ? "bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }
                    `}
                    placeholder="e.g. 120"
                  />
                </div>
                {!parsedSqFt && roomSize && (
                  <p className="text-[11px] text-red-500">
                    Please enter a valid room size greater than 0.
                  </p>
                )}
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tip: For a rectangular room, multiply length × width. For
                  example, 10 ft × 12 ft ≈ 120 sq ft.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Choose the level of finish that best matches what you have in
                mind. You can always revise this later.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {(["basic", "standard", "premium"] as MaterialLevel[]).map(
                  (lvl) => {
                    const isActive = material === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setMaterial(lvl)}
                        className={`
                          text-left px-3 py-2.5 cursor-pointer rounded-xl border text-xs md:text-sm
                          transition-all duration-150
                          ${
                            isActive
                              ? "border-orange-500/80 bg-orange-50/90 text-orange-900 shadow-sm dark:bg-orange-500/10 dark:text-orange-50"
                              : isDark
                              ? "border-slate-700 bg-slate-900 hover:border-orange-500/60 hover:bg-slate-900/80"
                              : "border-slate-200 bg-white hover:border-orange-400/70 hover:bg-orange-50/40"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">
                              {materialLabels[lvl]}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lvl === "basic" &&
                                "Durable, cost-conscious materials with clean finishes."}
                              {lvl === "standard" &&
                                "Balanced mix of quality, style, and value."}
                              {lvl === "premium" &&
                                "High-end materials, custom details, and upgraded finishes."}
                            </p>
                          </div>
                          <span
                            className={`
                              inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium
                              ${
                                lvl === "premium"
                                  ? "bg-amber-500/10 text-amber-600 border border-amber-300/60 dark:text-amber-300"
                                  : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                              }
                            `}
                          >
                            {lvl === "basic" && "Entry level"}
                            {lvl === "standard" && "Most popular"}
                            {lvl === "premium" && "Luxury"}
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Select any additional work you think may be needed. These values
                help adjust the estimate closer to real-world conditions.
              </p>

              <div className="space-y-2 text-xs md:text-sm">
                {([
                  { key: "demolition" as const, label: "Demolition / tear-out" },
                  { key: "plumbing" as const, label: "Plumbing adjustments" },
                  { key: "electrical" as const, label: "Electrical updates" },
                ] as const).map((opt) => (
                  <label
                    key={opt.key}
                    className={`
                      flex items-center justify-between gap-3 cursor-pointer rounded-xl px-3 py-2
                      border transition-all duration-150
                      ${
                        extras[opt.key]
                          ? "border-orange-500/70 bg-orange-50/70 dark:bg-orange-500/10"
                          : isDark
                          ? "border-slate-700 bg-slate-900 hover:border-orange-500/60 hover:bg-slate-900/80"
                          : "border-slate-200 bg-white hover:border-orange-400/70 hover:bg-orange-50/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extras[opt.key]}
                        onChange={(e) =>
                          setExtras((prev) => ({
                            ...prev,
                            [opt.key]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                      />
                      <span className="font-medium">{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {opt.key === "demolition" &&
                        "Includes removal of existing surfaces or fixtures."}
                      {opt.key === "plumbing" &&
                        "Moving drains, supplies, or adding new lines."}
                      {opt.key === "electrical" &&
                        "New circuits, lighting, or outlet changes."}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Review the summary below. You can export a PDF or send this
                estimate into the chat for follow-up questions.
              </p>

              <div
                className={`
                  rounded-2xl border px-3 py-3 text-xs md:text-sm space-y-2
                  ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70"
                      : "border-slate-200 bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">
                    {service ? serviceLabels[service] : "Project"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
                  <div>
                    <span className="font-medium">Room size:</span>{" "}
                    {parsedSqFt ? `${parsedSqFt} sq ft` : "Not set"}
                  </div>
                  <div>
                    <span className="font-medium">Materials:</span>{" "}
                    {materialLabels[material]}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Extras:</span>{" "}
                    {Object.values(extras).some(Boolean)
                      ? Object.entries(extras)
                          .filter(([, v]) => v)
                          .map(([k]) =>
                            k.replace(/([A-Z])/g, " $1").toLowerCase()
                          )
                          .join(", ")
                      : "None"}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Estimated range (all-in)
                      </div>
                      {estimate && parsedSqFt && service ? (
                        <div className="text-base font-semibold">
                          ${estimate.low.toFixed(0)} – $
                          {estimate.high.toFixed(0)}
                        </div>
                      ) : (
                        <div className="text-[11px] text-red-500">
                          Missing data for calculation.
                        </div>
                      )}
                    </div>
                    {estimate && (
                      <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                        <div>Includes labor & materials.</div>
                        <div>Exact pricing confirmed on-site.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={!estimate || !service || !parsedSqFt}
                className={`
                  w-full mt-1 py-2.5 cursor-pointer rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2
                  ${
                    estimate && service && parsedSqFt
                      ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                <ClipboardList className="w-4 h-4" />
                Download PDF Estimate
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This is a ballpark estimate based on typical regional pricing.
                A licensed contractor will confirm scope, material selections,
                and final costs during an in-person visit.
              </p>
            </div>
          )}

</motion.div>
</AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="px-4 py-3 border-t border-orange-500/50 dark:border-orange-500/50 flex items-center justify-between gap-2 text-xs">
          <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
            type="button"
            onClick={step === 1 ? onClose : back}
            className={`
              inline-flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full border
              transition-colors
              ${
                isDark
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  : "border-slate-300 bg-white hover:bg-slate-50"
              }
            `}
          >
            {step === 1 ? (
              <>
                <X className="w-3 h-3" /> Close
              </>
            ) : (
              <>
                <ChevronLeft className="w-3 h-3" /> Back
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="button"
              onClick={reset}
              className={`
                hidden md:inline-flex items-center cursor-pointer gap-1 px-3 py-1.5 rounded-full border text-[11px]
                transition-colors
                ${
                  isDark
                    ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }
              `}
            >
              Reset
            </motion.button>

            {step < 5 && (
           <motion.button
           whileTap={{ scale: 0.95 }}
           whileHover={{ scale: 1.03 }}
           transition={{ type: "spring", stiffness: 300 }}
                type="button"
                disabled={!canNext()}
                onClick={next}
                className={`
                  inline-flex items-center cursor-pointer gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-150
                  ${
                    canNext()
                      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                Next <ChevronRight className="w-3 h-3" />
                </motion.button>
            )}

            {step === 5 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="button"
                disabled={!estimate || !service || !parsedSqFt}
                onClick={handleSendToChat}
                className={`
                  inline-flex items-center cursor-pointer   gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-150
                  ${
                    estimate && service && parsedSqFt
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                <Check className="w-3 h-3" />
                Send estimate to chat
              </motion.button>
            )}
          </div>
        </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
} 