"use client";

import Image from 'next/image';
import React from 'react';
import { serif, script } from '@/src/lib/font';

import { useEnvelope } from "@/src/context/EnvelopeContext"; 
import floralVertical from "../../src/assets/floral-blue-white-vertical-side.png";
import QuranFlipbook from '@/components/Quranflipbook';


const Quran = () => {
  const { isOpened } = useEnvelope();
  const repeatCount = 5;

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 sm:px-8 md:px-16 text-center overflow-hidden bg-[#FFFFFF]">
      
      {/* BUNGA ATAS */}
      <div
        className={`pointer-events-none absolute top-0 left-0 z-20 flex w-full justify-center overflow-hidden transition-all duration-[1500ms] ease-out ${
          isOpened ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        {Array.from({ length: repeatCount }).map((_, index) => (
          <Image
            key={`floral-top-${index}`}
            src={floralVertical}
            alt={`Dekorasi Bunga Atas ${index + 1}`}
            placeholder='blur'
            className="w-full sm:min-w-[100%] md:min-w-[480px] md:max-w-[480px] shrink-0 h-auto object-cover"
          />
        ))}
      </div>
      
      {/* 
        PEMBUNGKUS KONTEN UTAMA
        Mobile: flex-col (atas-bawah)
        Desktop (lg): flex-row (kiri-kanan)
      */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-24 sm:py-32 lg:py-0 transition-all duration-[1200ms] delay-300 ${
        isOpened ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}>
        
        {/* TEKS SALAM (Bagian Kiri di Desktop) */}
        <div className="flex flex-col gap-3 lg:gap-6 flex-1 items-center lg:items-start text-center lg:text-left z-10">
          <h1 className={`${serif.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F2A48]`}>
            Assalamualaikum Wr. Wb.
          </h1>
          <p className={`${serif.className} text-[0.85rem] sm:text-sm md:text-base lg:text-lg font-normal max-w-[280px] sm:max-w-md lg:max-w-lg leading-relaxed text-[#2A3555] opacity-90`}>
            Maha Suci Allah Subhanahu Wata’ala yang menciptakan makhluk-Nya berpasangan
          </p>
        </div>

        {/* BUKU QURAN (Bagian Kanan di Desktop) */}
        <div className="flex-1 w-full flex justify-center lg:justify-end xl:justify-center z-10">
          <QuranFlipbook />
        </div>

      </div>

      {/* BUNGA BAWAH */}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 z-20 flex w-full justify-center overflow-hidden transition-all duration-[1500ms] ease-out ${
          isOpened ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {Array.from({ length: repeatCount }).map((_, index) => (
          <Image
            key={`floral-bottom-${index}`}
            src={floralVertical}
            alt={`Dekorasi Bunga Bawah ${index + 1}`}
            placeholder='blur'
            className="w-full sm:min-w-[100%] md:min-w-[480px] md:max-w-[480px] shrink-0 h-auto object-cover rotate-180"
          />
        ))}
      </div>
      
    </section>
  );
};

export default Quran;