"use client";

import { useState } from "react";
import Subnav from "./components/Subnav";
import Hero from "../app/components/Hero";


export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
   <main className="w-full max-w-full ">
   <Subnav />
 <div className="w-full max-w-full overflow-hidden fixed sm:static left-0 top-0 sm:relative">
 <Hero openConsultation={() => setIsConsultationOpen(true)} />
 </div>
  
 
  
    

    
      </main>
    </div>
  );
}
