// src/lib/fonts.ts
import { Cormorant_Garamond, Pinyon_Script, Cormorant_Infant } from "next/font/google";

// Tambahkan display: "swap" agar teks tidak hilang saat font sedang dimuat
export const serif = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"],
  display: "swap",
});

export const script = Pinyon_Script({ 
  subsets: ["latin"], 
  weight: "400",
  display: "swap",
});

export const serif_2 = Cormorant_Infant({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
})