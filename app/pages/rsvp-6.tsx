"use client";

import React, { useEffect, useRef, useState } from "react";
import { serif, serif_2, script } from "@/src/lib/font";
import { Send, User, MessageSquareHeart, CheckCircle2, XCircle } from "lucide-react";

const Rsvp = () => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "hadir", 
    message: "",
  });

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
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form UI berfungsi! (Integrasi database menyusul)");
  };

  return (
    <section 
      ref={ref} 
      /* Background dirubah menjadi Putih Murni (#FFFFFF) */
      className={`${serif_2.className} flex flex-col items-center justify-center px-6 py-24 bg-[#FFFFFF] overflow-hidden`}
    >
      {/* 1. JUDUL SECTION */}
      <div className={`text-center mb-10 ${baseTransition} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-navy mb-3">
          RSVP
        </h1>
        <p className={`${serif.className} text-sm sm:text-base text-navy/80 max-w-md mx-auto`}>
          Konfirmasi kehadiran Anda dan berikan doa restu untuk kedua mempelai.
        </p>
      </div>

      {/* 2. KOTAK FORM */}
      <form 
        onSubmit={handleSubmit}
        className={`w-full max-w-lg bg-white rounded-md shadow-2xl shadow-navy/5 border border-navy/15 p-6 sm:p-8 flex flex-col gap-6 relative z-10 ${baseTransition} delay-[200ms] ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}
      >
        {/* Input Nama */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={`${serif.className} text-navy font-semibold text-sm sm:text-base flex items-center gap-2`}>
            <User size={16} className="text-gold" />
            Nama Lengkap
          </label>
          <input 
            type="text" 
            id="name"
            placeholder="Tuliskan nama Anda..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            /* Background input menjadi putih murni dengan border navy */
            className="w-full bg-white border border-navy/30 rounded-sm px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            required
          />
        </div>

        {/* Pilihan Kehadiran */}
        <div className="flex flex-col gap-2">
          <label className={`${serif.className} text-navy font-semibold text-sm sm:text-base`}>
            Apakah Anda akan hadir?
          </label>
          <div className="flex flex-row gap-3 mt-1">
            {/* Tombol Hadir */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "hadir" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-all duration-300 ${
                formData.status === "hadir" 
                  /* Active: Navy background, White text, Gold icon */
                  ? "bg-navy border-navy text-white shadow-md" 
                  /* Inactive: White background, Navy border & text */
                  : "bg-white border-navy/30 text-navy hover:border-navy"
              }`}
            >
              <CheckCircle2 size={18} className={formData.status === "hadir" ? "text-gold" : "opacity-50"} />
              <span className="text-sm font-medium">Hadir</span>
            </button>

            {/* Tombol Tidak Hadir */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "tidak-hadir" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-all duration-300 ${
                formData.status === "tidak-hadir" 
                  /* Active: Navy background, White text */
                  ? "bg-navy border-navy text-white shadow-md" 
                  /* Inactive: White background, Navy border & text */
                  : "bg-white border-navy/30 text-navy hover:border-navy"
              }`}
            >
              <XCircle size={18} className={formData.status === "tidak-hadir" ? "text-white" : "opacity-50"} />
              <span className="text-sm font-medium">Tidak Hadir</span>
            </button>
          </div>
        </div>

        {/* Input Ucapan & Doa */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={`${serif.className} text-navy font-semibold text-sm sm:text-base flex items-center gap-2`}>
            <MessageSquareHeart size={16} className="text-gold" />
            Ucapan & Doa
          </label>
          <textarea 
            id="message"
            rows={4}
            placeholder="Tuliskan pesan atau doa untuk kedua mempelai..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-white border border-navy/30 rounded-sm px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
            required
          />
        </div>

        {/* Tombol Submit */}
        <button 
          type="submit"
          /* Teks menggunakan text-white, bukan text-cream */
          className="w-full flex items-center justify-center gap-2 bg-navy hover:opacity-90 text-white py-3.5 mt-2 rounded-sm text-sm font-semibold transition-all shadow-lg active:scale-95"
        >
          <Send size={18} />
          Kirim RSVP
        </button>
      </form>

      {/* 3. PLACEHOLDER DAFTAR UCAPAN & DOA */}
      <div className={`w-full max-w-lg mt-12 ${baseTransition} delay-[400ms] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between border-b border-navy/20 pb-2 mb-6">
          <h3 className={`${serif.className} text-lg font-semibold text-navy`}>Ucapan & Doa (0)</h3>
        </div>
        
        {/* Kotak state kosong */}
        <div className="w-full bg-white border border-navy/15 rounded-sm p-8 text-center shadow-sm">
          <MessageSquareHeart size={32} className="mx-auto text-gold mb-3 opacity-80" />
          <p className={`${serif.className} text-sm text-navy/70 italic`}>
            Belum ada ucapan dikirim. Jadilah yang pertama!
          </p>
        </div>
      </div>

    </section>
  );
};

export default Rsvp;