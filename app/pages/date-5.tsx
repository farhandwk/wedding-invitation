// import React from "react";
// import { CalendarDays } from "lucide-react"

// import { serif, serif_2 } from "@/src/lib/font";

// type dataDate = {
//     id:string;
//     date:string;

// }

// const DatePage = () => {
    
//     return (
//         <section className={`${serif_2.className} px-8`}>
//             <div className="flex flex-col items-center border-navy border-2">
//                 <div className="flex flex-row gap-2">
//                     <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic text-navy">Tanggal</h1>
//                     <CalendarDays size={28}/>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default DatePage;

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { serif, serif_2 } from "@/src/lib/font";

// Gunakan aset bunga yang sama, atau sesuaikan dengan nama file Anda
import floralVertical from "../../src/assets/floral-blue-white-corner.png";

// 1. STRUKTUR DATA ARRAY YANG EFEKTIF
type AgendaItem = {
  id: string;
  label: string;      // Contoh: "Agenda 1" atau "Akad Nikah"
  dateText: string;   // Tampilan teks tanggal
  timeText: string;   // Tampilan teks waktu
  
  // Data wajib untuk integrasi Kalender (.ics)
  title: string;      
  description: string;
  location: string;
  startDate: Date;    // Waktu mulai sesungguhnya
  endDate: Date;      // Waktu selesai sesungguhnya
};

const agendas: AgendaItem[] = [
  {
    id: "1",
    label: "Hari ke-1",
    dateText: "Minggu, 1 November 2026",
    timeText: "Pukul 11.00 WIB s.d. Selesai",
    title: "Akad Nikah Dhimas & Gita",
    description: "Mohon doa restu untuk pernikahan Dhimas & Gita.",
    location: "Desa Gondang RT 1C, RW 1, Watumalang, Wonosobo",
    startDate: new Date("2026-11-01T11:00:00+07:00"), 
    endDate: new Date("2026-11-01T14:00:00+07:00"), // Estimasi selesai jam 14.00
  },
  {
    id: "2",
    label: "Hari ke-2",
    dateText: "Senin, 2 November 2026",
    timeText: "Pukul 10.00 WIB s.d. Selesai",
    title: "Resepsi Dhimas & Gita",
    description: "Kehadiran Anda adalah kehormatan bagi kami.",
    location: "Desa Gondang RT 1C, RW 1, Watumalang, Wonosobo",
    startDate: new Date("2026-11-02T10:00:00+07:00"), // Diubah ke tanggal 2 Nov, jam 10.00
    endDate: new Date("2026-11-02T14:00:00+07:00"), // Estimasi selesai jam 14.00
  },
  {
    id: "3",
    label: "Hari ke-3",
    dateText: "Selasa, 3 November 2026",
    timeText: "Pukul 10.00 WIB s.d. Selesai",
    title: "Resepsi Dhimas & Gita",
    description: "Kehadiran Anda adalah kehormatan bagi kami.",
    location: "Desa Gondang RT 1C, RW 1, Watumalang, Wonosobo",
    startDate: new Date("2026-11-03T10:00:00+07:00"), // Diubah ke tanggal 3 Nov, jam 10.00
    endDate: new Date("2026-11-03T14:00:00+07:00"), // Estimasi selesai jam 14.00
  },
  {
    id: "4",
    label: "Hari ke-4",
    dateText: "Rabu, 4 November 2026", // Sedikit koreksi: 4 November 2026 itu hari Rabu, bukan Kamis
    timeText: "Pukul 10.00 WIB s.d. Selesai",
    title: "Resepsi Dhimas & Gita",
    description: "Kehadiran Anda adalah kehormatan bagi kami.",
    location: "Desa Gondang RT 1C, RW 1, Watumalang, Wonosobo",
    startDate: new Date("2026-11-04T10:00:00+07:00"), // Diubah ke tanggal 4 Nov, jam 10.00
    endDate: new Date("2026-11-04T14:00:00+07:00"), // Estimasi selesai jam 14.00
  },
];

export default function AgendaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animasi saat di-scroll
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2. LOGIKA DOWNLOAD FILE .ICS (UNTUK IOS, WINDOWS, ANDROID)
  const downloadICS = (agenda: AgendaItem) => {
    // Helper untuk format tanggal ke format ICS (YYYYMMDDTHHMMSSZ) di UTC
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DhimasGitaWedding//ID
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${agenda.title}
DTSTART:${formatICSDate(agenda.startDate)}
DTEND:${formatICSDate(agenda.endDate)}
LOCATION:${agenda.location}
DESCRIPTION:${agenda.description}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Pengingat Acara
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Buat file sementara di browser dan paksa download
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${agenda.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      ref={ref} 
      className="flex flex-col items-center justify-center py-16 px-12 bg-[#FFFFFF] overflow-hidden"
    >
      <div 
        className={`relative w-full max-w-sm md:max-w-md border-2 border-navy/30 rounded-sm p-8 pb-12 transition-all duration-[1500ms] ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* BUNGA POJOK KANAN ATAS (Menyesuaikan desain figma) */}
        <Image 
          src={floralVertical}
          alt="Dekorasi"
          className="absolute -top-8 -right-8 w-42 h-auto rotate-[0deg] pointer-events-none drop-shadow-sm opacity-90"
        />

        {/* BUNGA POJOK KIRI BAWAH */}
        <Image 
          src={floralVertical}
          alt="Dekorasi"
          className="absolute -bottom-8 -left-8 w-42 h-auto -rotate-[180deg] pointer-events-none drop-shadow-sm opacity-90"
        />

        {/* JUDUL SECTION */}
        <div className="flex flex-row items-center justify-center gap-3 mb-8 z-10 relative">
          <h2 className={`${serif_2.className} text-3xl sm:text-4xl text-navy font-bold italic`}>
            Tanggal
          </h2>
          <CalendarDays className="text-navy" size={28} strokeWidth={1.5} />
        </div>

        {/* LIST AGENDA */}
        <div className="flex flex-col gap-6 z-10 relative">
          {agendas.map((agenda, index) => (
            <div 
              key={agenda.id} 
              className={`flex flex-col items-center text-center transition-all duration-1000 delay-[${index * 300}ms] ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* GARIS PEMISAH DENGAN TEKS DI TENGAH */}
              <div className="flex flex-row items-center w-full mb-3">
                <div className="flex-1 border-t border-gold/40"></div>
                <span className={`${serif.className} px-4 text-navy/80 text-sm font-medium`}>
                  {agenda.label}
                </span>
                <div className="flex-1 border-t border-gold/40"></div>
              </div>

              {/* DETAIL WAKTU */}
              <p className={`${serif.className} text-navy text-base sm:text-lg mb-1`}>
                {agenda.dateText}
              </p>
              <p className={`${serif.className} text-navy/80 text-xs sm:text-sm mb-4`}>
                {agenda.timeText}
              </p>

              {/* TOMBOL SIMPAN TANGGAL */}
              <button 
                onClick={() => downloadICS(agenda)}
                className="bg-navy hover:bg-navy-alt text-cream w-[90%] sm:w-[80%] py-2 rounded-sm text-sm font-medium transition-all shadow-md active:scale-95"
              >
                Simpan Tanggal
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}