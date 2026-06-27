"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<Array<CSSProperties>>([]);

  useEffect(() => {
    const styles = Array.from({ length: number }, () => ({
      top: "-5%",
      left: `${Math.floor(Math.random() * window.innerWidth)}px`,
      animationDelay: `${Math.random() * 0.6 + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
          style={{
            ...style,
            background: "linear-gradient(90deg, #00FF87, transparent)",
            boxShadow: "0 0 0 1px rgba(0,255,135,0.1)",
          } as React.CSSProperties}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-[#00FF87] to-transparent" />
        </span>
      ))}
      <style>{`
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
        }
        .animate-meteor { animation: meteor linear infinite; }
      `}</style>
    </>
  );
}

type CSSProperties = React.CSSProperties;
