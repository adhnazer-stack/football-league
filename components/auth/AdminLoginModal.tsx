"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/context";

interface Props { open: boolean; onClose: () => void; }

export function AdminLoginModal({ open, onClose }: Props) {
  const { adminLogin, isAdmin, adminLogout } = useApp();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = adminLogin(pw);
      setLoading(false);
      if (ok) { setPw(""); setError(""); onClose(); }
      else { setError("Incorrect Password"); setPw(""); }
    }, 500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-[201] inset-x-4 mx-auto max-w-sm"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
          >
            <div
              className="rounded-2xl p-6 relative"
              style={{
                background: "var(--card-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,215,0,0.25)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,215,0,0.05)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>

              {/* Icon + title */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,rgba(255,215,0,0.18),rgba(201,150,60,0.1))",
                    border: "1px solid rgba(255,215,0,0.35)",
                    boxShadow: "0 0 30px rgba(255,215,0,0.12)",
                  }}
                  animate={{ boxShadow: ["0 0 20px rgba(255,215,0,0.1)","0 0 40px rgba(255,215,0,0.25)","0 0 20px rgba(255,215,0,0.1)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {isAdmin ? <ShieldCheck size={28} style={{ color: "#22c55e" }} /> : <Lock size={28} style={{ color: "#ffd700" }} />}
                </motion.div>
                <div className="text-center">
                  <h2 className="font-black text-lg" style={{ color: "var(--text-primary)" }}>
                    {isAdmin ? "Admin Mode Active" : "Admin Login"}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {isAdmin ? "Full access enabled" : "Enter password to access admin tools"}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <ShieldCheck size={18} style={{ color: "#22c55e" }} />
                    <p className="text-sm font-bold" style={{ color: "#22c55e" }}>Admin Mode Active — Full Access</p>
                  </div>
                  <motion.button
                    onClick={() => { adminLogout(); onClose(); }}
                    className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  >
                    <Lock size={14} /> Logout from Admin
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={pw}
                      onChange={e => { setPw(e.target.value); setError(""); }}
                      placeholder="Enter admin password"
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
                        color: "var(--text-primary)",
                        paddingRight: "44px",
                      }}
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}
                      >
                        ❌ Incorrect Password
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={!pw || loading}
                    className="w-full py-3.5 rounded-xl text-sm font-black text-black flex items-center justify-center gap-2"
                    style={{
                      background: pw && !loading ? "linear-gradient(135deg,#c9963c,#ffd700)" : "rgba(255,255,255,0.08)",
                      color: pw && !loading ? "#0a0f1e" : "var(--text-muted)",
                      transition: "all 0.2s",
                    }}
                    whileHover={pw ? { scale: 1.02 } : {}}
                    whileTap={pw ? { scale: 0.97 } : {}}
                  >
                    <Lock size={14} />
                    {loading ? "Verifying..." : "Enter Admin Mode"}
                  </motion.button>

                  <p className="text-center text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Visitors can view all stats without logging in
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
