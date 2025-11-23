"use client";

import { useState } from "react";
import Hero from "../app/components/Hero"; // Correct path to Hero component
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
   <main className="w-full max-w-full ">
    

<div className="mt-16 sm:mt-20 md:mt-24">
<Subnav />
</div>
     
     <Hero openConsultation={() => setIsConsultationOpen(true)} />
     
      <ServicesSection />
      <PricingSection openConsultation={() => setIsConsultationOpen(true)} />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        
      <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
      />
      </main>
    </div>
  );
}
