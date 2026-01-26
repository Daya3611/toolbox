import Hero from "@/components/Hero";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <BackgroundBeams />
    </div>
  );
}
