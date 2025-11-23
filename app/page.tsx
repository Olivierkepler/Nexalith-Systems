"use client";

import { useState } from "react";
import Subnav from "./components/Subnav";

export default function HomePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
   <main className="w-full max-w-full ">
    

<div className="mt-16 sm:mt-20 md:mt-24">
<Subnav />
</div>
     
    
      </main>
    </div>
  );
}
