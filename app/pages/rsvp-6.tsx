"use client";

import React, { useEffect, useRef, useState } from "react";
import { serif, serif_2 } from "@/src/lib/font";
import { Send, User, MessageSquareHeart, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { submitRsvp } from "@/lib/actions"; // Sesuaikan path
import { toast } from "sonner"; // Import toast dari sonner (Shadcn UI)

// Tipe data ucapan untuk TypeScript
type WishItem = {
  _id: string;
  responderName: string;
  wishes: string;
  createdAt: string;
};

export default function Rsvp({ 
  guestName = "Tamu", 
  initialWishes = [] 
}: { 
  guestName?: string;
  initialWishes?: WishItem[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // State Form
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    responderName: "",
    attendanceStatus: "attending" as "attending" | "declining", 
    wishes: "",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";

  // Fungsi Submit terhubung ke Database dengan try...catch
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");

    try {
      const result = await submitRsvp({
        guestSlug: guestName,
        responderName: formData.responderName,
        attendanceStatus: formData.attendanceStatus,
        wishes: formData.wishes,
      });

      if (result.success) {
        setSuccessMsg("Terima kasih! RSVP & Doa Anda telah tersimpan.");
        toast.success("RSVP berhasil dikirim!");
        setFormData({ responderName: "", attendanceStatus: "attending", wishes: "" });
      } else {
        toast.error(result.message || "Gagal mengirim RSVP.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      // Tangkapan khusus jika internet terputus atau server mati
      toast.error("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={ref} className={`${serif_2.className} flex flex-col items-center justify-center px-6 py-20 bg-white overflow-hidden w-full`}>
      
      {/* 1. HEADER */}
      <div className={`text-center mb-10 ${baseTransition} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-navy mb-3">RSVP</h1>
        <p className={`${serif.className} text-sm sm:text-base text-navy/80 max-w-md mx-auto`}>
          Konfirmasi kehadiran Anda dan berikan doa restu untuk kedua mempelai.
        </p>
      </div>

      {/* 2. FORM RSVP */}
      <form onSubmit={handleSubmit} className={`w-full max-w-lg bg-white rounded-md shadow-2xl shadow-navy/5 border border-navy/15 p-6 sm:p-8 flex flex-col gap-6 relative z-10 ${baseTransition} delay-[200ms] ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}>
        
        {/* Input Nama */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={`${serif.className} text-navy font-semibold text-sm sm:text-base flex items-center gap-2`}>
            <User size={16} className="text-gold" /> Nama Lengkap
          </label>
          <input 
            type="text" id="name" required
            placeholder="Tuliskan nama Anda..."
            value={formData.responderName}
            onChange={(e) => setFormData({ ...formData, responderName: e.target.value })}
            className="w-full bg-white border border-navy/30 rounded-sm px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
          />
        </div>

        {/* Pilihan Kehadiran */}
        <div className="flex flex-col gap-2">
          <label className={`${serif.className} text-navy font-semibold text-sm sm:text-base`}>
            Apakah Anda akan hadir?
          </label>
          <div className="flex flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, attendanceStatus: "attending" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-all duration-300 ${
                formData.attendanceStatus === "attending" ? "bg-navy border-navy text-white shadow-md" : "bg-white border-navy/30 text-navy hover:border-navy"
              }`}
            >
              <CheckCircle2 size={18} className={formData.attendanceStatus === "attending" ? "text-gold" : "opacity-50"} />
              <span className="text-sm font-medium">Hadir</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, attendanceStatus: "declining" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-all duration-300 ${
                formData.attendanceStatus === "declining" ? "bg-navy border-navy text-white shadow-md" : "bg-white border-navy/30 text-navy hover:border-navy"
              }`}
            >
              <XCircle size={18} className={formData.attendanceStatus === "declining" ? "text-white" : "opacity-50"} />
              <span className="text-sm font-medium">Tidak Hadir</span>
            </button>
          </div>
        </div>

        {/* Input Ucapan */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={`${serif.className} text-navy font-semibold text-sm sm:text-base flex items-center gap-2`}>
            <MessageSquareHeart size={16} className="text-gold" /> Ucapan & Doa
          </label>
          <textarea 
            id="message" rows={3} required
            placeholder="Tuliskan doa untuk kedua mempelai..."
            value={formData.wishes}
            onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
            className="w-full bg-white border border-navy/30 rounded-sm px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
          />
        </div>

        {/* Tombol Submit & Pesan Sukses */}
        {successMsg && (
          <p className="text-green-600 text-sm font-medium text-center bg-green-50 py-2 rounded-sm border border-green-200">{successMsg}</p>
        )}
        <button 
          type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-navy hover:opacity-90 text-white py-3.5 mt-2 rounded-sm text-sm font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-70"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin text-gold" /> : <Send size={18} />}
          {isLoading ? "Mengirim..." : "Kirim RSVP"}
        </button>
      </form>

      {/* 3. DAFTAR UCAPAN & DOA DARI DATABASE */}
      <div className={`w-full max-w-lg mt-14 ${baseTransition} delay-[400ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="flex items-center justify-between border-b border-navy/20 pb-2 mb-6">
          <h3 className={`${serif.className} text-lg font-bold text-navy`}>Ucapan & Doa ({initialWishes.length})</h3>
        </div>
        
        {initialWishes.length === 0 ? (
          <div className="w-full bg-white border border-navy/15 rounded-sm p-8 text-center shadow-sm">
            <MessageSquareHeart size={32} className="mx-auto text-gold mb-3 opacity-80" />
            <p className={`${serif.className} text-sm text-navy/70 italic`}>Belum ada ucapan dikirim. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {initialWishes.map((wish) => (
              <div key={wish._id} className="bg-white border border-navy/10 shadow-sm p-4 rounded-sm flex flex-col gap-2 relative">
                {/* Aksen Emas Kiri */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-l-sm opacity-80"></div>
                
                <h4 className="font-bold text-navy text-sm">{wish.responderName}</h4>
                <p className={`${serif.className} text-sm text-navy/80 italic leading-relaxed`}>"{wish.wishes}"</p>
                
                <span className="text-[0.65rem] text-navy/40 mt-1 uppercase tracking-wider font-semibold">
                  {new Date(wish.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}