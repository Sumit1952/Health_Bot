import React from 'react';
import hospitalBedImg from '../assets/hospital-bed.jpg';

export function HeroSection({ children }) {
  return (
    <section 
      id="home" 
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url(${hospitalBedImg})` }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </div>
    </section>
  );
}


