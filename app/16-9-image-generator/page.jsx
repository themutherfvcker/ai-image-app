"use client";
import dynamic from "next/dynamic";
const FullEditor = dynamic(() => import("@/components/ratio16/FullEditor"), { ssr: false });

export const metadata = {
  title: "Nano Banana 16:9 — Fix Gemini Nano Banana 16:9 Aspect Ratio Problems",
  description: "Generate native 16:9 images or convert any photo to 16:9.",
};

export default function Page() {
  return <FullEditor />;
}
