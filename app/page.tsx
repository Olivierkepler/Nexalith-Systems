"use client";

import { useState } from "react";
import Hero from "../app/components/Hero"; // Correct path to Hero component
import ConsultationModal from "./components/ConsultationForm";
import Subnav from "./components/Subnav";
export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
<Subnav />
      <Hero openConsultation={() => setIsConsultationOpen(true)} />

      <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
      />
    </>
  );
}
