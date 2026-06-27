"use client";

import { CSSProperties, ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ShimmerButton({
  children,
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className = "",
  onClick,
  disabled,
}: ShimmerButtonProps) {
  return (
    <button
      style={{
        "--spread": "90deg",
        "--shimmer-color": shimmerColor,
        "--radius": borderRadius,
        "--speed": shimmerDuration,
        "--cut": shimmerSize,
        "--bg": background,
      } as CSSProperties}
      className={[
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white",
        "[background:var(--bg)] [border-radius:var(--radius)]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className,
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {/* shimmer layer */}
      <div
        className={[
          "absolute inset-0 overflow-visible [container-type:size]",
          "[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]",
          "[translate:0_0]",
          "animate-shimmer-slide",
        ].join(" ")}
        style={{
          animation: `shimmerSlide var(--speed) linear infinite`,
        }}
      >
        <div
          className="absolute inset-[-100%] rotate-[-90deg]"
          style={{
            background: `conic-gradient(from calc(270deg - (var(--spread) * 0.5)), transparent 0, ${shimmerColor} var(--spread), transparent var(--spread))`,
          }}
        />
      </div>

      {/* cut out */}
      <div
        className="absolute inset-[var(--cut)] z-10 rounded-[calc(var(--radius)-var(--cut))]"
        style={{ background: "var(--bg)" }}
      />

      <span className="relative z-20">{children}</span>

      <style>{`
        @keyframes shimmerSlide {
          to { transform: translate(calc(100cqw - 100%), 0); }
        }
      `}</style>
    </button>
  );
}
