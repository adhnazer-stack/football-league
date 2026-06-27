"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9b59b6",
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "[background:linear-gradient(var(--bg),var(--bg))_padding-box,conic-gradient(from_calc(var(--angle)*(1deg)),var(--color-from),var(--color-to),transparent_60%)_border-box]",
        "[animation:border-beam_var(--duration)_linear_infinite]",
        className,
      )}
      style={{
        "--size": size,
        "--duration": duration,
        "--delay": delay,
        "--angle": 0,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--border-width": borderWidth,
        "--bg": "transparent",
        animationDelay: `calc(var(--delay) * -1s)`,
      } as CSSProperties}
    >
      <style>{`
        @keyframes border-beam {
          from { --angle: 0; }
          to { --angle: 360; }
        }
        @property --angle {
          syntax: '<number>';
          initial-value: 0;
          inherits: false;
        }
      `}</style>
    </div>
  );
}
