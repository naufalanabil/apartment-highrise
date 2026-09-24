import React, { useState } from 'react';

export default function SmartDoorLockAccess({ assignedPin = "772833" }: { assignedPin: string }) {
  const [inputPin, setInputPin] = useState("");
  const [lockStatus, setLockStatus] = useState<"locked" | "unlocked" | "error">("locked");

  // Fungsi saat tombol angka di keypad diklik
  const handleNumClick = (num: string) => {
    if (inputPin.length < 6) {
      setInputPin((prev) => prev + num);
    }
  };

  // Fungsi untuk menghapus angka terakhir (Backspace)
  const handleClear = () => {
    setInputPin((prev) => prev.slice(0, -1));
    setLockStatus("locked");
  };

  // Fungsi untuk memverifikasi PIN
  const handleUnlock = () => {
    if (inputPin === assignedPin) {
      setLockStatus("unlocked");
    } else {
      setLockStatus("error");
      setTimeout(() => setLockStatus("locked"), 2000); // Reset error setelah 2 detik
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl max-w-sm mx-auto text-white">
      <h3 className="text-base font-black mb-1">Smart Door Lock Keypad</h3>
      <p className="text-xs text-slate-400 mb-4">Masukkan 6-digit PIN unit Anda untuk membuka pintu.</p>

      {/* Layar / Display PIN */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4 text-center">
        <p className="text-2xl font-mono tracking-widest font-black text-blue-400">
          {inputPin ? inputPin.padEnd(6, "•") : "------"}
        </p>
        <p className={`text-[10px] font-bold mt-2 ${
          lockStatus === "unlocked" ? "text-emerald-400" :
          lockStatus === "error" ? "text-rose-400" : "text-slate-500"
        }`}>
          {lockStatus === "unlocked" ? "🔓 PINTU TERBUKA (Access Granted)" :
           lockStatus === "error" ? "❌ PIN SALAH! Coba lagi." : "🔒 Terkunci (Locked)"}
        </p>
      </div>

      {/* Tombol Keypad Angka (1-9, 0) */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "C") setInputPin("");
              else if (btn === "⌫") handleClear();
              else handleNumClick(btn);
            }}
            className="bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl py-3 text-sm font-bold transition-all active:scale-95"
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Tombol Konfirmasi Buka */}
      <button
        onClick={handleUnlock}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg"
      >
        🔑 Buka Pintu (Unlock)
      </button>
    </div>
  );
}