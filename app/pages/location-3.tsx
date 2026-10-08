"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import weddingVenue from "@/src/assets/venue.png";
import { MapPin } from "lucide-react";

import { serif, script, serif_2 } from "@/src/lib/font";

const Location = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 } 
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";

  // Placeholder link Google Maps
  const mapsLink = "https://maps.app.goo.gl/4Ci664GBmvkZUcKj9"; 

  return (
    <section 
      ref={ref} 
      className={`${serif_2.className} text-navy flex flex-col items-center px-8 py-20 overflow-hidden bg-[#FFFFFF]`}
    >
      
      {/* 1. GAMBAR VENUE */}
      <div className={`${baseTransition} ${
        isVisible ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-90 blur-md"
      }`}>
        <Image 
          src={weddingVenue} 
          alt="Wedding Venue" 
          placeholder="blur"
          className="w-[200px] sm:w-[250px] h-auto drop-shadow-sm"
        />
      </div>

      {/* 2. JUDUL LOKASI */}
      <div className={`flex flex-row items-center justify-center mb-2 md:mb-4 mt-6 gap-2 ${baseTransition} delay-[300ms] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      }`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic text-navy">Lokasi</h1>
        <div className={`${isVisible ? "animate-bounce" : ""}`}>
          <MapPin size={28} className="text-white" fill="#293952" />
        </div>
      </div>

      {/* 3. PARAGRAF */}
      <p className={`text-center text-[0.85rem] sm:text-sm md:text-base lg:text-lg font-normal mb-6 w-full md:w-[70%] lg:w-[50%] opacity-90 ${baseTransition} delay-[600ms] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        Bertempat di rumah kami, Desa Gondang RT 1C, RW 1, Kecamatan Watumalang, Kabupaten Wonosobo
      </p>

      {/* 4. TOMBOL MAPS (Diubah menjadi tag <a>) */}
      <a 
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`h-10 sm:h-12 bg-navy hover:bg-navy-alt text-white font-semibold rounded-md flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${baseTransition} delay-[900ms] ${
          isVisible 
            ? "opacity-100 w-[90%] md:w-[75%] lg:w-[45%] scale-100" 
            : "opacity-0 w-[40%] scale-75"
        }`}
      >
        <MapPin size={18} />
        Buka Maps
      </a>

    </section>
  );
}

export default Location;