"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3, VolumeX } from "lucide-react";
import { useEnvelope } from "@/src/context/EnvelopeContext"; // Sesuaikan path

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mengambil status apakah amplop sudah dibuka
  const { isOpened } = useEnvelope(); 

  // Efek untuk memutar lagu otomatis HANYA SETELAH amplop dibuka
  useEffect(() => {
    if (isOpened && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay ditolak browser:", err);
        });
    }
  }, [isOpened]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* 
        Tag audio HTML5 disembunyikan. 
        Atribut loop memastikan lagu berputar terus.
      */}
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />

      {/* 
        Render tombol melayang HANYA jika amplop sudah dibuka.
        Menggunakan z-[60] agar selalu berada di atas elemen lain.
      */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle Music"
          className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-[#1F2A48] text-[#D4B87A] shadow-lg border border-[#D4B87A]/30 transition-all hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Disc3 className="h-6 w-6 animate-[spin_4s_linear_infinite]" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </button>
      )}
    </>
  );
}