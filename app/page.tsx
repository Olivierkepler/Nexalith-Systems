"use client";

import { useState } from "react";
import Subnav from "./components/Subnav";
import Hero from "./components/Hero";
import ConsultationModal from "./components/ConsultationForm";
export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
   <main className="w-full max-w-full ">
   <Subnav />
   <Hero openConsultation={() => setIsConsultationOpen(true)} />
   <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
      />

   
     
    
      </main>
    </div>
  );
}
