'use client';

import React from 'react';

interface AccessKeyCardProps {
  unitNumber: string;
  floor: number;
  accessPin: string;
  qrToken: string;
  validUntil: string;
  bookingCode: string;
}

export default function AccessKeyCard({
  unitNumber,
  floor,
  accessPin,
  qrToken,
  validUntil,
  bookingCode,
}: AccessKeyCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6 rounded-3xl shadow-2xl w-full max-w-sm mx-auto border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Smart Access Management</span>
          <h4 className="text-2xl font-black">Unit {unitNumber}</h4>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-extrabold">
          ACTIVE PASS
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center my-4">
        <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center text-center p-3 text-xs font-mono text-blue-300 border-4 border-dashed border-blue-500">
          [Scan QR Access Lift & Door]
          <br />
          <span className="text-[9px] text-gray-400 mt-2 block">{qrToken.slice(0, 20)}...</span>
        </div>
        <p className="text-slate-900 text-sm font-black font-mono mt-3">
          PIN SMART LOCK: <span className="tracking-widest text-blue-600 text-lg">{accessPin}</span>
        </p>
      </div>

      <div className="space-y-1 text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800">
        <p><span className="text-slate-500">Kode Reservasi:</span> {bookingCode}</p>
        <p><span className="text-slate-500">Posisi:</span> Lantai {floor}</p>
        <p><span className="text-slate-500">Akses Berlaku S/d:</span> {new Date(validUntil).toLocaleDateString('id-ID')}</p>
      </div>
    </div>
  );
}