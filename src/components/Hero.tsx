import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import AuthButton from "./AuthButton";
import { BackgroundBeams } from "./ui/background-beams";

export default function Hero() {
  return (
    <div className="relative mx-auto w-full max-w-7xl min-h-screen px-6">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center "
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-600"
        glowColorDarkVar="--color-sky-900"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
      <BackgroundBeams />

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          
          {/* Left content */}
          <div className="max-w-xl">
            <h2 className="text-3xl font-normal tracking-tight text-neutral-400 sm:text-4xl md:text-5xl">
              Ready to use{" "}
              <strong className="font-bold text-white">ToolBox Pro</strong>?
            </h2>

            <p className="mt-4 text-base leading-relaxed text-neutral-400">
              Get access to premium tools, advanced features, and exclusive utilities built to speed up your workflow.
            </p>
          </div>

          {/* Right button */}
          <div className="flex">
            {/* <Link href="/auth/sign-in">
              <Button className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800" >
              Login
            </Button>
            </Link> */}
            <AuthButton/>
          </div>

        </div>
      </div>
    </div>
  );
}
