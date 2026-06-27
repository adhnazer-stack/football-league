"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl px-4 py-1.5 text-sm font-medium",
        "shadow-[inset_0_-8px_10px_#8fdfff1f]",
        "transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]",
        "bg-white/40 dark:bg-black/40 backdrop-blur-sm",
        className,
      )}
    >
      <div
        className="absolute inset-0 block h-full w-full animate-gradient rounded-2xl"
        style={{
          background: "linear-gradient(90deg, #ffaa40 0%, #9b59b6 25%, #00d4ff 50%, #9b59b6 75%, #ffaa40 100%)",
          backgroundSize: "300% 100%",
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          animation: "gradientShift 4s linear infinite",
        }}
      />
      <span
        className="inline animate-gradient bg-clip-text text-transparent"
        style={{
          background: "linear-gradient(90deg, #ffaa40 0%, #9b59b6 25%, #00d4ff 50%, #9b59b6 75%, #ffaa40 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradientShift 4s linear infinite",
        }}
      >
        {children}
      </span>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  );
}
