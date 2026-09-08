import React from 'react';

const heroImageUrl = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export function HeroSection({ children }) {
  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative z-10 text-center lg:text-left">
            <div className="max-h-[700px] overflow-y-auto pr-0 lg:pr-4">
              {children}
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0 h-96 lg:h-auto lg:aspect-[4/3.5]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[280px] h-[420px] sm:w-[350px] sm:h-[525px] md:w-[400px] md:h-[600px] rounded-full overflow-hidden shadow-2xl border-4 border-white/50">
                <img
                  src={heroImageUrl}
                  alt="A doctor discussing with a patient in a modern medical setting."
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 sm:right-10 w-32 h-32 md:w-40 md:h-40 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M168 168V0C75.2284 0 0 75.2284 0 168H168Z" fill="#D9A443" fillOpacity="0.6"/>
                <path d="M140 168V56C103.732 56 74 85.732 74 122V168H140Z" stroke="#297272" strokeWidth="2"/>
                <path d="M112 168V94C99.2975 94 89 104.297 89 117V168H112Z" stroke="#297272" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
