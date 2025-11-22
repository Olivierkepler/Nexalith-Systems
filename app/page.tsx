"use client";

import { useState } from "react";
import Hero from "../app/components/Hero"; // Correct path to Hero component
import ConsultationModal from "./components/ConsultationForm";
import Subnav from "./components/Subnav";
import ServicesSection from "./components/ServicesSection";
import PricingSection from "./components/PricingSection";
import FeaturesSection from "./components/FeaturesSection";
export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>

<div className="mt-26">
<Subnav />
</div>
      <Hero openConsultation={() => setIsConsultationOpen(true)} />
      <ServicesSection />
      <PricingSection openConsultation={() => setIsConsultationOpen(true)} />
        <FeaturesSection />
      <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
      />
    </>
  );
}
