import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import EnvelopeIntro from "@/components/Envelopeintro";
import { EnvelopeProvider } from "@/src/context/EnvelopeContext"

// PAGES IMPORT
import Quran from "./pages/quran-1";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"] });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400" });

const goldText = {
  backgroundImage: "linear-gradient(120deg, #9A7B45, #D4B87A 45%, #B8975A)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams; // contoh: /?to=Bapak%20Andi
  return (
    <EnvelopeProvider>
      <EnvelopeIntro guest={to}>
        <main className=" bg-[#FFFFFF] text-[#1F2A48]">
          <Quran></Quran>
        </main>
      </EnvelopeIntro>
    </EnvelopeProvider>

    // <main className=" bg-[#FFFFFF] text-[#1F2A48]">
    //     <Quran></Quran>
    //   </main>
  );
}