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
import Hero3D from "./components/Hero3D";
export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>

<div className="mt-16 sm:mt-20 md:mt-24">
<Subnav />
</div>
      {/* <Hero openConsultation={() => setIsConsultationOpen(true)} /> */}
     <div className="w-full max-w-full overflow-hidden fixed sm:static left-0 top-0 sm:relative">
       <Hero3D openConsultation={() => setIsConsultationOpen(true)} />
     </div>
     
      <ServicesSection />
      <PricingSection openConsultation={() => setIsConsultationOpen(true)} />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        
      <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
      />
    </>
  );
}
