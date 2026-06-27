"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Edit3, UserPlus, Trash2, RefreshCw,
  Download, Upload, FileJson, ArrowLeft, Check, AlertTriangle,
} from "lucide-react";
import type { RMPlayer } from "@/lib/round-management-data";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  players: RMPlayer[];
  language: string;
  onRenamePlayer: (id: string, name: string) => void;
  onAddPlayer: (name: string) => void;
  onDeletePlayer: (id: string) => void;
  onResetLeague: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
}

type SubView =
  | null
  | "editNames"
  | "addPlayer"
  | "deletePlayer"
  | "resetLeague";

const MENU_ITEMS = [
  { key: "editNames",   icon: <Edit3 size={16} />,      label: "Edit Player Names",   labelAr: "تعديل أسماء اللاعبين",   color: "#3b82f6" },
  { key: "addPlayer",   icon: <UserPlus size={16} />,    label: "Add New Player",       labelAr: "إضافة لاعب جديد",        color: "#22c55e" },
  { key: "deletePlayer",icon: <Trash2 size={16} />,      label: "Delete Player",        labelAr: "حذف لاعب",               color: "#ef4444" },
  { key: "resetLeague", icon: <RefreshCw size={16} />,   label: "Reset League",         labelAr: "إعادة ضبط الدوري",       color: "#f97316" },
  { key: "backupData",  icon: <Download size={16} />,    label: "Backup Data",          labelAr: "نسخ احتياطي",            color: "#8b5cf6" },
  { key: "exportJSON",  icon: <FileJson size={16} />,    label: "Export JSON",          labelAr: "تصدير JSON",             color: "#06b6d4" },
  { key: "restoreBackup",icon: <Upload size={16} />,     label: "Restore Backup",       labelAr: "استعادة نسخة احتياطية", color: "#f59e0b" },
  { key: "importJSON",  icon: <FileJson size={16} />,    label: "Import JSON",          labelAr: "استيراد JSON",           color: "#14b8a6" },
];

export function SettingsPanel({
  open, onClose, players, language,
  onRenamePlayer, onAddPlayer, onDeletePlayer, onResetLeague, onExport, onImport,
}: SettingsPanelProps) {
  const isAr = language === "ar";
  const [subView, setSubView] = useState<SubView>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newPlayerName, setNewPlayerName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSubView(null);
    setEditValues({});
    setNewPlayerName("");
    setDeleteConfirm(null);
    setResetConfirm(false);
    onClose();
  };

  const handleMenuClick = (key: string) => {
    if (key === "backupData" || key === "exportJSON") { onExport(); return; }
    if (key === "restoreBackup" || key === "importJSON") { fileRef.current?.click(); return; }
    setSubView(key as SubView);
    setEditValues(Object.fromEntries(players.map((p) => [p.id, p.name])));
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (typeof evt.target?.result === "string") onImport(evt.target.result);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileImport} />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[400]"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full z-[401] flex flex-col"
              style={{
                width: "min(380px, 100vw)",
                background: "linear-gradient(180deg,#060c1a 0%,#050810 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {subView ? (
                  <button
                    onClick={() => setSubView(null)}
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <ArrowLeft size={16} />
                    {isAr ? "رجوع" : "Back"}
                  </button>
                ) : (
                  <h2 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
                    ⚙ {isAr ? "الإعدادات" : "Settings"}
                  </h2>
                )}
                <button onClick={handleClose} className="nav-icon-btn">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <AnimatePresence mode="wait">
                  {/* Main menu */}
                  {!subView && (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="space-y-2"
                    >
                      {MENU_ITEMS.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => handleMenuClick(item.key)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span style={{ color: item.color }}>{item.icon}</span>
                          <span>{isAr ? item.labelAr : item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Edit Player Names */}
                  {subView === "editNames" && (
                    <motion.div
                      key="editNames"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-2"
                    >
                      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                        {isAr ? "عدّل أسماء اللاعبين ثم اضغط تأكيد" : "Edit names and click confirm"}
                      </p>
                      {players.map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <input
                            value={editValues[p.id] ?? p.name}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "var(--text-primary)",
                              direction: "rtl",
                            }}
                          />
                          <button
                            onClick={() => onRenamePlayer(p.id, editValues[p.id] ?? p.name)}
                            className="p-2 rounded-lg"
                            style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Add New Player */}
                  {subView === "addPlayer" && (
                    <motion.div
                      key="addPlayer"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                    >
                      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                        {isAr ? "أدخل اسم اللاعب الجديد" : "Enter new player name"}
                      </p>
                      <input
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newPlayerName.trim()) {
                            onAddPlayer(newPlayerName.trim());
                            setNewPlayerName("");
                          }
                        }}
                        placeholder={isAr ? "الاسم..." : "Name..."}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "var(--text-primary)",
                          direction: "rtl",
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newPlayerName.trim()) {
                            onAddPlayer(newPlayerName.trim());
                            setNewPlayerName("");
                          }
                        }}
                        disabled={!newPlayerName.trim()}
                        className="w-full py-3 rounded-xl font-black text-sm"
                        style={{
                          background: newPlayerName.trim() ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.05)",
                          color: newPlayerName.trim() ? "#fff" : "var(--text-muted)",
                        }}
                      >
                        <UserPlus size={14} className="inline mr-2" />
                        {isAr ? "إضافة لاعب" : "Add Player"}
                      </button>
                    </motion.div>
                  )}

                  {/* Delete Player */}
                  {subView === "deletePlayer" && (
                    <motion.div
                      key="deletePlayer"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-2"
                    >
                      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                        {isAr ? "اختر لاعباً لحذفه" : "Select a player to delete"}
                      </p>
                      {players.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                            <span className="text-sm" style={{ color: "var(--text-primary)", direction: "rtl" }}>{p.name}</span>
                          </div>
                          {deleteConfirm === p.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => { onDeletePlayer(p.id); setDeleteConfirm(null); }}
                                className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                                style={{ background: "#ef4444" }}
                              >
                                {isAr ? "تأكيد" : "Delete"}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 rounded-lg text-xs"
                                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
                              >
                                {isAr ? "إلغاء" : "Cancel"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="p-1.5 rounded-lg"
                              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Reset League */}
                  {subView === "resetLeague" && (
                    <motion.div
                      key="resetLeague"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="flex flex-col items-center text-center gap-4 pt-6"
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                        <AlertTriangle size={28} style={{ color: "#ef4444" }} />
                      </div>
                      <div>
                        <h3 className="font-black text-base mb-1" style={{ color: "var(--text-primary)" }}>
                          {isAr ? "إعادة ضبط الدوري" : "Reset League"}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                          {isAr
                            ? "سيتم حذف جميع الجولات والنقاط. لا يمكن التراجع عن هذا الإجراء."
                            : "All rounds and points will be deleted. This cannot be undone."}
                        </p>
                      </div>
                      {resetConfirm ? (
                        <div className="flex gap-3 w-full">
                          <button
                            onClick={() => { onResetLeague(); setResetConfirm(false); setSubView(null); }}
                            className="flex-1 py-3 rounded-xl font-black text-sm text-white"
                            style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}
                          >
                            {isAr ? "تأكيد الحذف" : "Confirm Reset"}
                          </button>
                          <button
                            onClick={() => setResetConfirm(false)}
                            className="flex-1 py-3 rounded-xl font-black text-sm"
                            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                          >
                            {isAr ? "إلغاء" : "Cancel"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResetConfirm(true)}
                          className="w-full py-3 rounded-xl font-black text-sm text-white"
                          style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}
                        >
                          {isAr ? "إعادة الضبط" : "Reset Everything"}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
