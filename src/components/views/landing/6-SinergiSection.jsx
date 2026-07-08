"use client";
import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";

export default function SinergiSection() {
  const [networks, setNetworks] = useState(
    Array(4).fill({ name: "PT Maharani Globalindo", logoUrl: "", linkUrl: "" })
  );

  useEffect(() => {
    fetch("/api/partner")
      .then((res) => res.json())
      .then((data) => {
        if (data.partners?.length > 0) {
          setNetworks(data.partners);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-[#F1F1F1] py-[clamp(3rem,8vh,6rem)] px-6 flex flex-col items-center">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-[clamp(2rem,5vh,3rem)] items-center">
        
        <FadeUp delay={0.1} className="text-center flex flex-col gap-4 max-w-3xl">
          <h2 className="text-black text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-10">Jejaring Sinergi Kami</h2>
          <p className="text-black text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
            Setiap unit bisnis kami bekerja dalam harmoni untuk memperkuat visi besar perusahaan. Melalui spesialisasi yang mendalam, kami menghadirkan solusi yang komprehensif bagi setiap tantangan konstruksi yang Anda hadapi.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-4">
          {networks.map((item, idx) => {
            const displayName = item.name || item.title || "PT Maharani Globalindo";
            const logo = item.logoUrl || "/logo-scs.svg"; // Fallback to logo-scs or a nice default
            const hasLink = !!item.linkUrl;
            const WrapperComponent = hasLink ? "a" : "div";

            return (
              <FadeUp key={idx} delay={0.2 + (idx * 0.1)} className="flex flex-col items-center gap-4 text-center">
                <WrapperComponent 
                  href={item.linkUrl || undefined}
                  target={hasLink ? "_blank" : undefined}
                  rel={hasLink ? "noopener noreferrer" : undefined}
                  className={`w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200 shadow-sm p-4 ${
                    hasLink ? "hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer" : ""
                  }`}
                >
                  <img src={logo} alt={displayName} className="w-full h-full object-contain" />
                </WrapperComponent>
                <h3 className="text-black text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
                  {hasLink ? (
                    <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-900 transition-colors">
                      {displayName}
                    </a>
                  ) : (
                    displayName
                  )}
                </h3>
              </FadeUp>
            );
          })}
        </div>

      </div>
    </section>
  );
}