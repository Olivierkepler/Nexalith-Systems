"use client";

import { useState } from "react";
import Hero from "../app/components/Hero";
import ConsultationModal from "./components/ConsultationForm";
import Subnav from "./components/Subnav";
import ServicesSection from "./components/ServicesSection";
import PricingSection from "./components/PricingSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";

export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex justify-center">
      <main className="w-full max-w-full mx-auto  ">

        {/* Subnav */}
        <div className="mt-16 sm:mt-20 md:mt-24 flex justify-center">
          <Subnav />
        </div>

        {/* Hero */}
        <Hero openConsultation={() => setIsConsultationOpen(true)} />

        {/* Main Sections */}
        <div className="flex flex-col items-center w-full">
          <ServicesSection />
          <PricingSection openConsultation={() => setIsConsultationOpen(true)} />
          <FeaturesSection />
          <TestimonialsSection />
          <FAQSection />
        </div>

        {/* Modal */}
        <ConsultationModal
          isOpen={isConsultationOpen}
          setIsOpen={setIsConsultationOpen}
        />
      </main>
    </div>
  );
}
