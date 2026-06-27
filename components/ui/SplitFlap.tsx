"use client";

import { AnimatePresence, motion } from "framer-motion";

function Slot({ d, idx }: { d: string; idx: number }) {
  return (
    <span
      className="relative inline-block overflow-hidden text-center"
      style={{ minWidth: d === "," ? "0.28em" : d === "." ? "0.28em" : "0.62em" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={d}
          className="block"
          initial={{ y: "-110%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "110%", opacity: 0, filter: "blur(4px)" }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 26,
            mass: 0.9,
            delay: idx * 0.04,
          }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function SplitFlap({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const digits = String(Math.round(value)).split("");
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", lineHeight: 1, ...style }}
    >
      {digits.map((d, i) => (
        <Slot key={i} d={d} idx={i} />
      ))}
    </span>
  );
}
