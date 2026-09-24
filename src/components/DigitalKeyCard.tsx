'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalKeyCardProps {
  unitNumber: string;
  floor: number;
}

export default function DigitalKeyCard({ unitNumber, floor }: DigitalKeyCardProps) {
  // Rumus generator PIN universal yang disamakan dengan SmartLockSimulator & page.tsx
  const generateUniversalPin = (unit: string) => {
    let hash = 0;
    for (let i = 0; i < unit.length; i++) {
      hash = unit.charCodeAt(i) + ((hash << 5) - hash);
    }
    return String(Math.abs(hash) % 900000 + 100000);
  };

  const pin = generateUniversalPin(unitNumber);
  const bookingCode = `BK-${unitNumber}${Math.abs(Number(unitNumber) * 7) % 900}`;

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin);
    alert(`PIN ${pin} untuk Unit ${unitNumber} berhasil disalin!`);
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-800 max-w-md mx-auto font-sans relative overflow-hidden">
      {/* Header Kartu */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Smart Access Pass</p>
          <h3 className="text-xl font-black text-white">Unit {unitNumber}</h3>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full">
          ACTIVE PASS
        </span>
      </div>

      {/* QR Code Container */}
      <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-inner">
        <QRCodeSVG 
          value={`https://skyresidence.id/access?unit=${unitNumber}&pin=${pin}&floor=${floor}`} 
          size={160} 
        />
        <p className="text-[10px] text-slate-500 font-mono mt-3 tracking-wider">
          PASS-BK-{unitNumber}-{pin}-SECURE
        </p>
      </div>

      {/* PIN Section */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">PIN Smart Lock</p>
          <p className="text-2xl font-black tracking-widest text-blue-400 font-mono mt-0.5">{pin}</p>
        </div>
        <button
          onClick={handleCopyPin}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          Salin
        </button>
      </div>

      {/* Informasi Detail */}
      <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800 pt-4">
        <div className="flex justify-between">
          <span>Kode Reservasi:</span>
          <span className="font-bold text-slate-200">{bookingCode}</span>
        </div>
        <div className="flex justify-between">
          <span>Lokasi:</span>
          <span className="font-bold text-slate-200">Lantai {floor}</span>
        </div>
        <div className="flex justify-between">
          <span>Masa Akses:</span>
          <span className="font-bold text-slate-200">s/d 22/10/2026</span>
        </div>
      </div>
    </div>
  );
}