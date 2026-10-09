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

  // --- LOGIKA BARU: GOOGLE CALENDAR LINK ---
  const openGoogleCalendar = (agenda: AgendaItem) => {
    // Format tanggal ke UTC tanpa tanda strip/titik dua (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    // Merakit URL pintar Google Calendar
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", agenda.title); // Judul Acara
    url.searchParams.append("dates", `${formatDate(agenda.startDate)}/${formatDate(agenda.endDate)}`); // Waktu
    url.searchParams.append("details", agenda.description); // Catatan
    url.searchParams.append("location", agenda.location); // Lokasi

    // Buka di tab baru (akan otomatis membuka aplikasi di HP)
    window.open(url.toString(), "_blank");
  };

  return (
    <section 
      ref={ref} 
      className="flex flex-col items-center justify-center py-16 px-4 bg-[#FFFFFF] overflow-hidden"
    >
      <div 
        className={`relative w-full max-w-sm md:max-w-md border border-navy/30 rounded-sm p-8 pb-12 transition-all duration-[1500ms] ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <Image 
          src={floralVertical}
          alt="Dekorasi"
          className="absolute -top-12 -right-12 w-32 h-auto rotate-[135deg] pointer-events-none drop-shadow-sm opacity-90"
        />
        <Image 
          src={floralVertical}
          alt="Dekorasi"
          className="absolute -bottom-12 -left-12 w-32 h-auto -rotate-[45deg] pointer-events-none drop-shadow-sm opacity-90"
        />

        <div className="flex flex-row items-center justify-center gap-3 mb-8 z-10 relative">
          <h2 className={`${serif_2.className} text-3xl sm:text-4xl text-navy font-bold italic`}>
            Tanggal
          </h2>
          <CalendarDays className="text-navy" size={28} strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-6 z-10 relative">
          {agendas.map((agenda, index) => (
            <div 
              key={agenda.id} 
              className={`flex flex-col items-center text-center transition-all duration-1000 delay-[${index * 300}ms] ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex flex-row items-center w-full mb-3">
                <div className="flex-1 border-t border-gold/40"></div>
                <span className={`${serif.className} px-4 text-navy/80 text-sm font-medium`}>
                  {agenda.label}
                </span>
                <div className="flex-1 border-t border-gold/40"></div>
              </div>

              <p className={`${serif.className} text-navy text-base sm:text-lg mb-1`}>
                {agenda.dateText}
              </p>
              <p className={`${serif.className} text-navy/80 text-xs sm:text-sm mb-4`}>
                {agenda.timeText}
              </p>

              {/* TOMBOL MENGGUNAKAN FUNGSI BARU */}
              <button 
                onClick={() => openGoogleCalendar(agenda)}
                className="bg-navy hover:bg-navy-alt text-cream w-[90%] sm:w-[80%] py-2 rounded-sm text-sm font-medium transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
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